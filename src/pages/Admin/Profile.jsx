import React, { useState } from 'react';
import { FiEdit2, FiSave } from 'react-icons/fi';
import '../../styles/Admin/Profile.css';

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: 'Ramraj',
    lastName: 'Meena',
    email: 'rm9854278@gmail.com',
    country: 'India',
    mobile: '+916367105395'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your personal information, verification, and security.</p>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`tab ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Update Password
        </button>
        <button
          className={`tab ${activeTab === 'kyc' ? 'active' : ''}`}
          onClick={() => setActiveTab('kyc')}
        >
          KYC Details
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <span>R</span>
              </div>
              <h2>{profileData.firstName} {profileData.lastName}</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="country"
                    value={profileData.country}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={profileData.mobile}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-actions">
                {!isEditing ? (
                  <button
                    type="button"
                    className="btn-edit"
                    onClick={() => setIsEditing(true)}
                  >
                    <FiEdit2 /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button type="submit" className="btn-save">
                      <FiSave /> Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Password Tab */}
      {activeTab === 'password' && (
        <div className="profile-content">
          <div className="profile-card">
            <h3>Change Your Password</h3>
            <p className="section-description">
              Ensure your account is using a strong password to stay secure.
            </p>

            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KYC Details Tab */}
      {activeTab === 'kyc' && (
        <div className="profile-content">
          <div className="profile-card">
            <h3>KYC Verification</h3>
            <p className="section-description">
              Complete your KYC verification to unlock all features.
            </p>

            <div className="kyc-status">
              <div className="status-badge pending">
                Verification Pending
              </div>
            </div>

            <div className="kyc-upload-section">
              <div className="upload-item">
                <label>PAN Card</label>
                <input type="file" accept="image/*,.pdf" />
              </div>

              <div className="upload-item">
                <label>Aadhaar Card</label>
                <input type="file" accept="image/*,.pdf" />
              </div>

              <div className="upload-item">
                <label>Selfie</label>
                <input type="file" accept="image/*" />
              </div>

              <div className="upload-item">
                <label>Proof of Address</label>
                <input type="file" accept="image/*,.pdf" />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-save">
                Submit for Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;