import React, { useContext, useState, useEffect, useRef } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Button } from 'antd'
import { NavBar, Popup } from 'antd-mobile'
import '../header-fix.css'
import { createPortal } from 'react-dom'
import { MdDashboard, MdRequestPage, MdPayment, MdNotifications, MdPerson, MdPeople, MdLogout, MdClose } from 'react-icons/md'

const Header = ({ setCurrentView }) => {
  const { user, logout } = useContext(AuthContext)
  const [showDropdown, setShowDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = () => {
    logout()
    if (setCurrentView) setCurrentView('login')
    else window.location.hash = '#/login'
  }

  const handleMenuClick = (view) => {
    let target = view
    if (view === 'dashboard' && user?.role === 'resident') target = 'resident-dashboard'
    if (setCurrentView) setCurrentView(target)
    else window.location.hash = `#/${target}`
    setMobileMenuOpen(false)
  }

  const menuItems = user?.role === 'resident' ? [
    { id: 'dashboard', name: 'Dashboard', icon: <MdDashboard size={22} />, color: '#4f46e5' },
    { id: 'my-requests', name: 'Yêu cầu của tôi', icon: <MdRequestPage size={22} />, color: '#0891b2' },
    { id: 'my-invoices', name: 'Hóa đơn của tôi', icon: <MdPayment size={22} />, color: '#f59e0b' },
    { id: 'notifications', name: 'Thông báo', icon: <MdNotifications size={22} />, color: '#8b5cf6' },
    { id: 'profile', name: 'Tài khoản', icon: <MdPerson size={22} />, color: '#6366f1' }
  ] : [
    { id: 'dashboard', name: 'Dashboard', icon: <MdDashboard size={22} />, color: '#4f46e5' },
    { id: 'residents', name: 'Cư dân', icon: <MdPeople size={22} />, color: '#059669' },
    { id: 'requests', name: 'Yêu cầu', icon: <MdRequestPage size={22} />, color: '#0891b2' },
    { id: 'invoices', name: 'Hóa đơn', icon: <MdPayment size={22} />, color: '#f59e0b' },
    { id: 'notifications', name: 'Thông báo', icon: <MdNotifications size={22} />, color: '#8b5cf6' }
  ]

  const isResident = user?.role === 'resident'

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  // Dev helper & auto-hide are included for debugging; safe in development only
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const dbg = params.get('debugHeader')
      if (!dbg) return
      const timer = setTimeout(() => {
        const nav = document.querySelector('.homeease-navbar') || document.querySelector('.adm-nav-bar')
        if (!nav) return
        const navRect = nav.getBoundingClientRect()
        const all = Array.from(document.querySelectorAll('body *'))
        const overlapping = []
        all.forEach(el => {
          try {
            if (nav.contains(el)) return
            const r = el.getBoundingClientRect()
            if (r.width === 0 || r.height === 0) return
            const intersect = !(r.right < navRect.left || r.left > navRect.right || r.bottom < navRect.top || r.top > navRect.bottom)
            if (intersect) {
              overlapping.push({ el, rect: r })
              el.style.outline = '3px dashed rgba(255,0,0,0.9)'
              el.style.outlineOffset = '2px'
            }
          } catch { /* ignore */ }
        })
        console.log('[header-debug] overlapping elements:', overlapping.map(o => ({ tag: o.el.tagName, rect: o.rect, html: o.el.outerHTML.slice(0,200) })))
        if (dbg === 'hide') {
          overlapping.forEach(o => {
            const el = o.el
            const tag = el.tagName.toLowerCase()
            const safeTags = new Set(['nav','header','button','svg','path','style','link','script','meta'])
            if (safeTags.has(tag)) return
            if (el.closest && el.closest('.homeease-navbar')) return
            el.dataset._wasHiddenByHeaderDebug = '1'
            el.style.display = 'none'
            console.log('[header-debug] hid overlapping element', el.tagName, o.rect)
          })
        }
      }, 300)
      return () => clearTimeout(timer)
    } catch (e) {
      console.error('header debug failed', e)
    }
  }, [])

  useEffect(() => {
    try {
      if (import.meta.env && import.meta.env.MODE === 'production') return
      const timer = setTimeout(() => {
        const nav = document.querySelector('.homeease-navbar') || document.querySelector('.adm-nav-bar')
        if (!nav) return
        const navRect = nav.getBoundingClientRect()
        const candidates = Array.from(document.querySelectorAll('body *')).filter(el => !nav.contains(el) && el !== nav)
        candidates.forEach(el => {
          try {
            const r = el.getBoundingClientRect()
            if (r.width === 0 || r.height === 0) return
            const intersect = !(r.right < navRect.left || r.left > navRect.right || r.bottom < navRect.top || r.top > navRect.bottom)
            if (!intersect) return
            const style = window.getComputedStyle(el)
            const bg = style.backgroundColor || ''
            const isInputLike = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || /search/i.test(el.className || '') || /input/i.test(el.className || '')
            const isWhiteBg = /rgb\(255,\s*255,\s*255\)|#fff|#ffffff/i.test(bg) || /rgba\(255,\s*255,\s*255,\s*0?\.\d+\)/i.test(bg)
            const reasonableSize = r.height >= 20 && r.height <= 120 && r.width >= 80 && r.width <= 1200
            if ((isInputLike || isWhiteBg) && reasonableSize) {
              el.dataset._wasHiddenByHeaderFix = '1'
              el.style.display = 'none'
              console.log('[header-auto-hide] hid element', el.tagName, r)
            }
          } catch { /* ignore */ }
        })
      }, 300)
      return () => clearTimeout(timer)
    } catch (e) {
      console.error('header auto-hide failed', e)
    }
  }, [])

  const portalContent = (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999 }}>
      <NavBar
        className="homeease-navbar"
        back={null}
        onBack={null}
        style={{
          '--height': '64px',
          background: isResident ? 'linear-gradient(90deg,#4f46e5,#06b6d4)' : 'linear-gradient(90deg,#5b21b6,#3b82f6)',
          '--border-bottom': '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 4000
        }}
        right={(
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 120, justifyContent: 'flex-end' }}>
            <Button type="text" onClick={() => setMobileMenuOpen(true)} aria-label="Mở menu" style={{ padding: 0, color: '#fff', marginRight: 6, zIndex: 4200 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
            <div ref={dropdownRef} style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.25)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', marginLeft: 4, zIndex: 4200, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} onClick={() => setShowDropdown(!showDropdown)}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        )}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleMenuClick('dashboard')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleMenuClick('dashboard') } }}
          style={{
            fontWeight: 700,
            fontSize: isResident ? '20px' : '18px',
            color: '#fff',
            letterSpacing: '0.5px',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            position: 'relative',
            zIndex: 4100,
            pointerEvents: 'auto',
            cursor: 'pointer'
          }}
        >
          HomeEase
        </div>
      </NavBar>

      {showDropdown && (
        <div style={{ position: 'absolute', top: 70, right: 12, zIndex: 5000, minWidth: 180 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
            <Button type="text" style={{ width: '100%', textAlign: 'left' }} onClick={() => { setShowDropdown(false); handleMenuClick('profile') }}>Thông tin cá nhân</Button>
            <Button type="text" style={{ width: '100%', textAlign: 'left' }} onClick={() => { setShowDropdown(false); handleMenuClick('profile') }}>Cài đặt</Button>
            <div style={{ height: 8 }} />
            <Button type="text" danger style={{ width: '100%', textAlign: 'left' }} onClick={() => { setShowDropdown(false); handleLogout() }}>Đăng xuất</Button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {typeof document !== 'undefined' ? createPortal(portalContent, document.body) : portalContent}

      <div style={{ height: '64px' }} />

      <Popup
        visible={mobileMenuOpen}
        onMaskClick={() => setMobileMenuOpen(false)}
        position="left"
        bodyStyle={{ width: '82%', maxWidth: 360, padding: 0, background: 'linear-gradient(to bottom, #f8fafc, #ffffff)' }}
      >
        {/* Header */}
        <div style={{ 
          padding: '20px 20px 16px', 
          background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#fff' }}>Menu</h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
                {user?.name || 'User'}
              </p>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '8px',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
                transition: 'all 0.2s'
              }}
            >
              <MdClose size={20} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ padding: '12px 8px' }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 12px',
                marginBottom: '4px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${item.color}10`
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${item.color}15`,
                color: item.color,
                transition: 'all 0.2s'
              }}>
                {item.icon}
              </div>
              <span style={{ 
                fontSize: '15px', 
                fontWeight: 500,
                color: '#1f2937',
                flex: 1
              }}>
                {item.name}
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4 }}>
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ))}

          {/* Divider */}
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)', margin: '12px 0' }} />

          {/* Logout */}
          <div
            onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 12px',
              marginBottom: '4px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fee2e2'
              e.currentTarget.style.transform = 'translateX(4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.transform = 'translateX(0)'
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fee2e2',
              color: '#dc2626'
            }}>
              <MdLogout size={22} />
            </div>
            <span style={{ 
              fontSize: '15px', 
              fontWeight: 600,
              color: '#dc2626',
              flex: 1
            }}>
              Đăng xuất
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '16px 20px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <p style={{ 
            margin: 0,
            fontSize: '12px',
            color: '#9ca3af'
          }}>
            HomeEase v1.0
          </p>
        </div>
      </Popup>
    </>
  )
}


export default Header