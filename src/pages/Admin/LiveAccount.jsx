import React, { useState } from 'react';
import { FiUserPlus, FiEye, FiEyeOff, FiCopy, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../../styles/Admin/LiveAccount.css';

function LiveAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);

  const [formData, setFormData] = useState({
    accountGroup: 'LIVE PRO',
    leverage: '1:500'
  });

  // Mock existing accounts
  const accounts = [
    {
      login: '900909477791',
      accountType: 'Live',
      terminalLogin: '900909477791',
      mainPassword: '••••••••',
      serverName: 'Classic Global Ltd',
      accountType: 'Live',
      currency: 'USD',
      leverage: '500'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Account Created!\nGroup: ${formData.accountGroup}\nLeverage: ${formData.leverage}`);
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    alert(`${field} copied to clipboard!`);
  };

  const nextAccount = () => {
    if (currentAccountIndex < accounts.length - 1) {
      setCurrentAccountIndex(currentAccountIndex + 1);
    }
  };

  const prevAccount = () => {
    if (currentAccountIndex > 0) {
      setCurrentAccountIndex(currentAccountIndex - 1);
    }
  };

  const currentAccount = accounts[currentAccountIndex];

  return (
    <div className="live-account-page">
      <div className="live-account-container">
        {/* Create Account Section */}
        <div className="create-account-section">
          <div className="section-header">
            <div className="header-icon">
              <FiUserPlus size={32} />
            </div>
            <div>
              <h2>Create Live Account</h2>
              <p>Fill in the details below to open a new trading account.</p>
            </div>
          </div>

          <form className="create-account-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Account Group</label>
              <select
                name="accountGroup"
                value={formData.accountGroup}
                onChange={handleChange}
                required
              >
                <option value="LIVE PRO">LIVE PRO</option>
                <option value="LIVE ECN">LIVE ECN</option>
                <option value="LIVE STANDARD">LIVE STANDARD</option>
              </select>
            </div>

            <div className="form-group">
              <label>Leverage</label>
              <select
                name="leverage"
                value={formData.leverage}
                onChange={handleChange}
                required
              >
                <option value="1:100">1:100</option>
                <option value="1:200">1:200</option>
                <option value="1:500">1:500</option>
                <option value="1:1000">1:1000</option>
              </select>
            </div>

            <button type="submit" className="btn-create-account">
              Create Account
            </button>
          </form>
        </div>

        {/* Existing Accounts Section */}
        <div className="existing-accounts-section">
          <div className="section-header">
            <h2>Your Live Accounts</h2>
          </div>

          <div className="accounts-carousel">
            <div className="account-card">
              <div className="account-header">
                <h3>Login: {currentAccount.login}</h3>
                <span className="account-badge">{currentAccount.accountType}</span>
              </div>

              <div className="account-details">
                <div className="detail-row">
                  <span className="detail-label">Terminal Login</span>
                  <div className="detail-value-copy">
                    <span>{currentAccount.terminalLogin}</span>
                    <button
                      className="copy-btn"
                      onClick={() => handleCopy(currentAccount.terminalLogin, 'Terminal Login')}
                    >
                      <FiCopy />
                    </button>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Main Password</span>
                  <div className="detail-value-copy">
                    <span>{showPassword ? 'MyPassword123' : currentAccount.mainPassword}</span>
                    <button
                      className="copy-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Server Name</span>
                  <div className="detail-value-copy">
                    <span>{currentAccount.serverName}</span>
                    <button
                      className="copy-btn"
                      onClick={() => handleCopy(currentAccount.serverName, 'Server Name')}
                    >
                      <FiCopy />
                    </button>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Account Type</span>
                  <span className="detail-value">{currentAccount.accountType}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Currency</span>
                  <span className="detail-value">{currentAccount.currency}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Account Leverage</span>
                  <span className="detail-value">{currentAccount.leverage}</span>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {accounts.length > 1 && (
              <div className="carousel-nav">
                <button
                  className="nav-btn"
                  onClick={prevAccount}
                  disabled={currentAccountIndex === 0}
                >
                  <FiChevronLeft />
                </button>
                <span className="account-indicator">
                  {currentAccountIndex + 1} / {accounts.length}
                </span>
                <button
                  className="nav-btn"
                  onClick={nextAccount}
                  disabled={currentAccountIndex === accounts.length - 1}
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveAccount;