// src/contexts/AuthContext.jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { Modal } from 'antd'

/*
  Note: react-refresh rule can complain when files export non-component values alongside components.
  We keep this file focused and ensure we export the provider as default and named hooks only.
*/
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/verify');
          setUser(response.data.user);
        } catch (error) {
          console.warn('verifyToken failed', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  // When user becomes available (login or verify), fetch latest notification and show popup once
  useEffect(() => {
    if (!user) return
    const run = async () => {
      try {
  // attempt to fetch notifications for this user via /notification/me
  const res = await api.get('/notification/me')
  const data = Array.isArray(res.data) ? res.data : res.data || []
        if (!data.length) return
        // find newest by createdAt
        data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
        const latest = data[0]
        const seenKey = `seenNotification:${user.id}`
        const lastSeen = localStorage.getItem(seenKey)
        if (!latest || String(latest.id) === String(lastSeen)) return

        // show modal popup with title/content; mark seen when user clicks
        Modal.info({
          title: latest.title || 'Thông báo mới',
          content: (<div>{latest.content}</div>),
          okText: 'Đã xem',
          onOk: () => {
            try { localStorage.setItem(seenKey, String(latest.id)) } catch (e) { console.warn(e) }
          }
        })
      } catch (err) {
        // silently ignore notification errors
        console.debug('No notification popup (err)', err?.message || err)
      }
    }
    run()
    return () => {}
  }, [user])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;