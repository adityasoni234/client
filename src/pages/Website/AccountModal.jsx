import React, { useState } from 'react';
import '../../styles/Website/AccountModal.css';

function AccountModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: '',
    agreed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!formData.agreed) {
      alert('Please agree to Terms and Privacy Policy');
      return;
    }
    
    alert(`Welcome ${formData.firstName}! Your account is being created.`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>Create Your Account</h2>
          <p>Let's get you started.</p>
        </div>

        <form className="account-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="">Select a country</option>
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="AE">UAE</option>
                <option value="SG">Singapore</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-checkbox">
            <input
              type="checkbox"
              id="agreed"
              name="agreed"
              checked={formData.agreed}
              onChange={handleChange}
            />
            <label htmlFor="agreed">
              I agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.
            </label>
          </div>

          <button type="submit" className="btn-create-account">
            Create Account
          </button>

          <div className="modal-divider">OR</div>

          <p className="login-link">
            Already have an account? <a href="#login">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default AccountModal;