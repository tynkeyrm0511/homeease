import { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} />;
      case 'residents':
        return (
          <div className="container-xl px-4 py-4">
            <div className="row mb-4">
              <div className="col-12">
                <h4 className="mb-3 fw-semibold">Quản lý Cư dân</h4>
              </div>
            </div>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <p className="mb-0">Tính năng đang phát triển...</p>
              </div>
            </div>
          </div>
        );
      case 'requests':
      case 'invoices':
      case 'notifications': {
        const titles = {
          'requests': 'Quản lý Yêu cầu',
          'invoices': 'Quản lý Hóa đơn',
          'notifications': 'Thông báo'
        };
        return (
          <div className="container-xl px-4 py-4">
            <div className="row mb-4">
              <div className="col-12">
                <h4 className="mb-3 fw-semibold">{titles[currentView]}</h4>
              </div>
            </div>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <p className="mb-0">Tính năng đang phát triển...</p>
              </div>
            </div>
          </div>
        );
      }
      default:
        return <Dashboard setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main>{renderContent()}</main>
    </div>
  );
}

export default App;
