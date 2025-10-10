import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Header = ({ setCurrentView }) => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    setCurrentView('login');
  };

  const handleMenuClick = (view) => {
    console.log(`${view} clicked`);
    setCurrentView(view);
  };

  return (
    <>
      <header className="bg-white border-bottom shadow-sm fixed-top">
        <div className="container-fluid px-4 py-2">
          <div className="d-flex align-items-center justify-content-between">
            {/* Logo */}
            <div 
              className="d-flex align-items-center" 
              style={{ cursor: 'pointer', zIndex: 1000 }} 
              onClick={() => handleMenuClick('dashboard')}
              role="button"
              tabIndex={0}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="ms-2 fw-bold text-primary">HomeEase</span>
            </div>

            {/* Menu Items */}
            <div className="d-flex" style={{ zIndex: 1000 }}>
              {[
                { id: 'dashboard', name: 'Dashboard' },
                { id: 'residents', name: 'Cư dân' },
                { id: 'requests', name: 'Yêu cầu' },
                { id: 'invoices', name: 'Hóa đơn' },
                { id: 'notifications', name: 'Thông báo' }
              ].map(item => (
                <button 
                  key={item.id}
                  className="btn btn-link px-3 py-2 mx-1 text-secondary"
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                  onClick={() => handleMenuClick(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* User Menu */}
            <div className="d-flex align-items-center position-relative" style={{ zIndex: 1000 }}>
              <button 
                className="btn btn-link p-0 d-flex align-items-center" 
                style={{ textDecoration: 'none', cursor: 'pointer' }}
                onClick={() => {
                  console.log('User menu clicked');
                  setShowDropdown(!showDropdown);
                }}
              >
                <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white" style={{width: '32px', height: '32px'}}>
                  <span className="fw-bold">{user?.name?.charAt(0) || 'A'}</span>
                </div>
                <span className="ms-2 d-none d-sm-inline text-dark">{user?.name || 'Administrator'}</span>
              </button>
              
              {showDropdown && (
                <div className="position-absolute dropdown-menu dropdown-menu-end shadow-sm show" style={{ top: '40px', right: 0, display: 'block' }}>
                  <button className="dropdown-item" onClick={() => setShowDropdown(false)}>Thông tin cá nhân</button>
                  <button className="dropdown-item" onClick={() => setShowDropdown(false)}>Cài đặt</button>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item text-danger" 
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Spacer for fixed header */}
      <div style={{ height: '60px' }}></div>
    </>
  );
};

export default Header;