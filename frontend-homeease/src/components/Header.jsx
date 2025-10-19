import React, { useContext, useState, useEffect, useRef } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Button } from 'antd'
import { NavBar, Popup, List } from 'antd-mobile'

const Header = ({ setCurrentView }) => {
  const { user, logout } = useContext(AuthContext)
  const [showDropdown, setShowDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  const handleLogout = () => {
    logout()
    if (setCurrentView) setCurrentView('login')
    else window.location.hash = '#/login'
  }

  const handleMenuClick = (view) => {
    // If resident clicks 'dashboard', route to resident-dashboard instead of admin dashboard
    let target = view
    if (view === 'dashboard' && user?.role === 'resident') target = 'resident-dashboard'
    if (setCurrentView) setCurrentView(target)
    else window.location.hash = `#/${target}`
    setMobileMenuOpen(false)
  }

  const menuItems = user?.role === 'resident' ? [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'my-requests', name: 'Yêu cầu của tôi' },
    { id: 'my-invoices', name: 'Hóa đơn của tôi' },
    { id: 'notifications', name: 'Thông báo' },
    { id: 'profile', name: 'Tài khoản' }
  ] : [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'residents', name: 'Cư dân' },
    { id: 'requests', name: 'Yêu cầu' },
    { id: 'invoices', name: 'Hóa đơn' },
    { id: 'notifications', name: 'Thông báo' }
  ]

  return (
    <>
      <NavBar
        back={null}
        onBack={null}
        style={{ 
          '--height': '64px',
          '--background': user?.role === 'resident' ? 'transparent' : '#fff',
          '--border-bottom': user?.role === 'resident' ? 'none' : '1px solid #eee',
          position: user?.role === 'resident' ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000
        }}
        right={(
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button type="text" onClick={() => setMobileMenuOpen(true)} aria-label="Mở menu" style={{ padding: 0, color: user?.role === 'resident' ? '#fff' : '#000' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
            <div ref={dropdownRef} style={{ width: 40, height: 40, borderRadius: 20, background: user?.role === 'resident' ? 'rgba(255,255,255,0.2)' : '#2F54EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, cursor: 'pointer', backdropFilter: user?.role === 'resident' ? 'blur(10px)' : 'none' }} onClick={() => setShowDropdown(!showDropdown)}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        )}
      >
        <div style={{ 
          fontWeight: 700, 
          fontSize: user?.role === 'resident' ? '20px' : '18px',
          background: user?.role === 'resident' ? 'linear-gradient(135deg, #fff 0%, #e0e7ff 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.5px',
          textShadow: user?.role === 'resident' ? '0 2px 10px rgba(255,255,255,0.3)' : 'none'
        }}>
          HomeEase
        </div>
      </NavBar>

      {user?.role !== 'resident' && <div style={{ height: '64px' }} />}

      {/* dropdown under avatar for quick actions */}
      {showDropdown && (
        <div style={{ position: 'absolute', top: 70, right: 12, zIndex: 3000, minWidth: 180 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
            <Button type="text" style={{ width: '100%', textAlign: 'left' }} onClick={() => { setShowDropdown(false); handleMenuClick('profile') }}>Thông tin cá nhân</Button>
            <Button type="text" style={{ width: '100%', textAlign: 'left' }} onClick={() => { setShowDropdown(false); handleMenuClick('profile') }}>Cài đặt</Button>
            <div style={{ height: 8 }} />
            <Button type="text" danger style={{ width: '100%', textAlign: 'left' }} onClick={() => { setShowDropdown(false); handleLogout() }}>Đăng xuất</Button>
          </div>
        </div>
      )}

      <Popup
        visible={mobileMenuOpen}
        onMaskClick={() => setMobileMenuOpen(false)}
        position="left"
        bodyStyle={{ width: '78%', maxWidth: 340, padding: 12 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <strong>Menu</strong>
          <Button type="text" onClick={() => setMobileMenuOpen(false)}>Đóng</Button>
        </div>
        <List>
          {menuItems.map(item => (
            <List.Item key={item.id} clickable onClick={() => handleMenuClick(item.id)}>
              {item.name}
            </List.Item>
          ))}
          <List.Item clickable style={{ color: '#d93025' }} onClick={() => { handleLogout(); setMobileMenuOpen(false) }}>Đăng xuất</List.Item>
        </List>
      </Popup>
    </>
  )
}

export default Header