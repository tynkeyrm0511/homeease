import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { message } from 'antd';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard';
import ResidentsList from './components/Residents/ResidentsList';
import RequestAdminPage from './components/Requests/RequestAdminPage';
import Header from './components/Header';
import InvoiceList from './components/Invoices/InvoiceList';
import NotificationList from './components/Notifications/NotificationList';
import ResidentDashboard from './components/ResidentsUser/ResidentDashboard';
import MyRequests from './components/ResidentsUser/MyRequests';
import MyInvoices from './components/ResidentsUser/MyInvoices';
import ResidentProfile from './components/ResidentsUser/ResidentProfile';
import CreateRequest from './components/ResidentsUser/CreateRequest';
import { Spin } from 'antd';
import { ToastContainer } from 'react-toastify';
import InvoiceDetail from './components/Invoices/InvoiceDetail';
import PayInvoice from './components/Invoices/PayInvoice';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './compact-pages.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedResidentId, setSelectedResidentId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [tabLoading, setTabLoading] = useState(false);
  const { user, loading } = useAuth();

  // Set initial view depending on role after login
  useEffect(() => {
    if (user) {
      if (user.role === 'resident') {
        setCurrentView('resident-dashboard');
      } else {
        setCurrentView('dashboard');
      }
    }
  }, [user]);

  // Socket.io: listen for invoice paid events
  useEffect(() => {
    if (!user) return;
    const socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3000');
    socket.on('connect', () => console.log('socket connected', socket.id));
    socket.on('invoice:paid', (data) => {
      console.log('invoice:paid', data);
      message.success(`Hoàn tất thanh toán hóa đơn #${data.invoiceId}`);
      // For demo simplicity, reload page to refresh lists when payment occurs
      if (currentView === 'my-invoices' || currentView === 'invoices' || currentView === 'invoice-detail') {
        setTimeout(() => window.location.reload(), 600);
      }
    });
    return () => { socket.disconnect(); };
  }, [user, currentView]);

  // Show loading while checking authentication
  if (loading) {
    return <div className="d-flex justify-content-center p-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  // Show login if not authenticated
  if (!user) {
    return <Login onLoginSuccess={() => setCurrentView('dashboard')} />;
  }

  // Custom tab change handler with loading
  const handleTabChange = (view) => {
    setTabLoading(true);
    setTimeout(() => {
      setCurrentView(view);
      setTabLoading(false);
    }, 400); // loading 400ms cho cảm giác mượt
  };

  // Expose helper to show invoice or navigate to pay
  const handleShowInvoice = (inv, options = {}) => {
    setSelectedInvoice(inv)
    if (options?.pay) {
      handleTabChange('pay-invoice')
    } else {
      handleTabChange('invoice-detail')
    }
  }

  // Main app for authenticated users
  return (
    <>
  <Header setCurrentView={handleTabChange} currentView={currentView} />
        {!tabLoading && (currentView === 'dashboard' || currentView === 'resident-dashboard') ? (
        // Render Dashboard (admin view or resident-dashboard share same top-level component)
        <div className="dashboard-wrapper" style={{ position: 'relative' }}>
          {currentView === 'dashboard' ? <Dashboard setCurrentView={handleTabChange} /> : <ResidentDashboard onNavigate={handleTabChange} />}
        </div>
      ) : (
        // Other views with compact-layout wrapper
        <div className="compact-layout" style={{ position: 'relative' }}>
          {tabLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255,255,255,0.6)',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Spin size="large" />
            </div>
          )}
          {!tabLoading && currentView === 'residents' && <ResidentsList selectedResidentId={selectedResidentId} />}
          {!tabLoading && currentView === 'requests' && <RequestAdminPage />}
          {!tabLoading && currentView === 'invoices' && <InvoiceList onShowResidentDetail={(residentId) => {
            setSelectedResidentId(residentId);
            handleTabChange('residents');
          }} />}
          {!tabLoading && currentView === 'notifications' && <NotificationList />}
          {!tabLoading && currentView === 'my-requests' && <MyRequests onNavigate={handleTabChange} />}
            {!tabLoading && currentView === 'my-invoices' && <MyInvoices onShowInvoice={(inv) => handleShowInvoice(inv)} />}
            {!tabLoading && currentView === 'invoice-detail' && <InvoiceDetail invoice={selectedInvoice} onPay={() => { handleTabChange('pay-invoice'); }} onBack={() => handleTabChange('my-invoices')} />}
            {!tabLoading && currentView === 'pay-invoice' && <PayInvoice invoice={selectedInvoice} onBack={() => handleTabChange('invoice-detail')} />}
            {!tabLoading && currentView === 'create-request' && <CreateRequest onNavigate={handleTabChange} />}
          {!tabLoading && currentView === 'profile' && <ResidentProfile />}
        </div>
      )}
    </>
  );
}

export default App;
