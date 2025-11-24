import React, { useState, useEffect } from 'react';
import { 
  MdSearch, 
  MdFileDownload, 
  MdCheckCircle, 
  MdCancel,
  MdVisibility,
  MdAttachFile,
  MdRefresh
} from 'react-icons/md';
import './DepositsList.css';

export default function DepositsList() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Dummy data
  const dummyDeposits = [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      amount: 10000,
      currency: 'INR',
      method: 'UPI',
      utrNumber: 'UTR123456789',
      paymentProofUrl: 'https://example.com/proof1.jpg',
      status: 'PENDING',
      createdAt: new Date('2024-11-19T10:30:00'),
      mt5Login: '12345'
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      amount: 25000,
      currency: 'INR',
      method: 'BANK_TRANSFER',
      utrNumber: 'UTR987654321',
      paymentProofUrl: 'https://example.com/proof2.jpg',
      status: 'PENDING',
      createdAt: new Date('2024-11-19T09:15:00'),
      mt5Login: '12346'
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Mike Johnson',
      userEmail: 'mike@example.com',
      amount: 50000,
      currency: 'INR',
      method: 'UPI',
      utrNumber: 'UTR456789123',
      paymentProofUrl: 'https://example.com/proof3.jpg',
      status: 'APPROVED',
      approvedBy: 'Admin',
      approvedAt: new Date('2024-11-19T08:00:00'),
      createdAt: new Date('2024-11-19T07:30:00'),
      mt5Login: '12347'
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Sarah Williams',
      userEmail: 'sarah@example.com',
      amount: 15000,
      currency: 'INR',
      method: 'NETBANKING',
      utrNumber: 'UTR789123456',
      paymentProofUrl: 'https://example.com/proof4.jpg',
      status: 'REJECTED',
      rejectionReason: 'Invalid proof of payment',
      createdAt: new Date('2024-11-18T15:20:00'),
      mt5Login: '12348'
    },
    {
      id: '5',
      userId: 'user5',
      userName: 'David Brown',
      userEmail: 'david@example.com',
      amount: 75000,
      currency: 'INR',
      method: 'UPI',
      utrNumber: 'UTR321654987',
      paymentProofUrl: 'https://example.com/proof5.jpg',
      status: 'PENDING',
      createdAt: new Date('2024-11-19T11:45:00'),
      mt5Login: '12349'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDeposits(dummyDeposits);
      setLoading(false);
    }, 500);
  }, []);

  const handleApprove = (depositId) => {
    if (window.confirm('Are you sure you want to approve this deposit?')) {
      setDeposits(deposits.map(deposit => 
        deposit.id === depositId 
          ? { 
              ...deposit, 
              status: 'APPROVED',
              approvedBy: 'Super Admin',
              approvedAt: new Date()
            } 
          : deposit
      ));
      setShowModal(false);
      alert('Deposit approved successfully! Amount will be credited to MT5 account.');
    }
  };

  const handleReject = (depositId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      setDeposits(deposits.map(deposit => 
        deposit.id === depositId 
          ? { 
              ...deposit, 
              status: 'REJECTED',
              rejectionReason: reason
            } 
          : deposit
      ));
      setShowModal(false);
      alert('Deposit rejected!');
    }
  };

  const handleViewDetails = (deposit) => {
    setSelectedDeposit(deposit);
    setShowModal(true);
  };

  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = 
      deposit.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.utrNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || deposit.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: deposits.filter(d => d.status === 'PENDING').length,
    approved: deposits.filter(d => d.status === 'APPROVED').length,
    rejected: deposits.filter(d => d.status === 'REJECTED').length,
    totalAmount: deposits
      .filter(d => d.status === 'APPROVED')
      .reduce((sum, d) => sum + d.amount, 0)
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading deposits...</p>
      </div>
    );
  }

  return (
    <div className="deposits-container">
      {/* Stats Cards */}
      <div className="deposit-stats">
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
            <p>Approved Today</p>
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
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p>Total Approved</p>
            <h3>₹{stats.totalAmount.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="deposits-header">
        <div>
          <h1>Deposit Requests</h1>
          <p>Review and approve deposit requests</p>
        </div>
        <button className="btn btn-primary">
          <MdRefresh size={20} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="deposits-filters">
        <div className="search-box">
          <MdSearch size={20} />
          <input
            type="text"
            placeholder="Search by name, email, UTR..."
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
        <p>Showing {filteredDeposits.length} of {deposits.length} deposits</p>
      </div>

      {/* Deposits Table */}
      <div className="deposits-table-container">
        <table className="deposits-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Method</th>
              <th>UTR Number</th>
              <th>MT5 Login</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeposits.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  No deposit requests found
                </td>
              </tr>
            ) : (
              filteredDeposits.map((deposit) => (
                <tr key={deposit.id}>
                  <td>
                    <span className="deposit-id">#{deposit.id}</span>
                  </td>
                  <td>
                    <div className="client-info-small">
                      <div className="client-name">{deposit.userName}</div>
                      <div className="client-email">{deposit.userEmail}</div>
                    </div>
                  </td>
                  <td>
                    <span className="amount">₹{deposit.amount.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="method-badge">{deposit.method.replace('_', ' ')}</span>
                  </td>
                  <td>
                    <span className="utr-number">{deposit.utrNumber}</span>
                  </td>
                  <td>
                    <span className="mt5-badge">{deposit.mt5Login}</span>
                  </td>
                  <td>
                    <span className={`status-badge status-${deposit.status.toLowerCase()}`}>
                      {deposit.status}
                    </span>
                  </td>
                  <td>{deposit.createdAt.toLocaleDateString()} {deposit.createdAt.toLocaleTimeString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-view" 
                        title="View Details"
                        onClick={() => handleViewDetails(deposit)}
                      >
                        <MdVisibility size={18} />
                      </button>
                      {deposit.status === 'PENDING' && (
                        <>
                          <button 
                            className="btn-icon btn-approve" 
                            title="Approve"
                            onClick={() => handleApprove(deposit.id)}
                          >
                            <MdCheckCircle size={18} />
                          </button>
                          <button 
                            className="btn-icon btn-reject" 
                            title="Reject"
                            onClick={() => handleReject(deposit.id)}
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
      {showModal && selectedDeposit && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Deposit Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Deposit ID:</span>
                <span className="detail-value">#{selectedDeposit.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Client Name:</span>
                <span className="detail-value">{selectedDeposit.userName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedDeposit.userEmail}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount:</span>
                <span className="detail-value amount">₹{selectedDeposit.amount.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Payment Method:</span>
                <span className="detail-value">{selectedDeposit.method.replace('_', ' ')}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">UTR Number:</span>
                <span className="detail-value">{selectedDeposit.utrNumber}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">MT5 Login:</span>
                <span className="detail-value">{selectedDeposit.mt5Login}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge status-${selectedDeposit.status.toLowerCase()}`}>
                  {selectedDeposit.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Submitted:</span>
                <span className="detail-value">{selectedDeposit.createdAt.toLocaleString()}</span>
              </div>
              {selectedDeposit.status === 'APPROVED' && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Approved By:</span>
                    <span className="detail-value">{selectedDeposit.approvedBy}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Approved At:</span>
                    <span className="detail-value">{selectedDeposit.approvedAt?.toLocaleString()}</span>
                  </div>
                </>
              )}
              {selectedDeposit.status === 'REJECTED' && (
                <div className="detail-row">
                  <span className="detail-label">Rejection Reason:</span>
                  <span className="detail-value rejection-reason">{selectedDeposit.rejectionReason}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Payment Proof:</span>
                <a href={selectedDeposit.paymentProofUrl} target="_blank" rel="noopener noreferrer" className="btn btn-link">
                  <MdAttachFile size={18} />
                  View Proof
                </a>
              </div>
            </div>
            {selectedDeposit.status === 'PENDING' && (
              <div className="modal-footer">
                <button 
                  className="btn btn-success"
                  onClick={() => handleApprove(selectedDeposit.id)}
                >
                  <MdCheckCircle size={20} />
                  Approve & Credit to MT5
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleReject(selectedDeposit.id)}
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