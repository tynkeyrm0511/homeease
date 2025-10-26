import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from 'antd'
import { NavBar, Popup } from 'antd-mobile'
import '../header-fix.css'
import { createPortal } from 'react-dom'
import { MdDashboard, MdRequestPage, MdPayment, MdNotifications, MdPerson, MdPeople, MdLogout, MdClose } from 'react-icons/md'
import api from '../services/api'
import NotificationDetail from './Notifications/NotificationDetail'
import { motion, AnimatePresence } from 'framer-motion'
// mark motion as used in plain JS so linters that don't detect JSX usage won't complain
void motion

// Hook: lock body scroll and compensate for scrollbar width when `open` is true
function useLockBodyScrollWhen(open) {
  // useEffect is available from React import above
  React.useEffect(() => {
    const body = typeof document !== 'undefined' ? document.body : null
    if (!body) return
    const originalOverflow = body.style.overflow
    const originalPaddingRight = body.style.paddingRight
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      body.style.overflow = originalOverflow || ''
      body.style.paddingRight = originalPaddingRight || ''
    }
    return () => {
      body.style.overflow = originalOverflow || ''
      body.style.paddingRight = originalPaddingRight || ''
    }
  }, [open])
}

  const Header = ({ setCurrentView }) => {
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [notifications, setNotifications] = useState([])
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifModalOpen, setNotifModalOpen] = useState(false)
  const [notifModalId, setNotifModalId] = useState(null)

  // localStorage key to store seen notification ids per user
  const seenKey = user?.id ? `seenNotifications:${user.id}` : null

  const loadSeenSet = () => {
    try {
      if (!seenKey) return new Set()
      const raw = localStorage.getItem(seenKey)
      if (!raw) return new Set()
      return new Set(raw.split(',').filter(Boolean))
    } catch {
      return new Set()
    }
  }

  const saveSeenSet = (set) => {
    try {
      if (!seenKey) return
      localStorage.setItem(seenKey, Array.from(set).join(','))
  } catch { /* ignore */ }
  }

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
  // lock body scroll when mobile menu is open to prevent layout shift
  useLockBodyScrollWhen(mobileMenuOpen)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
        setNotifOpen(false)
      }
    }
    if (showDropdown || notifOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown, notifOpen])

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

  // Fetch notifications for header (recent)
  useEffect(() => {
    if (!user) return
    let mounted = true
    const fetch = async () => {
      try {
        const path = user.role === 'admin' ? '/notification' : '/notification/me'
        const res = await api.get(path)
        if (!mounted) return
        const list = Array.isArray(res.data) ? res.data : []
        // sort desc
        list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
        // for non-admin users, ensure only notifications for that user
        if (user.role !== 'admin') {
          const uid = Number(user.id)
          const filtered = list.filter(n => (n?.user && Number(n.user.id) === uid) || (n?.userId && Number(n.userId) === uid))
          setNotifications(filtered.slice(0,6))
        } else {
          setNotifications(list.slice(0,6))
        }
      } catch (err) {
        console.debug('Header notifications fetch failed', err?.message || err)
      }
    }
    fetch()
    return () => { mounted = false }
  }, [user])

  const timeAgo = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const diff = Math.floor((Date.now() - d.getTime()) / 1000)
    if (diff < 60) return `${diff}s`
    if (diff < 3600) return `${Math.floor(diff/60)}m`
    if (diff < 86400) return `${Math.floor(diff/3600)}h`
    return `${Math.floor(diff/86400)}d`
  }

  // unseenCount computed inline when rendering badge to avoid linter unused var

  const markAsSeen = (id) => {
    const seen = loadSeenSet()
    seen.add(String(id))
    saveSeenSet(seen)
  }

  useEffect(() => {
    try {
      // Only run this automatic hiding in development when explicitly requested via URL param
      const params = new URLSearchParams(window.location.search)
      const dbg = params.get('debugHeader')
      if (!dbg) return
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
          display: mobileMenuOpen ? 'none' : 'flex',
          '--height': '64px',
          alignItems: 'center',
          background: isResident ? 'linear-gradient(90deg,#4f46e5,#06b6d4)' : 'linear-gradient(90deg,#5b21b6,#3b82f6)',
          '--border-bottom': '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 4000,
          paddingRight: 16
        }}
        right={(
          <div className="header-right" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end', zIndex: 4200 }}>
            {/* Notification bell - only for residents */}
            {isResident && (
              <div className="notif-wrap" style={{ marginRight: 6 }}>
                <Button className="notif-btn" type="text" onClick={() => setNotifOpen(!notifOpen)} aria-label="Thông báo">
                  <MdNotifications size={20} />
                </Button>
                {(() => { const seen = loadSeenSet(); const cnt = notifications.filter(n => !seen.has(String(n.id))).length; return cnt > 0 ? (
                  <div className="notif-badge">
                    {cnt > 9 ? '9+' : cnt}
                  </div>
                ) : null })()}
              </div>
            )}
            <div ref={dropdownRef} className="avatar-circle" onClick={() => setShowDropdown(!showDropdown)}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        )}
      >
        {/* Left: mobile menu button (kept left to avoid crowding title) */}
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 4200 }}>
          <Button type="text" onClick={() => setMobileMenuOpen(true)} aria-label="Mở menu" style={{ padding: 0, color: '#fff' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>

        <div
          className="header-title"
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
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 4100,
            pointerEvents: 'auto',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
            ,
            maxWidth: 'calc(100% - 180px)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          HomeEase
        </div>
      </NavBar>

      {showDropdown && (
        <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'absolute', top: 70, right: 12, zIndex: 5000, minWidth: 200 }}
          >
            <div style={{ 
              background: '#fff', 
              borderRadius: 12, 
              padding: '12px 8px', 
              boxShadow: '0 10px 30px rgba(2,6,23,0.12)',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>
              {/* User info header */}
              <div style={{ 
                padding: '8px 12px', 
                marginBottom: '8px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#1f2937' }}>
                  {user?.name || 'User'}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                  {user?.role === 'admin' ? 'Administrator' : 'Cư dân'}
                </div>
              </div>

              {/* Menu items */}
              <Button 
                type="text" 
                icon={<MdPerson size={16} />}
                style={{ 
                  width: '100%', 
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginBottom: '4px'
                }} 
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setShowDropdown(false);
                  handleMenuClick('profile');
                }}
              >
                Tài khoản
              </Button>
              
              <Button 
                type="text" 
                danger
                icon={<MdLogout size={16} />}
                style={{ 
                  width: '100%', 
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px'
                }} 
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setShowDropdown(false);
                  handleLogout();
                }}
              >
                Đăng xuất
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      )}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            key="notif-pop"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            style={{ position: 'absolute', top: 70, right: 68, zIndex: 5000, minWidth: 280 }}
          >
            <div className="notif-popover-card">
              <div style={{ fontWeight: 700, padding: '6px 8px' }}>Thông báo</div>
              <div style={{ maxHeight: 300, overflow: 'auto' }}>
                {notifications.length === 0 && <div style={{ padding: 12, color: '#6b7280' }}>Không có thông báo</div>}
                {notifications.map(n => (
                  <div key={n.id} className={`notif-item ${loadSeenSet().has(String(n.id)) ? '' : 'unseen'}`} onClick={() => { setNotifModalId(n.id); setNotifModalOpen(true); markAsSeen(n.id) }}>
                    <div className="avatar">{n.target === 'residentId' ? '👤' : '🔔'}</div>
                    <div className="meta">
                      <div className="title">{n.title}</div>
                      <div className="content">{n.content?.slice(0,80)}</div>
                    </div>
                    <div className="time">{timeAgo(n.createdAt)}</div>
                  </div>
                ))}
              </div>
              <div className="notif-popover-footer">
                <Button type="link" style={{ padding: '6px 8px' }} onClick={() => { setNotifOpen(false); setCurrentView ? setCurrentView('notifications') : window.location.hash = '#/notifications' }}>Xem tất cả</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NotificationDetail notificationId={notifModalId} visible={notifModalOpen} onClose={() => setNotifModalOpen(false)} />
    </div>
  )

  return (
    <>
  {typeof document !== 'undefined' ? createPortal(portalContent, document.body) : portalContent}

  {/* reserve space for navbar so page content doesn't jump; hide spacer when mobile menu open to avoid stray top stripe */}
  <div style={{ height: mobileMenuOpen ? 0 : '64px', pointerEvents: 'none', transition: 'height 120ms' }} />
      <Popup
        visible={mobileMenuOpen}
        onMaskClick={() => setMobileMenuOpen(false)}
        position="left"
        // ensure popup overlays the NavBar
        style={{ top: 0, zIndex: 50000 }}
        bodyStyle={{ width: '82%', maxWidth: 360, padding: 0, paddingTop: 0, height: '100%', boxSizing: 'border-box', background: 'linear-gradient(to bottom, #f8fafc, #ffffff)' }}
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
