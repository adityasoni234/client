import React, { useState, useEffect } from 'react';
import { 
  MdSearch, 
  MdFileDownload, 
  MdCheckCircle, 
  MdCancel,
  MdVisibility,
  MdRefresh,
  MdImage,
  MdPictureAsPdf,
  MdClose
} from 'react-icons/md';
import './KYCQueue.css';

export default function KYCQueue() {
  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Dummy data
  const dummyKycRequests = [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      phone: '+91 9876543210',
      panNumber: 'ABCDE1234F',
      panDocUrl: 'https://via.placeholder.com/400x250?text=PAN+Card',
      aadhaarNumber: '1234-5678-9012',
      aadhaarDocUrl: 'https://via.placeholder.com/400x250?text=Aadhaar+Card',
      selfieUrl: 'https://via.placeholder.com/400x400?text=Selfie',
      addressProofUrl: 'https://via.placeholder.com/400x250?text=Address+Proof',
      status: 'PENDING',
      submittedAt: new Date('2024-11-19T10:30:00'),
      address: '123 Main Street, Mumbai, Maharashtra - 400001'
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      phone: '+91 9876543211',
      panNumber: 'FGHIJ5678K',
      panDocUrl: 'https://via.placeholder.com/400x250?text=PAN+Card',
      aadhaarNumber: '2345-6789-0123',
      aadhaarDocUrl: 'https://via.placeholder.com/400x250?text=Aadhaar+Card',
      selfieUrl: 'https://via.placeholder.com/400x400?text=Selfie',
      addressProofUrl: 'https://via.placeholder.com/400x250?text=Address+Proof',
      status: 'PENDING',
      submittedAt: new Date('2024-11-19T09:15:00'),
      address: '456 Park Avenue, Delhi, Delhi - 110001'
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Mike Johnson',
      userEmail: 'mike@example.com',
      phone: '+91 9876543212',
      panNumber: 'KLMNO9012P',
      panDocUrl: 'https://via.placeholder.com/400x250?text=PAN+Card',
      aadhaarNumber: '3456-7890-1234',
      aadhaarDocUrl: 'https://via.placeholder.com/400x250?text=Aadhaar+Card',
      selfieUrl: 'https://via.placeholder.com/400x400?text=Selfie',
      addressProofUrl: 'https://via.placeholder.com/400x250?text=Address+Proof',
      status: 'APPROVED',
      verifiedBy: 'Admin',
      verifiedAt: new Date('2024-11-19T08:00:00'),
      submittedAt: new Date('2024-11-19T07:30:00'),
      address: '789 Lake View, Bangalore, Karnataka - 560001'
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Sarah Williams',
      userEmail: 'sarah@example.com',
      phone: '+91 9876543213',
      panNumber: 'PQRST3456U',
      panDocUrl: 'https://via.placeholder.com/400x250?text=PAN+Card',
      aadhaarNumber: '4567-8901-2345',
      aadhaarDocUrl: 'https://via.placeholder.com/400x250?text=Aadhaar+Card',
      selfieUrl: 'https://via.placeholder.com/400x400?text=Selfie',
      addressProofUrl: 'https://via.placeholder.com/400x250?text=Address+Proof',
      status: 'REJECTED',
      rejectionReason: 'Blurry documents, please resubmit clear images',
      submittedAt: new Date('2024-11-18T15:20:00'),
      address: '321 Beach Road, Chennai, Tamil Nadu - 600001'
    },
    {
      id: '5',
      userId: 'user5',
      userName: 'David Brown',
      userEmail: 'david@example.com',
      phone: '+91 9876543214',
      panNumber: 'VWXYZ7890A',
      panDocUrl: 'https://via.placeholder.com/400x250?text=PAN+Card',
      aadhaarNumber: '5678-9012-3456',
      aadhaarDocUrl: 'https://via.placeholder.com/400x250?text=Aadhaar+Card',
      selfieUrl: 'https://via.placeholder.com/400x400?text=Selfie',
      addressProofUrl: 'https://via.placeholder.com/400x250?text=Address+Proof',
      status: 'PENDING',
      submittedAt: new Date('2024-11-19T11:45:00'),
      address: '555 Hill Station, Pune, Maharashtra - 411001'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setKycRequests(dummyKycRequests);
      setLoading(false);
    }, 500);
  }, []);

  const handleApprove = (kycId) => {
    if (window.confirm('Are you sure you want to approve this KYC?')) {
      setKycRequests(kycRequests.map(kyc => 
        kyc.id === kycId 
          ? { 
              ...kyc, 
              status: 'APPROVED',
              verifiedBy: 'Super Admin',
              verifiedAt: new Date()
            } 
          : kyc
      ));
      setShowModal(false);
      alert('KYC approved successfully!');
    }
  };

  const handleReject = (kycId) => {
    const reason = prompt('Enter rejection reason (will be sent to user):');
    if (reason) {
      setKycRequests(kycRequests.map(kyc => 
        kyc.id === kycId 
          ? { 
              ...kyc, 
              status: 'REJECTED',
              rejectionReason: reason
            } 
          : kyc
      ));
      setShowModal(false);
      alert('KYC rejected! User will be notified.');
    }
  };

  const handleViewDetails = (kyc) => {
    setSelectedKyc(kyc);
    setShowModal(true);
  };

  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const filteredKyc = kycRequests.filter(kyc => {
    const matchesSearch = 
      kyc.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.panNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.aadhaarNumber.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'ALL' || kyc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: kycRequests.filter(k => k.status === 'PENDING').length,
    approved: kycRequests.filter(k => k.status === 'APPROVED').length,
    rejected: kycRequests.filter(k => k.status === 'REJECTED').length,
    total: kycRequests.length
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading KYC requests...</p>
      </div>
    );
  }

  return (
    <div className="kyc-container">
      {/* Stats Cards */}
      <div className="kyc-stats">
        <div className="stat-card-small pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <p>Pending Review</p>
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
        <div className="stat-card-small rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <p>Rejected</p>
            <h3>{stats.rejected}</h3>
          </div>
        </div>
        <div className="stat-card-small total">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <p>Total Submissions</p>
            <h3>{stats.total}</h3>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="kyc-header">
        <div>
          <h1>KYC Verification Queue</h1>
          <p>Review and verify client KYC documents</p>
        </div>
        <button className="btn btn-primary">
          <MdRefresh size={20} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="kyc-filters">
        <div className="search-box">
          <MdSearch size={20} />
          <input
            type="text"
            placeholder="Search by name, email, PAN, Aadhaar..."
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
        <p>Showing {filteredKyc.length} of {kycRequests.length} KYC requests</p>
      </div>

      {/* KYC Table */}
      <div className="kyc-table-container">
        <table className="kyc-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>PAN Number</th>
              <th>Aadhaar Number</th>
              <th>Documents</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredKyc.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No KYC requests found
                </td>
              </tr>
            ) : (
              filteredKyc.map((kyc) => (
                <tr key={kyc.id}>
                  <td>
                    <span className="kyc-id">#{kyc.id}</span>
                  </td>
                  <td>
                    <div className="client-info-small">
                      <div className="client-name">{kyc.userName}</div>
                      <div className="client-email">{kyc.userEmail}</div>
                      <div className="client-phone">{kyc.phone}</div>
                    </div>
                  </td>
                  <td>
                    <span className="doc-number">{kyc.panNumber}</span>
                  </td>
                  <td>
                    <span className="doc-number">{kyc.aadhaarNumber}</span>
                  </td>
                  <td>
                    <div className="document-previews">
                      <button 
                        className="doc-preview-btn"
                        onClick={() => handleViewImage(kyc.panDocUrl)}
                        title="View PAN"
                      >
                        <MdImage size={16} />
                        PAN
                      </button>
                      <button 
                        className="doc-preview-btn"
                        onClick={() => handleViewImage(kyc.aadhaarDocUrl)}
                        title="View Aadhaar"
                      >
                        <MdImage size={16} />
                        Aadhaar
                      </button>
                      <button 
                        className="doc-preview-btn"
                        onClick={() => handleViewImage(kyc.selfieUrl)}
                        title="View Selfie"
                      >
                        <MdImage size={16} />
                        Selfie
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${kyc.status.toLowerCase()}`}>
                      {kyc.status}
                    </span>
                  </td>
                  <td>{kyc.submittedAt.toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-view" 
                        title="View Full Details"
                        onClick={() => handleViewDetails(kyc)}
                      >
                        <MdVisibility size={18} />
                      </button>
                      {kyc.status === 'PENDING' && (
                        <>
                          <button 
                            className="btn-icon btn-approve" 
                            title="Approve KYC"
                            onClick={() => handleApprove(kyc.id)}
                          >
                            <MdCheckCircle size={18} />
                          </button>
                          <button 
                            className="btn-icon btn-reject" 
                            title="Reject KYC"
                            onClick={() => handleReject(kyc.id)}
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
      {showModal && selectedKyc && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>KYC Verification Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="kyc-details-grid">
                {/* Personal Information */}
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedKyc.userName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedKyc.userEmail}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedKyc.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{selectedKyc.address}</span>
                  </div>
                </div>

                {/* Document Numbers */}
                <div className="detail-section">
                  <h3>Document Numbers</h3>
                  <div className="detail-row">
                    <span className="detail-label">PAN Number:</span>
                    <span className="detail-value doc-highlight">{selectedKyc.panNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Aadhaar Number:</span>
                    <span className="detail-value doc-highlight">{selectedKyc.aadhaarNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge status-${selectedKyc.status.toLowerCase()}`}>
                      {selectedKyc.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Submitted:</span>
                    <span className="detail-value">{selectedKyc.submittedAt.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Document Images */}
              <div className="detail-section">
                <h3>Uploaded Documents</h3>
                <div className="documents-grid">
                  <div className="document-card">
                    <div className="document-label">PAN Card</div>
                    <img 
                      src={selectedKyc.panDocUrl} 
                      alt="PAN Card"
                      onClick={() => handleViewImage(selectedKyc.panDocUrl)}
                    />
                  </div>
                  <div className="document-card">
                    <div className="document-label">Aadhaar Card</div>
                    <img 
                      src={selectedKyc.aadhaarDocUrl} 
                      alt="Aadhaar Card"
                      onClick={() => handleViewImage(selectedKyc.aadhaarDocUrl)}
                    />
                  </div>
                  <div className="document-card">
                    <div className="document-label">Selfie</div>
                    <img 
                      src={selectedKyc.selfieUrl} 
                      alt="Selfie"
                      onClick={() => handleViewImage(selectedKyc.selfieUrl)}
                    />
                  </div>
                  <div className="document-card">
                    <div className="document-label">Address Proof</div>
                    <img 
                      src={selectedKyc.addressProofUrl} 
                      alt="Address Proof"
                      onClick={() => handleViewImage(selectedKyc.addressProofUrl)}
                    />
                  </div>
                </div>
              </div>

              {selectedKyc.status === 'REJECTED' && (
                <div className="alert alert-danger">
                  <strong>Rejection Reason:</strong> {selectedKyc.rejectionReason}
                </div>
              )}

              {selectedKyc.status === 'APPROVED' && (
                <div className="alert alert-success">
                  <strong>Verified by:</strong> {selectedKyc.verifiedBy} on {selectedKyc.verifiedAt?.toLocaleString()}
                </div>
              )}
            </div>
            {selectedKyc.status === 'PENDING' && (
              <div className="modal-footer">
                <button 
                  className="btn btn-success"
                  onClick={() => handleApprove(selectedKyc.id)}
                >
                  <MdCheckCircle size={20} />
                  Approve KYC
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleReject(selectedKyc.id)}
                >
                  <MdCancel size={20} />
                  Reject KYC
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {showImageModal && (
        <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={() => setShowImageModal(false)}>
              <MdClose size={24} />
            </button>
            <img src={selectedImage} alt="Document" />
          </div>
        </div>
      )}
    </div>
  );
}