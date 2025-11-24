import React, { useState, useEffect } from 'react';
import { 
  MdSearch, 
  MdFileDownload, 
  MdCheckCircle, 
  MdCancel,
  MdVisibility,
  MdRefresh,
  MdPayment
} from 'react-icons/md';
import './PayoutsList.css';

export default function PayoutsList() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const dummyPayouts = [
    {
      id: '1',
      beneficiaryId: 'ib1',
      beneficiaryName: 'Master IB 1',
      beneficiaryEmail: 'masterib1@example.com',
      amount: 50000,
      mode: 'BANK_TRANSFER',
      currency: 'INR',
      accountNumber: '1234567890',
      ifscCode: 'HDFC0001234',
      upiId: null,
      utrNo: null,
      status: 'PENDING',
      requestedAt: new Date('2024-11-20T10:30:00'),
      processedAt: null,
      processedBy: null
    },
    {
      id: '2',
      beneficiaryId: 'ib2',
      beneficiaryName: 'Super Master IB 1',
      beneficiaryEmail: 'supermaster1@example.com',
      amount: 150000,
      mode: 'UPI',
      currency: 'INR',
      accountNumber: null,
      ifscCode: null,
      upiId: 'supermaster@paytm',
      utrNo: 'UTR123456789',
      status: 'COMPLETED',
      requestedAt: new Date('2024-11-19T09:15:00'),
      processedAt: new Date('2024-11-19T10:00:00'),
      processedBy: 'Admin'
    },
    {
      id: '3',
      beneficiaryId: 'ib3',
      beneficiaryName: 'Master IB 2',
      beneficiaryEmail: 'masterib2@example.com',
      amount: 30000,
      mode: 'BANK_TRANSFER',
      currency: 'INR',
      accountNumber: '9876543210',
      ifscCode: 'ICICI0005678',
      upiId: null,
      utrNo: null,
      status: 'PENDING',
      requestedAt: new Date('2024-11-20T11:45:00'),
      processedAt: null,
      processedBy: null
    },
    {
      id: '4',
      beneficiaryId: 'ib4',
      beneficiaryName: 'Master IB 3',
      beneficiaryEmail: 'masterib3@example.com',
      amount: 75000,
      mode: 'UPI',
      currency: 'INR',
      accountNumber: null,
      ifscCode: null,
      upiId: 'masterib3@gpay',
      utrNo: null,
      status: 'REJECTED',
      requestedAt: new Date('2024-11-18T15:20:00'),
      processedAt: new Date('2024-11-18T16:00:00'),
      processedBy: 'Admin',
      rejectionReason: 'Invalid bank details'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setPayouts(dummyPayouts);
      setLoading(false);
    }, 500);
  }, []);

  const handleApprove = (payoutId) => {
    const utr = prompt('Enter UTR/Transaction Reference Number:');
    if (utr) {
      setPayouts(payouts.map(p => 
        p.id === payoutId 
          ? { 
              ...p, 
              status: 'COMPLETED',
              processedBy: 'Super Admin',
              processedAt: new Date(),
              utrNo: utr
            } 
          : p
      ));
      setShowModal(false);
      alert('Payout approved and processed!');
    }
  };

  const handleReject = (payoutId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      setPayouts(payouts.map(p => 
        p.id === payoutId 
          ? { 
              ...p, 
              status: 'REJECTED',
              rejectionReason: reason,
              processedBy: 'Super Admin',
              processedAt: new Date()
            } 
          : p
      ));
      setShowModal(false);
      alert('Payout rejected!');
    }
  };

  const handleViewDetails = (payout) => {
    setSelectedPayout(payout);
    setShowModal(true);
  };

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = 
      payout.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.beneficiaryEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || payout.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: payouts.filter(p => p.status === 'PENDING').length,
    completed: payouts.filter(p => p.status === 'COMPLETED').length,
    rejected: payouts.filter(p => p.status === 'REJECTED').length,
    totalAmount: payouts
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0)
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading payouts...</p>
      </div>
    );
  }

  return (
    <div className="payouts-container">
      {/* Stats Cards */}
      <div className="payout-stats">
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
            <p>Completed</p>
            <h3>{stats.completed}</h3>
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
            <p>Total Paid</p>
            <h3>₹{stats.totalAmount.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="payouts-header">
        <div>
          <h1>Payout Requests</h1>
          <p>Process IB payout requests</p>
        </div>
        <button className="btn btn-primary">
          <MdRefresh size={20} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="payouts-filters">
        <div className="search-box">
          <MdSearch size={20} />
          <input
            type="text"
            placeholder="Search by name, email..."
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
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <button className="btn btn-success">
          <MdFileDownload size={20} />
          <span>Export</span>
        </button>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <p>Showing {filteredPayouts.length} of {payouts.length} payouts</p>
      </div>

      {/* Payouts Table */}
      <div className="payouts-table-container">
        <table className="payouts-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Beneficiary</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Bank/UPI Details</th>
              <th>UTR Number</th>
              <th>Status</th>
              <th>Requested</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayouts.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  No payout requests found
                </td>
              </tr>
            ) : (
              filteredPayouts.map((payout) => (
                <tr key={payout.id}>
                  <td>
                    <span className="payout-id">#{payout.id}</span>
                  </td>
                  <td>
                    <div className="client-info-small">
                      <div className="client-name">{payout.beneficiaryName}</div>
                      <div className="client-email">{payout.beneficiaryEmail}</div>
                    </div>
                  </td>
                  <td>
                    <span className="amount payout-amount">₹{payout.amount.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="method-badge">{payout.mode.replace('_', ' ')}</span>
                  </td>
                  <td>
                    {payout.mode === 'UPI' ? (
                      <span className="account-detail">{payout.upiId}</span>
                    ) : (
                      <div className="account-detail">
                        <div>A/c: {payout.accountNumber}</div>
                        <div className="ifsc">IFSC: {payout.ifscCode}</div>
                      </div>
                    )}
                  </td>
                  <td>
                    {payout.utrNo ? (
                      <span className="utr-number">{payout.utrNo}</span>
                    ) : (
                      <span className="no-utr">-</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge status-${payout.status.toLowerCase()}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td>{payout.requestedAt.toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-view" 
                        title="View Details"
                        onClick={() => handleViewDetails(payout)}
                      >
                        <MdVisibility size={18} />
                      </button>
                      {payout.status === 'PENDING' && (
                        <>
                          <button 
                            className="btn-icon btn-approve" 
                            title="Approve & Pay"
                            onClick={() => handleApprove(payout.id)}
                          >
                            <MdCheckCircle size={18} />
                          </button>
                          <button 
                            className="btn-icon btn-reject" 
                            title="Reject"
                            onClick={() => handleReject(payout.id)}
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

      {/* Details Modal */}
      {showModal && selectedPayout && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payout Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Payout ID:</span>
                <span className="detail-value">#{selectedPayout.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Beneficiary:</span>
                <span className="detail-value">{selectedPayout.beneficiaryName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedPayout.beneficiaryEmail}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount:</span>
                <span className="detail-value amount">₹{selectedPayout.amount.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Payment Mode:</span>
                <span className="detail-value">{selectedPayout.mode.replace('_', ' ')}</span>
              </div>
              {selectedPayout.mode === 'UPI' ? (
                <div className="detail-row">
                  <span className="detail-label">UPI ID:</span>
                  <span className="detail-value">{selectedPayout.upiId}</span>
                </div>
              ) : (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Account Number:</span>
                    <span className="detail-value">{selectedPayout.accountNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">IFSC Code:</span>
                    <span className="detail-value">{selectedPayout.ifscCode}</span>
                  </div>
                </>
              )}
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge status-${selectedPayout.status.toLowerCase()}`}>
                  {selectedPayout.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Requested At:</span>
                <span className="detail-value">{selectedPayout.requestedAt.toLocaleString()}</span>
              </div>
              {selectedPayout.status === 'COMPLETED' && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">UTR Number:</span>
                    <span className="detail-value utr-highlight">{selectedPayout.utrNo}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Processed By:</span>
                    <span className="detail-value">{selectedPayout.processedBy}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Processed At:</span>
                    <span className="detail-value">{selectedPayout.processedAt?.toLocaleString()}</span>
                  </div>
                </>
              )}
              {selectedPayout.status === 'REJECTED' && (
                <div className="detail-row">
                  <span className="detail-label">Rejection Reason:</span>
                  <span className="detail-value rejection-reason">{selectedPayout.rejectionReason}</span>
                </div>
              )}
            </div>
            {selectedPayout.status === 'PENDING' && (
              <div className="modal-footer">
                <button 
                  className="btn btn-success"
                  onClick={() => handleApprove(selectedPayout.id)}
                >
                  <MdCheckCircle size={20} />
                  Approve & Pay
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleReject(selectedPayout.id)}
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