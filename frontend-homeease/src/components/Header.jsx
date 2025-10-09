import { useState } from 'react';

const Header = ({ currentView, setCurrentView }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  return (
    <header className="shadow-sm sticky-top w-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <div className="container-xl px-4">
          {/* Logo */}
          <a className="navbar-brand d-flex align-items-center" href="#" onClick={(e) => {e.preventDefault(); setCurrentView('dashboard')}}>
            <svg className="me-2" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="fw-bold" style={{color: '#4361ee'}}>HomeEase</span>
          </a>
          
          {/* Main Navigation - Visible on Desktop */}
          <div className="d-none d-lg-flex justify-content-center flex-grow-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'residents', label: 'Cư dân' },
              { id: 'requests', label: 'Yêu cầu' },
              { id: 'invoices', label: 'Hóa đơn' },
              { id: 'notifications', label: 'Thông báo' }
            ].map((item) => (
              <button
                key={item.id}
                className={`nav-link px-3 py-2 mx-1 border-0 bg-transparent ${currentView === item.id ? 'fw-semibold' : ''}`}
                style={{
                  position: 'relative',
                  color: currentView === item.id ? '#4361ee' : '#6c757d',
                }}
                onClick={() => setCurrentView(item.id)}
              >
                {item.label}
                {currentView === item.id && (
                  <span
                    className="position-absolute"
                    style={{
                      bottom: '0',
                      left: '0',
                      right: '0',
                      height: '2px',
                      background: '#4361ee',
                    }}
                  ></span>
                )}
              </button>
            ))}
          </div>
          
          {/* Mobile Toggle */}
          <button 
            className="navbar-toggler ms-auto d-lg-none" 
            type="button" 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          {/* User Section */}
          <div className="ms-auto d-none d-lg-flex align-items-center">
            <div className="dropdown">
              <button className="btn btn-light d-flex align-items-center gap-2 border" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
                <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary" style={{width: '30px', height: '30px'}}>
                  <span className="text-white fw-bold">A</span>
                </div>
                <span className="d-sm-inline">Admin</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userMenu">
                <li><a className="dropdown-item" href="#">Thông tin cá nhân</a></li>
                <li><a className="dropdown-item" href="#">Cài đặt</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item text-danger" href="#">Đăng xuất</a></li>
              </ul>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div className={`collapse navbar-collapse ${showMobileMenu ? 'show' : ''}`}>
            <ul className="navbar-nav d-lg-none w-100 py-3">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'residents', label: 'Cư dân' },
                { id: 'requests', label: 'Yêu cầu' },
                { id: 'invoices', label: 'Hóa đơn' },
                { id: 'notifications', label: 'Thông báo' }
              ].map((item) => (
                <li className="nav-item" key={item.id}>
                  <a
                    className={`nav-link py-2 ${currentView === item.id ? 'active fw-semibold' : ''}`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView(item.id);
                      setShowMobileMenu(false);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              
              {/* User Options in Mobile */}
              <li className="nav-item mt-3">
                <hr className="my-2" />
                <a className="nav-link" href="#">Thông tin cá nhân</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Cài đặt</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-danger" href="#">Đăng xuất</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;