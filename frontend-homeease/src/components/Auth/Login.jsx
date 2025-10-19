// src/components/Auth/Login.jsx
import { useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      onLoginSuccess && onLoginSuccess();
      navigate('/'); // Let App decide where to route based on role
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword 
        onBackToLogin={() => setShowForgotPassword(false)} 
      />
    );
  }

  return (
    <div className="login-bg" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #3f51b5 0%, #00bcd4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-card" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px rgba(63,81,181,0.10)', padding: 40, maxWidth: 370, width: '100%' }}>
        <div className="text-center mb-4">
          <FaHome size={56} color="#3f51b5" style={{ marginBottom: 8 }} />
          <h2 className="fw-bold" style={{ color: '#3f51b5', fontSize: 28, marginBottom: 4 }}>HomeEase</h2>
          <p className="text-muted" style={{ fontSize: 16 }}>Đăng nhập vào hệ thống</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ fontSize: 15, borderRadius: 8, marginBottom: 18 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 500 }}>Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              style={{ borderRadius: 10, fontSize: 16, padding: '12px 16px' }}
              placeholder="Nhập email..."
            />
          </div>

          <div className="mb-4">
            <label className="form-label" style={{ fontWeight: 500 }}>Mật khẩu</label>
            <input
              type="password"
              className="form-control form-control-lg"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              style={{ borderRadius: 10, fontSize: 16, padding: '12px 16px' }}
              placeholder="Nhập mật khẩu..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100"
            disabled={loading}
            style={{ borderRadius: 10, fontWeight: 600, fontSize: 17, letterSpacing: 0.5 }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link p-0 text-decoration-none"
            style={{ color: '#0288d1', fontWeight: 500, fontSize: 15 }}
            onClick={() => setShowForgotPassword(true)}
          >
            Quên mật khẩu?
          </button>
        </div>

        <div className="text-center mt-4">
          <small className="text-muted" style={{ fontSize: 14 }}>
            Demo: <span style={{ color: '#3f51b5', fontWeight: 500 }}>admin@homeease.com</span> / <span style={{ color: '#00bcd4', fontWeight: 500 }}>password123</span>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;