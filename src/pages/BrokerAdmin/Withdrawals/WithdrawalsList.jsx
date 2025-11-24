import React, { useState, useEffect } from 'react';
import { 
  MdSearch, 
  MdFileDownload, 
  MdCheckCircle, 
  MdCancel,
  MdVisibility,
  MdAccountBalance,
  MdRefresh,
  MdWarning
} from 'react-icons/md';
import './WithdrawalsList.css';

export default function WithdrawalsList() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');

  // Dummy data
  const dummyWithdrawals = [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      amount: 5000,
      currency: 'INR',
      method: 'UPI',
      upiId: 'john@paytm',
      accountNumber: null,
      ifscCode: null,
      status: 'PENDING',
      mt5Login: '12345',
      mt5Balance: 50000,
      createdAt: new Date('2024-11-19T10:30:00')
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      amount: 15000,
      currency: 'INR',
      method: 'BANK_TRANSFER',
      upiId: null,
      accountNumber: '1234567890',
      ifscCode: 'HDFC0001234',
      status: 'PENDING',
      mt5Login: '12346',
      mt5Balance: 25000,
      createdAt: new Date('2024-11-19T09:15:00')
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Mike Johnson',
      userEmail: 'mike@example.com',
      amount: 25000,
      currency: 'INR',
      method: 'UPI',
      upiId: 'mike@gpay',
      accountNumber: null,
      ifscCode: null,
      status: 'APPROVED',
      approvedBy: 'Admin',
      approvedAt: new Date('2024-11-19T08:00:00'),
      paidAt: new Date('2024-11-19T08:30:00'),
      utrNumber: 'UTR123456789',
      mt5Login: '12347',
      mt5Balance: 75000,
      createdAt: new Date('2024-11-19T07:30:00')
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Sarah Williams',
      userEmail: 'sarah@example.com',
      amount: 10000,
      currency: 'INR',
      method: 'BANK_TRANSFER',
      upiId: null,
      accountNumber: '9876543210',
      ifscCode: 'ICICI0005678',
      status: 'REJECTED',
      rejectionReason: 'Insufficient trading activity',
      mt5Login: '12348',
      mt5Balance: 15000,
      createdAt: new Date('2024-11-18T15:20:00')
    },
    {
      id: '5',
      userId: 'user5',
      userName: 'David Brown',
      userEmail: 'david@example.com',
      amount: 50000,
      currency: 'INR',
      method: 'BANK_TRANSFER',
      upiId: null,
      accountNumber: '5555666677',
      ifscCode: 'SBI0009876',
      status: 'PENDING',
      mt5Login: '12349',
      mt5Balance: 100000,
      createdAt: new Date('2024-11-19T11:45:00')
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWithdrawals(dummyWithdrawals);
      setLoading(false);
    }, 500);
  }, []);

  const handleApprove = (withdrawalId) => {
    const withdrawal = withdrawals.find(w => w.id === withdrawalId);
    
    if (withdrawal.amount > withdrawal.mt5Balance) {
      alert('Error: Withdrawal amount exceeds MT5 balance!');
      return;
    }

    const utr = prompt('Enter UTR/Transaction Reference Number:');
    if (utr) {
      setWithdrawals(withdrawals.map(w => 
        w.id === withdrawalId 
          ? { 
              ...w, 
              status: 'APPROVED',
              approvedBy: 'Super Admin',
              approvedAt: new Date(),
              paidAt: new Date(),
              utrNumber: utr
            } 
          : w
      ));
      setShowModal(false);
      alert('Withdrawal approved! Amount will be debited from MT5 account.');
    }
  };

  const handleReject = (withdrawalId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      setWithdrawals(withdrawals.map(w => 
        w.id === withdrawalId 
          ? { 
              ...w, 
              status: 'REJECTED',
              rejectionReason: reason
            } 
          : w
      ));
      setShowModal(false);
      alert('Withdrawal rejected!');
    }
  };

  const handleViewDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowModal(true);
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = 
      withdrawal.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.mt5Login.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'ALL' || withdrawal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: withdrawals.filter(w => w.status === 'PENDING').length,
    approved: withdrawals.filter(w => w.status === 'APPROVED').length,
    rejected: withdrawals.filter(w => w.status === 'REJECTED').length,
    totalAmount: withdrawals
      .filter(w => w.status === 'APPROVED')
      .reduce((sum, w) => sum + w.amount, 0)
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading withdrawals...</p>
      </div>
    );
  }

  return (
    <div className="withdrawals-container">
      {/* Stats Cards */}
      <div className="withdrawal-stats">
        <div className="stat-card-small pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <p>Pending</p>
            <h3>{stats.pending}</h3>
          </div>
        </div>
        <div className="stat-card-small approved">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <p>Processed Today</p>
            <h3>{stats.approved}</h3>
          </div>
        </div>
        <div className="stat-card-small rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <p>Rejected</p>
            <h3>{stats.rejected}</h3>
          </div>
        </div>
        <div className="stat-card-small total">
          <div className="stat-icon">💸</div>
          <div className="stat-info">
            <p>Total Paid</p>
            <h3>₹{stats.totalAmount.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="withdrawals-header">
        <div>
          <h1>Withdrawal Requests</h1>
          <p>Review and process withdrawal requests</p>
        </div>
        <button className="btn btn-primary">
          <MdRefresh size={20} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="withdrawals-filters">
        <div className="search-box">
          <MdSearch size={20} />
          <input
            type="text"
            placeholder="Search by name, email, MT5 login..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <button className="btn btn-success">
          <MdFileDownload size={20} />
          <span>Export</span>
        </button>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <p>Showing {filteredWithdrawals.length} of {withdrawals.length} withdrawals</p>
      </div>

      {/* Withdrawals Table */}
      <div className="withdrawals-table-container">
        <table className="withdrawals-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Amount</th>
              <th>MT5 Balance</th>
              <th>Method</th>
              <th>Account Details</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWithdrawals.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  No withdrawal requests found
                </td>
              </tr>
            ) : (
              filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id}>
                  <td>
                    <span className="withdrawal-id">#{withdrawal.id}</span>
                  </td>
                  <td>
                    <div className="client-info-small">
                      <div className="client-name">{withdrawal.userName}</div>
                      <div className="client-email">{withdrawal.userEmail}</div>
                      <div className="mt5-login-small">MT5: {withdrawal.mt5Login}</div>
                    </div>
                  </td>
                  <td>
                    <span className="amount withdrawal-amount">₹{withdrawal.amount.toLocaleString()}</span>
                  </td>
                  <td>
                    <div className="balance-info">
                      <span className="balance">₹{withdrawal.mt5Balance.toLocaleString()}</span>
                      {withdrawal.amount > withdrawal.mt5Balance && (
                        <span className="insufficient-badge">
                          <MdWarning size={14} /> Insufficient
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="method-badge">{withdrawal.method.replace('_', ' ')}</span>
                  </td>
                  <td>
                    {withdrawal.method === 'UPI' ? (
                      <span className="account-detail">{withdrawal.upiId}</span>
                    ) : (
                      <div className="account-detail">
                        <div>A/c: {withdrawal.accountNumber}</div>
                        <div className="ifsc">IFSC: {withdrawal.ifscCode}</div>
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge status-${withdrawal.status.toLowerCase()}`}>
                      {withdrawal.status}
                    </span>
                  </td>
                  <td>{withdrawal.createdAt.toLocaleDateString()} {withdrawal.createdAt.toLocaleTimeString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-view" 
                        title="View Details"
                        onClick={() => handleViewDetails(withdrawal)}
                      >
                        <MdVisibility size={18} />
                      </button>
                      {withdrawal.status === 'PENDING' && (
                        <>
                          <button 
                            className="btn-icon btn-approve" 
                            title="Approve & Pay"
                            onClick={() => handleApprove(withdrawal.id)}
                            disabled={withdrawal.amount > withdrawal.mt5Balance}
                          >
                            <MdCheckCircle size={18} />
                          </button>
                          <button 
                            className="btn-icon btn-reject" 
                            title="Reject"
                            onClick={() => handleReject(withdrawal.id)}
                          >
                            <MdCancel size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="btn btn-secondary" disabled>Previous</button>
        <span>Page 1 of 1</span>
        <button className="btn btn-secondary" disabled>Next</button>
      </div>

      {/* Modal */}
      {showModal && selectedWithdrawal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Withdrawal Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Withdrawal ID:</span>
                <span className="detail-value">#{selectedWithdrawal.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Client Name:</span>
                <span className="detail-value">{selectedWithdrawal.userName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedWithdrawal.userEmail}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">MT5 Login:</span>
                <span className="detail-value">{selectedWithdrawal.mt5Login}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Withdrawal Amount:</span>
                <span className="detail-value amount">₹{selectedWithdrawal.amount.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">MT5 Balance:</span>
                <span className="detail-value balance">₹{selectedWithdrawal.mt5Balance.toLocaleString()}</span>
              </div>
              {selectedWithdrawal.amount > selectedWithdrawal.mt5Balance && (
                <div className="alert alert-danger">
                  <MdWarning size={20} />
                  <span>Insufficient balance! Cannot process this withdrawal.</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Payment Method:</span>
                <span className="detail-value">{selectedWithdrawal.method.replace('_', ' ')}</span>
              </div>
              {selectedWithdrawal.method === 'UPI' ? (
                <div className="detail-row">
                  <span className="detail-label">UPI ID:</span>
                  <span className="detail-value">{selectedWithdrawal.upiId}</span>
                </div>
              ) : (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Account Number:</span>
                    <span className="detail-value">{selectedWithdrawal.accountNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">IFSC Code:</span>
                    <span className="detail-value">{selectedWithdrawal.ifscCode}</span>
                  </div>
                </>
              )}
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge status-${selectedWithdrawal.status.toLowerCase()}`}>
                  {selectedWithdrawal.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Requested:</span>
                <span className="detail-value">{selectedWithdrawal.createdAt.toLocaleString()}</span>
              </div>
              {selectedWithdrawal.status === 'APPROVED' && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Approved By:</span>
                    <span className="detail-value">{selectedWithdrawal.approvedBy}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Paid At:</span>
                    <span className="detail-value">{selectedWithdrawal.paidAt?.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">UTR Number:</span>
                    <span className="detail-value utr-highlight">{selectedWithdrawal.utrNumber}</span>
                  </div>
                </>
              )}
              {selectedWithdrawal.status === 'REJECTED' && (
                <div className="detail-row">
                  <span className="detail-label">Rejection Reason:</span>
                  <span className="detail-value rejection-reason">{selectedWithdrawal.rejectionReason}</span>
                </div>
              )}
            </div>
            {selectedWithdrawal.status === 'PENDING' && (
              <div className="modal-footer">
                <button 
                  className="btn btn-success"
                  onClick={() => handleApprove(selectedWithdrawal.id)}
                  disabled={selectedWithdrawal.amount > selectedWithdrawal.mt5Balance}
                >
                  <MdCheckCircle size={20} />
                  Approve & Pay
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleReject(selectedWithdrawal.id)}
                >
                  <MdCancel size={20} />
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}