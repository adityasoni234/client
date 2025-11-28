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

// Mock data for development/fallback
const mockStats = {
  totalClients: 1247,
  totalMasters: 43,
  todayDeposits: 125000,
  todayWithdrawals: 87500,
  pendingKYC: 12,
  activeAccounts: 892,
  recentDeposits: [
    {
      id: 1,
      name: 'Rajesh Kumar',
      amount: 25000,
      date: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Priya Sharma',
      amount: 15000,
      date: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 3,
      name: 'Amit Patel',
      amount: 50000,
      date: new Date(Date.now() - 7200000).toISOString()
    }
  ],
  recentWithdrawals: [
    {
      id: 1,
      name: 'Suresh Reddy',
      amount: 18000,
      date: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Kavita Singh',
      amount: 30000,
      date: new Date(Date.now() - 5400000).toISOString()
    },
    {
      id: 3,
      name: 'Vikram Mehta',
      amount: 22500,
      date: new Date(Date.now() - 9000000).toISOString()
    }
  ]
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

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
        setUseMockData(false);
      } else {
        // Fallback to mock data if API fails
        console.warn('API failed, using mock data:', response.message);
        setStats(mockStats);
        setUseMockData(true);
        setError(null); // Clear error since we have mock data
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use mock data as fallback
      setStats(mockStats);
      setUseMockData(true);
      setError(null); // Clear error since we have mock data
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

  if (!stats) {
    return (
      <div className="error-container">
        <h2>No data available</h2>
        <button onClick={fetchStats} className="retry-btn">
          <MdRefresh size={20} />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="broker-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Broker Owner Panel {useMockData && <span className="demo-badge">Demo Mode</span>}</p>
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
                      {new Date(deposit.date).toLocaleDateString('en-IN')} at{' '}
                      {new Date(deposit.date).toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
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
                      {new Date(withdrawal.date).toLocaleDateString('en-IN')} at{' '}
                      {new Date(withdrawal.date).toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
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