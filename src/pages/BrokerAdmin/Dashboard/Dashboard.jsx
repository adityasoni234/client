import React, { useState, useEffect } from 'react';
import { 
  MdPeople, 
  MdTrendingUp, 
  MdAccountBalance,
  MdShowChart,
  MdVerifiedUser,
  MdAttachMoney,
  MdArrowDownward,
  MdArrowUpward,
  MdRefresh
} from 'react-icons/md';
import { dashboardService } from '../../../services/broker';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getStats();
      
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to load data');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.response?.data?.message || error.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Failed to load dashboard data</h2>
        <p>{error}</p>
        <button onClick={fetchStats} className="retry-btn">
          <MdRefresh size={20} />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (!stats) {
    return <div className="error">No data available</div>;
  }

  return (
    <div className="broker-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Broker Owner Panel</p>
        </div>
        <button onClick={fetchStats} className="refresh-btn">
          <MdRefresh size={20} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2>Welcome, Super Admin! 👋</h2>
        <p>Here's what's happening with your broker platform today</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Total Clients */}
        <div className="stat-card blue">
          <div className="stat-header">
            <div className="stat-icon">
              <MdPeople size={28} />
            </div>
            <span className="stat-label">Total Clients</span>
          </div>
          <h3 className="stat-value">{stats.totalClients.toLocaleString()}</h3>
          <p className="stat-subtitle">Active trading accounts</p>
        </div>

        {/* Total Masters */}
        <div className="stat-card purple">
          <div className="stat-header">
            <div className="stat-icon">
              <MdTrendingUp size={28} />
            </div>
            <span className="stat-label">Total Masters/IBs</span>
          </div>
          <h3 className="stat-value">{stats.totalMasters}</h3>
          <p className="stat-subtitle">Introducing Brokers</p>
        </div>

        {/* Today's Deposits */}
        <div className="stat-card green">
          <div className="stat-header">
            <div className="stat-icon">
              <MdArrowDownward size={28} />
            </div>
            <span className="stat-label">Today's Deposits</span>
          </div>
          <h3 className="stat-value">₹{stats.todayDeposits.toLocaleString()}</h3>
          <p className="stat-subtitle">+12% from yesterday</p>
        </div>

        {/* Today's Withdrawals */}
        <div className="stat-card orange">
          <div className="stat-header">
            <div className="stat-icon">
              <MdArrowUpward size={28} />
            </div>
            <span className="stat-label">Today's Withdrawals</span>
          </div>
          <h3 className="stat-value">₹{stats.todayWithdrawals.toLocaleString()}</h3>
          <p className="stat-subtitle">Processing smoothly</p>
        </div>

        {/* Pending KYC */}
        <div className="stat-card red">
          <div className="stat-header">
            <div className="stat-icon">
              <MdVerifiedUser size={28} />
            </div>
            <span className="stat-label">Pending KYC</span>
          </div>
          <h3 className="stat-value">{stats.pendingKYC}</h3>
          <p className="stat-subtitle">Needs verification</p>
        </div>

        {/* Active Accounts */}
        <div className="stat-card teal">
          <div className="stat-header">
            <div className="stat-icon">
              <MdShowChart size={28} />
            </div>
            <span className="stat-label">Active Accounts</span>
          </div>
          <h3 className="stat-value">{stats.activeAccounts.toLocaleString()}</h3>
          <p className="stat-subtitle">Currently trading</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        {/* Recent Deposits */}
        <div className="activity-card">
          <div className="activity-header">
            <h3>Recent Deposits</h3>
            <div className="activity-icon-badge green">
              <MdArrowDownward size={20} />
            </div>
          </div>
          <div className="activity-list">
            {stats.recentDeposits && stats.recentDeposits.length > 0 ? (
              stats.recentDeposits.map((deposit) => (
                <div key={deposit.id} className="activity-item">
                  <div className="activity-avatar green">
                    <MdAccountBalance size={20} />
                  </div>
                  <div className="activity-info">
                    <span className="activity-name">{deposit.name}</span>
                    <span className="activity-time">
                      {new Date(deposit.date).toLocaleDateString()} at{' '}
                      {new Date(deposit.date).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="activity-amount green">
                    +₹{deposit.amount.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent deposits</p>
            )}
          </div>
        </div>

        {/* Recent Withdrawals */}
        <div className="activity-card">
          <div className="activity-header">
            <h3>Recent Withdrawals</h3>
            <div className="activity-icon-badge orange">
              <MdArrowUpward size={20} />
            </div>
          </div>
          <div className="activity-list">
            {stats.recentWithdrawals && stats.recentWithdrawals.length > 0 ? (
              stats.recentWithdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="activity-item">
                  <div className="activity-avatar orange">
                    <MdAttachMoney size={20} />
                  </div>
                  <div className="activity-info">
                    <span className="activity-name">{withdrawal.name}</span>
                    <span className="activity-time">
                      {new Date(withdrawal.date).toLocaleDateString()} at{' '}
                      {new Date(withdrawal.date).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="activity-amount orange">
                    -₹{withdrawal.amount.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent withdrawals</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
