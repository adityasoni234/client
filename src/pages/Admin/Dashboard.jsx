import React, { useState } from 'react';
import { 
  FiMenu, 
  FiCopy, 
  FiShield, 
  FiMoon, 
  FiArrowRight,
  FiClock,
  FiUnlock
} from 'react-icons/fi';
import '../../styles/Admin/Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('live');

  // Mock user data
  const userData = {
    name: 'Ramraj Meena',
    email: 'rm9854278@gmail.com',
    accountNo: '900909477791',
    balance: '0.00',
    tradingId: '21035'
  };

  // Stats data
  const stats = [
    { label: 'Total Deposit', value: '$0.00', color: 'green' },
    { label: 'Total Withdraw', value: '$0.00', color: 'red' },
    { label: 'Referral Income', value: '$0.00', color: 'blue' },
    { label: 'Referral Payout', value: '$0.00', color: 'orange' },
    { label: 'Trading Deposit', value: '$0.00', color: 'green' },
    { label: 'Trading Withdraw', value: '$0.00', color: 'red' }
  ];

  // Account details
  const accountDetails = {
    accountNo: '#900909477791',
    leverage: '500',
    balance: '$0.00',
    credit: '$0.00',
    equity: '$0.00',
    totalDeposit: '$0.00'
  };

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="dashboard-topbar">
        <button className="menu-toggle"><FiMenu /></button>
        
        <div className="topbar-right">
          <div className="balance-display">
            <span className="balance-label">BALANCE</span>
            <span className="balance-amount">${userData.balance}</span>
          </div>
          <div className="trading-id">
            <span>{userData.tradingId}</span>
            <button className="copy-btn"><FiCopy /></button>
          </div>
          <button className="verify-btn">
            <FiShield /> Verify Account
          </button>
          <button className="theme-toggle"><FiMoon /></button>
          <div className="user-avatar">
            <span>R</span>
          </div>
          <div className="user-info">
            <div className="user-name">{userData.name}</div>
            <div className="user-email">{userData.email}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Overview Section */}
        <div className="overview-section">
          <h1 className="page-title">Overview</h1>
          <p className="welcome-text">Welcome to your trading dashboard, {userData.name.split(' ')[0]}.</p>

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className={`stat-indicator ${stat.color}`}></div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="two-column-layout">
          {/* Left Column - Trading Accounts */}
          <div className="left-column">
            <div className="card">
              <h2 className="card-title">Manage Your Trading Accounts</h2>
              
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'live' ? 'active' : ''}`}
                  onClick={() => setActiveTab('live')}
                >
                  Live Account
                </button>
                <button 
                  className={`tab ${activeTab === 'attach' ? 'active' : ''}`}
                  onClick={() => setActiveTab('attach')}
                >
                  Attach Account
                </button>
              </div>

              <div className="account-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <div className="detail-label">Account No.</div>
                    <div className="detail-value">{accountDetails.accountNo}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Leverage</div>
                    <div className="detail-value">{accountDetails.leverage}</div>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <div className="detail-label">Balance</div>
                    <div className="detail-value">{accountDetails.balance}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Credit</div>
                    <div className="detail-value">{accountDetails.credit}</div>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <div className="detail-label">Equity</div>
                    <div className="detail-value">{accountDetails.equity}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Total Deposit</div>
                    <div className="detail-value">{accountDetails.totalDeposit}</div>
                  </div>
                </div>

                <button className="view-details-btn">
                  <FiArrowRight />
                </button>
              </div>
            </div>

            {/* Wallet Transactions */}
            <div className="card">
              <h2 className="card-title">Last Five Wallet Transactions</h2>
              <div className="transactions-table">
                <table>
                  <thead>
                    <tr>
                      <th>TICKET</th>
                      <th>DATE</th>
                      <th>ACTION</th>
                      <th>METHOD</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="6" className="no-data">
                        No transactions found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Next Steps */}
          <div className="right-column">
            <div className="card">
              <h2 className="card-title">Your Next Steps</h2>
              
              <div className="next-steps">
                <div className="step-item">
                  <div className="step-icon"><FiClock /></div>
                  <div className="step-content">
                    <h3>Verification Required</h3>
                    <p>Please complete your KYC verification.</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-icon"><FiUnlock /></div>
                  <div className="step-content">
                    <h3>Unlock Your Potential</h3>
                    <p>Fund your account to start trading.</p>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="btn-deposit">Deposit Now</button>
                  <button className="btn-withdraw">Withdraw</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;