import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Button } from 'antd';

const Header = ({ setCurrentView }) => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

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
  <header className="app-header border-bottom shadow-sm fixed-top">
        <div className="container-fluid px-3 py-2">
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            {/* Logo */}
            <div 
              className="d-flex align-items-center" 
              style={{ cursor: 'pointer', zIndex: 1000 }} 
              onClick={() => handleMenuClick('dashboard')}
              role="button"
              tabIndex={0}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="ms-2 fw-bold" style={{ fontSize: 20, letterSpacing: 1 }}>HomeEase</span>
            </div>

            {/* Menu Items */}
            <div className="d-flex flex-wrap" style={{ zIndex: 1000 }}>
              {[ 
                { id: 'dashboard', name: 'Dashboard' },
                { id: 'residents', name: 'Cư dân' },
                { id: 'requests', name: 'Yêu cầu' },
                { id: 'invoices', name: 'Hóa đơn' },
                { id: 'notifications', name: 'Thông báo' }
              ].map(item => (
                <Button 
                  key={item.id}
                  type="link"
                  style={{ fontWeight: 500, fontSize: '1rem', margin: '0 8px', padding: '0 10px', borderRadius: 4 }}
                  onClick={() => handleMenuClick(item.id)}
                  className="header-menu-btn"
                >
                  {item.name}
                </Button>
              ))}
            </div>

            {/* User Menu */}
            <div className="d-flex align-items-center position-relative" style={{ zIndex: 1000 }} ref={dropdownRef}>
              <Button 
                type="link"
                style={{ padding: 0, display: 'flex', alignItems: 'center', fontWeight: 500 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="header-user-btn"
              >
                <div className="d-flex align-items-center justify-content-center rounded-circle bg-secondary text-white" style={{width: '32px', height: '32px', fontSize: 18}}>
                  <span className="fw-bold">{user?.name?.charAt(0) || 'A'}</span>
                </div>
                <span className="ms-2 d-none d-sm-inline" style={{ fontSize: 16 }}>{user?.name || 'Administrator'}</span>
              </Button>
              {showDropdown && (
                <div className="position-absolute dropdown-menu dropdown-menu-end shadow show" style={{ top: '40px', right: 0, minWidth: 180, background: '#fff', borderRadius: 8, border: '1px solid #eee', padding: 8 }}>
                  <Button type="text" style={{ width: '100%', textAlign: 'left', color: '#333', borderRadius: 6, marginBottom: 4 }} onClick={() => setShowDropdown(false)}>Thông tin cá nhân</Button>
                  <Button type="text" style={{ width: '100%', textAlign: 'left', color: '#333', borderRadius: 6, marginBottom: 4 }} onClick={() => setShowDropdown(false)}>Cài đặt</Button>
                  <div className="dropdown-divider" style={{ margin: '6px 0' }}></div>
                  <Button type="text" danger style={{ width: '100%', textAlign: 'left', borderRadius: 6 }} onClick={() => { setShowDropdown(false); handleLogout(); }}>Đăng xuất</Button>
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