import React, { useState, useEffect } from 'react';
import { 
  MdSearch, 
  MdFileDownload, 
  MdCheckCircle,
  MdRefresh,
  MdVisibility,
  MdCalculate
} from 'react-icons/md';
import './RebatesList.css';

export default function RebatesList() {
  const [rebates, setRebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRebate, setSelectedRebate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const dummyRebates = [
    {
      id: '1',
      userId: 'ib1',
      userName: 'Master IB 1',
      userEmail: 'masterib1@example.com',
      month: 'November 2024',
      totalLots: 125.5,
      totalCommission: 125500,
      rebateRate: 40,
      rebateAmount: 50200,
      status: 'PENDING',
      calculatedAt: new Date('2024-11-01'),
      approvedAt: null,
      paidAt: null
    },
    {
      id: '2',
      userId: 'ib2',
      userName: 'Super Master IB 1',
      userEmail: 'supermaster1@example.com',
      month: 'November 2024',
      totalLots: 350.8,
      totalCommission: 350800,
      rebateRate: 50,
      rebateAmount: 175400,
      status: 'APPROVED',
      calculatedAt: new Date('2024-11-01'),
      approvedAt: new Date('2024-11-02'),
      paidAt: new Date('2024-11-03')
    },
    {
      id: '3',
      userId: 'ib3',
      userName: 'Master IB 2',
      userEmail: 'masterib2@example.com',
      month: 'November 2024',
      totalLots: 85.2,
      totalCommission: 85200,
      rebateRate: 40,
      rebateAmount: 34080,
      status: 'PENDING',
      calculatedAt: new Date('2024-11-01'),
      approvedAt: null,
      paidAt: null
    },
    {
      id: '4',
      userId: 'ib1',
      userName: 'Master IB 1',
      userEmail: 'masterib1@example.com',
      month: 'October 2024',
      totalLots: 145.7,
      totalCommission: 145700,
      rebateRate: 40,
      rebateAmount: 58280,
      status: 'APPROVED',
      calculatedAt: new Date('2024-10-01'),
      approvedAt: new Date('2024-10-02'),
      paidAt: new Date('2024-10-03')
    },
    {
      id: '5',
      userId: 'ib4',
      userName: 'Master IB 3',
      userEmail: 'masterib3@example.com',
      month: 'November 2024',
      totalLots: 220.3,
      totalCommission: 220300,
      rebateRate: 45,
      rebateAmount: 99135,
      status: 'PENDING',
      calculatedAt: new Date('2024-11-01'),
      approvedAt: null,
      paidAt: null
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setRebates(dummyRebates);
      setLoading(false);
    }, 500);
  }, []);

  const handleApprove = (rebateId) => {
    if (window.confirm('Are you sure you want to approve this rebate?')) {
      setRebates(rebates.map(r => 
        r.id === rebateId 
          ? { 
              ...r, 
              status: 'APPROVED',
              approvedAt: new Date(),
              paidAt: new Date()
            } 
          : r
      ));
      setShowModal(false);
      alert('Rebate approved and paid!');
    }
  };

  const handleViewDetails = (rebate) => {
    setSelectedRebate(rebate);
    setShowModal(true);
  };

  const filteredRebates = rebates.filter(rebate => {
    const matchesSearch = 
      rebate.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rebate.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || rebate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: rebates.filter(r => r.status === 'PENDING').length,
    approved: rebates.filter(r => r.status === 'APPROVED').length,
    pendingAmount: rebates
      .filter(r => r.status === 'PENDING')
      .reduce((sum, r) => sum + r.rebateAmount, 0),
    paidAmount: rebates
      .filter(r => r.status === 'APPROVED')
      .reduce((sum, r) => sum + r.rebateAmount, 0)
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading rebates...</p>
      </div>
    );
  }

  return (
    <div className="rebates-container">
      {/* Stats Cards */}
      <div className="rebate-stats">
        <div className="stat-card-small pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <p>Pending Rebates</p>
            <h3>{stats.pending}</h3>
          </div>
        </div>
        <div className="stat-card-small approved">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <p>Approved</p>
            <h3>{stats.approved}</h3>
          </div>
        </div>
        <div className="stat-card-small pending-amount">
          <div className="stat-icon">💵</div>
          <div className="stat-info">
            <p>Pending Amount</p>
            <h3>₹{stats.pendingAmount.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card-small paid">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p>Total Paid</p>
            <h3>₹{stats.paidAmount.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="rebates-header">
        <div>
          <h1>Rebates Management</h1>
          <p>Calculate and approve IB rebates</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <MdCalculate size={20} />
            <span>Calculate Rebates</span>
          </button>
          <button className="btn btn-primary">
            <MdRefresh size={20} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rebates-filters">
        <div className="search-box">
          <MdSearch size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
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
        </select>

        <button className="btn btn-success">
          <MdFileDownload size={20} />
          <span>Export</span>
        </button>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <p>Showing {filteredRebates.length} of {rebates.length} rebates</p>
      </div>

      {/* Rebates Table */}
      <div className="rebates-table-container">
        <table className="rebates-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>IB Partner</th>
              <th>Month</th>
              <th>Total Lots</th>
              <th>Total Commission</th>
              <th>Rebate Rate</th>
              <th>Rebate Amount</th>
              <th>Status</th>
              <th>Calculated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRebates.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data">
                  No rebates found
                </td>
              </tr>
            ) : (
              filteredRebates.map((rebate) => (
                <tr key={rebate.id}>
                  <td>
                    <span className="rebate-id">#{rebate.id}</span>
                  </td>
                  <td>
                    <div className="client-info-small">
                      <div className="client-name">{rebate.userName}</div>
                      <div className="client-email">{rebate.userEmail}</div>
                    </div>
                  </td>
                  <td>
                    <span className="month-badge">{rebate.month}</span>
                  </td>
                  <td>
                    <span className="lots">{rebate.totalLots.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className="commission">₹{rebate.totalCommission.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="rate">{rebate.rebateRate}%</span>
                  </td>
                  <td>
                    <span className="rebate-amount">₹{rebate.rebateAmount.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className={`status-badge status-${rebate.status.toLowerCase()}`}>
                      {rebate.status}
                    </span>
                  </td>
                  <td>{rebate.calculatedAt.toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-view" 
                        title="View Details"
                        onClick={() => handleViewDetails(rebate)}
                      >
                        <MdVisibility size={18} />
                      </button>
                      {rebate.status === 'PENDING' && (
                        <button 
                          className="btn-icon btn-approve" 
                          title="Approve & Pay"
                          onClick={() => handleApprove(rebate.id)}
                        >
                          <MdCheckCircle size={18} />
                        </button>
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
      {showModal && selectedRebate && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Rebate Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Rebate ID:</span>
                <span className="detail-value">#{selectedRebate.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">IB Partner:</span>
                <span className="detail-value">{selectedRebate.userName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedRebate.userEmail}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Month:</span>
                <span className="detail-value">{selectedRebate.month}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Lots Traded:</span>
                <span className="detail-value">{selectedRebate.totalLots.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Commission:</span>
                <span className="detail-value">₹{selectedRebate.totalCommission.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Rebate Rate:</span>
                <span className="detail-value">{selectedRebate.rebateRate}%</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Rebate Amount:</span>
                <span className="detail-value rebate-highlight">₹{selectedRebate.rebateAmount.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge status-${selectedRebate.status.toLowerCase()}`}>
                  {selectedRebate.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Calculated At:</span>
                <span className="detail-value">{selectedRebate.calculatedAt.toLocaleString()}</span>
              </div>
              {selectedRebate.status === 'APPROVED' && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Approved At:</span>
                    <span className="detail-value">{selectedRebate.approvedAt?.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Paid At:</span>
                    <span className="detail-value">{selectedRebate.paidAt?.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
            {selectedRebate.status === 'PENDING' && (
              <div className="modal-footer">
                <button 
                  className="btn btn-success"
                  onClick={() => handleApprove(selectedRebate.id)}
                >
                  <MdCheckCircle size={20} />
                  Approve & Pay Rebate
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}