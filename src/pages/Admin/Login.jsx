import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import '../../styles/Admin/Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Dummy credentials for testing
  const dummyUsers = [
    {
      email: 'superadmin@stockvala.com',
      password: 'SuperAdmin@123',
      role: 'SUPER_ADMIN',
      name: 'Super Administrator'
    },
    {
      email: 'admin@stockvala.com',
      password: 'Admin@123',
      role: 'ADMIN',
      name: 'System Admin'
    },
    {
      email: 'admin@xmindia.com',
      password: 'admin123',
      role: 'ADMIN',
      name: 'Xmindia Admin'
    },
    {
      email: 'supermaster@stockvala.com',
      password: 'SuperMaster@123',
      role: 'SUPER_MASTER',
      name: 'John Super Master'
    },
    {
      email: 'master@stockvala.com',
      password: 'Master@123',
      role: 'MASTER',
      name: 'Jane Master'
    },
    {
      email: 'client@stockvala.com',
      password: 'Client@123',
      role: 'CLIENT',
      name: 'Test Client'
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      // Find matching user
      const user = dummyUsers.find(
        u => u.email.toLowerCase() === formData.email.toLowerCase() && 
             u.password === formData.password
      );

      if (user) {
        // Success
        setIsLoading(false);
        alert(`✅ Welcome back, ${user.name}!\n\nRole: ${user.role}\nEmail: ${user.email}`);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Redirect to admin dashboard
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 500);
      } else {
        // Failed
        setIsLoading(false);
        setError('❌ Invalid email or password. Please try again.');
      }
    }, 1500);
  };

  const handleForgotPassword = () => {
    alert('Password reset link will be sent to your email');
  };

  const handleBackToHome = () => {
    // Change this URL to your actual frontend home page
    window.location.href = '/';
  };

  // Quick fill for testing - you can remove this in production
  const quickFill = (role) => {
    const user = dummyUsers.find(u => u.role === role);
    if (user) {
      setFormData({
        ...formData,
        email: user.email,
        password: user.password
      });
      setError('');
    }
  };

  return (
    <div className="login-page">
      {/* Back to Home Button */}
      <button className="back-to-home" onClick={handleBackToHome}>
        <FiArrowLeft /> Back to Home
      </button>

      <div className="login-container">
        <div className="login-left">
          <div className="login-branding">
            <h1 className="brand-logo">Xmindia</h1>
            <p className="brand-tagline">Admin Portal</p>
          </div>
          <div className="login-illustration">
            <div className="illustration-circle"></div>
            <div className="illustration-icon">🔐</div>
          </div>
          <p className="login-welcome">
            Secure access to your broker management system
          </p>

          {/* Test Credentials Panel - Remove in production */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#fff' }}>
              🔑 Test Credentials:
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Super Admin:</strong><br />
              superadmin@stockvala.com / SuperAdmin@123
              <button 
                onClick={() => quickFill('SUPER_ADMIN')}
                style={{
                  marginLeft: '10px',
                  padding: '2px 8px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  background: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px'
                }}
              >
                Fill
              </button>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Admin:</strong><br />
              admin@xmindia.com / admin123
              <button 
                onClick={() => quickFill('ADMIN')}
                style={{
                  marginLeft: '10px',
                  padding: '2px 8px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  background: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px'
                }}
              >
                Fill
              </button>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Super Master:</strong><br />
              supermaster@stockvala.com / SuperMaster@123
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Master:</strong><br />
              master@stockvala.com / Master@123
            </div>
            <div>
              <strong>Client:</strong><br />
              client@stockvala.com / Client@123
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-wrapper">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Enter your credentials to access the admin panel</p>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '12px',
                marginBottom: '20px',
                background: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                borderRadius: '6px',
                color: '#f44336',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="admin@xmindia.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="forgot-password"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className={`btn-login ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <a href="/#contact" className="link-signup">
                  Contact Admin
                </a>
              </p>
            </div>

            <div className="login-security">
              <span className="security-badge">🛡️ Secured with 256-bit SSL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-page-footer">
        <p>© {new Date().getFullYear()} Xmindia. All rights reserved.</p>
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <span>•</span>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}

export default Login;