import React from 'react';
import { FiLink, FiAtSign, FiDollarSign } from 'react-icons/fi';
import '../../styles/Admin/IBDashboard.css';

function IBDashboard() {
  const ibData = {
    balance: '$0.00',
    ibNumber: '900909477879',
    payoutCommission: '$0.00',
    payoutFromDate: '05/11/2025 07:37 AM'
  };

  const handleWithdrawCommission = () => {
    alert('Withdraw commission feature coming soon!');
  };

  const handleViewHistory = () => {
    alert('Viewing commission history...');
  };

  const handleCopyReferralLink = () => {
    const link = 'https://portal.prestigeglobalfx.com/register?ref=900909477879';
    navigator.clipboard.writeText(link);
    alert('Referral link copied to clipboard!');
  };

  return (
    <div className="ib-dashboard-page">
      <div className="ib-header">
        <h1>IB Dashboard</h1>
        <p>Your Introducing Broker summary and tools.</p>
      </div>

      <div className="ib-actions">
        <button className="btn-action withdraw" onClick={handleWithdrawCommission}>
          Withdraw Commission
        </button>
        <button className="btn-action history" onClick={handleViewHistory}>
          View History
        </button>
      </div>

      {/* IB Stats Cards */}
      <div className="ib-stats-grid">
        <div className="stat-card">
          <div className="stat-label">IB Balance</div>
          <div className="stat-value green">{ibData.balance}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">IB Number</div>
          <div className="stat-value">{ibData.ibNumber}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Payout Commission</div>
          <div className="stat-value">{ibData.payoutCommission}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Payout From Date</div>
          <div className="stat-value small">{ibData.payoutFromDate}</div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="works-grid">
          <div className="work-step">
            <div className="step-icon">
              <FiLink size={32} />
            </div>
            <h3>1. Get Your Link</h3>
            <p>Find your unique referral links in the "Referral Links" section.</p>
          </div>

          <div className="work-step">
            <div className="step-icon">
              <FiAtSign size={32} />
            </div>
            <h3>2. Share & Refer</h3>
            <p>Share the links with potential clients through your website or social media.</p>
          </div>

          <div className="work-step">
            <div className="step-icon">
              <FiDollarSign size={32} />
            </div>
            <h3>3. Earn Commission</h3>
            <p>Earn a commission for every trade your referred clients make.</p>
          </div>
        </div>
      </div>

      {/* Referral Tools */}
      <div className="referral-tools">
        <h2>Referral Tools</h2>
        
        <div className="tools-grid">
          <div className="tool-card">
            <h3>Your Referral Link</h3>
            <div className="link-box">
              <input
                type="text"
                value="https://portal.prestigeglobalfx.com/register?ref=900909477879"
                readOnly
              />
              <button className="btn-copy" onClick={handleCopyReferralLink}>
                Copy Link
              </button>
            </div>
            <p className="tool-description">
              Share this link to refer new clients and earn commissions on their trading activity.
            </p>
          </div>

          <div className="tool-card">
            <h3>Quick Stats</h3>
            <div className="quick-stats">
              <div className="quick-stat-item">
                <span className="stat-number">0</span>
                <span className="stat-text">Total Referrals</span>
              </div>
              <div className="quick-stat-item">
                <span className="stat-number">0</span>
                <span className="stat-text">Active Clients</span>
              </div>
              <div className="quick-stat-item">
                <span className="stat-number">$0.00</span>
                <span className="stat-text">Total Earned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Structure */}
      <div className="commission-structure">
        <h2>Commission Structure</h2>
        <div className="structure-table">
          <table>
            <thead>
              <tr>
                <th>Trading Volume</th>
                <th>Commission Rate</th>
                <th>Payout Frequency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>$0 - $100,000</td>
                <td>$5 per lot</td>
                <td>Weekly</td>
              </tr>
              <tr>
                <td>$100,001 - $500,000</td>
                <td>$7 per lot</td>
                <td>Weekly</td>
              </tr>
              <tr>
                <td>$500,001+</td>
                <td>$10 per lot</td>
                <td>Weekly</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default IBDashboard;