import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Website Pages
import Home from './pages/Website/Home';

// Admin Pages
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import Profile from './pages/Admin/Profile';
import Deposit from './pages/Admin/Deposit';
import LiveAccount from './pages/Admin/LiveAccount';
import TransactionHistory from './pages/Admin/TransactionHistory';
import SupportTickets from './pages/Admin/SupportTickets';
import Download from './pages/Admin/Download';
import IBDashboard from './pages/Admin/IBDashboard';
import ReferralLinks from './pages/Admin/ReferralLinks';
import AttractedClients from './pages/Admin/AttractedClients';

// Components
import Sidebar from './pages/Admin/Sidebar';

function App() {
  return (
    <Routes>
      {/* Website Home Page - Default Route */}
      <Route path="/" element={<Home />} />
      
      {/* Admin Login Route */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin Routes with Sidebar Layout */}
      <Route path="/admin/*" element={
        <div className="admin-layout">
          <Sidebar />
          <div className="admin-content">
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="deposit" element={<Deposit />} />
              <Route path="live-account" element={<LiveAccount />} />
              <Route path="withdraw" element={<div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                fontSize: '24px',
                color: '#6b7280'
              }}>Withdraw Page - Coming Soon</div>} />
              <Route path="transactions" element={<TransactionHistory />} />
              <Route path="support" element={<SupportTickets />} />
              <Route path="download" element={<Download />} />
              
              {/* IB Room Routes */}
              <Route path="ib-dashboard" element={<IBDashboard />} />
              <Route path="referral-links" element={<ReferralLinks />} />
              <Route path="attracted-clients" element={<AttractedClients />} />
              
              {/* Default redirect to dashboard */}
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </div>
        </div>
      } />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;