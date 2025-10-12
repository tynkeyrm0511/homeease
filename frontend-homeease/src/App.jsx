import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard';
import ResidentsList from './components/Residents/ResidentsList';
import Header from './components/Header';
import InvoiceList from './components/Invoices/InvoiceList';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedResidentId, setSelectedResidentId] = useState(null);
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

  // Main app for authenticated users
  return (
    <>
      <Header setCurrentView={setCurrentView} />
      <div className="container-fluid mt-4">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'residents' && <ResidentsList selectedResidentId={selectedResidentId} />}
        {currentView === 'requests' && <div className="p-4">Yêu cầu đang được phát triển...</div>}
        {currentView === 'invoices' && <InvoiceList onShowResidentDetail={(residentId) => {
          setSelectedResidentId(residentId);
          setCurrentView('residents');
        }} />}
        {currentView === 'notifications' && <div className="p-4">Thông báo đang được phát triển...</div>}
      </div>
    </>
  );
}

export default App;
