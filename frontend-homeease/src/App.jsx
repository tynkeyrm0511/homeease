import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard';
import ResidentsList from './components/Residents/ResidentsList';
import Header from './components/Header';
import InvoiceList from './components/Invoices/InvoiceList';
import { Spin } from 'antd';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

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
  const [tabLoading, setTabLoading] = useState(false);
  const { user, loading } = useAuth();

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

  // Main app for authenticated users
  return (
    <>
      <Header setCurrentView={handleTabChange} />
      <div className="container-fluid mt-4" style={{ position: 'relative', minHeight: 300 }}>
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
        {!tabLoading && currentView === 'dashboard' && <Dashboard />}
        {!tabLoading && currentView === 'residents' && <ResidentsList selectedResidentId={selectedResidentId} />}
        {!tabLoading && currentView === 'requests' && <div className="p-4">Yêu cầu đang được phát triển...</div>}
        {!tabLoading && currentView === 'invoices' && <InvoiceList onShowResidentDetail={(residentId) => {
          setSelectedResidentId(residentId);
          handleTabChange('residents');
        }} />}
        {!tabLoading && currentView === 'notifications' && <div className="p-4">Thông báo đang được phát triển...</div>}
      </div>
    </>
  );
}

export default App;
