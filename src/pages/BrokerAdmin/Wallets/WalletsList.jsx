import React, { useState, useEffect } from 'react';
import { 
  MdSearch, 
  MdFileDownload, 
  MdAccountBalanceWallet,
  MdAdd,
  MdRemove,
  MdRefresh,
  MdVisibility
} from 'react-icons/md';
import './WalletsList.css';

export default function WalletsList() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  // Dummy data for now
  const dummyWallets = [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      currency: 'INR',
      availableBalance: 50000,
      lockedBalance: 5000,
      totalBalance: 55000,
      lastTransaction: new Date('2024-11-20T10:30:00'),
      status: 'ACTIVE'
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      currency: 'INR',
      availableBalance: 25000,
      lockedBalance: 0,
      totalBalance: 25000,
      lastTransaction: new Date('2024-11-20T09:15:00'),
      status: 'ACTIVE'
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Mike Johnson',
      userEmail: 'mike@example.com',
      currency: 'INR',
      availableBalance: 75000,
      lockedBalance: 10000,
      totalBalance: 85000,
      lastTransaction: new Date('2024-11-19T15:20:00'),
      status: 'ACTIVE'
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Sarah Williams',
      userEmail: 'sarah@example.com',
      currency: 'INR',
      availableBalance: 15000,
      lockedBalance: 2000,
      totalBalance: 17000,
      lastTransaction: new Date('2024-11-19T14:10:00'),
      status: 'ACTIVE'
    },
    {
      id: '5',
      userId: 'user5',
      userName: 'David Brown',
      userEmail: 'david@example.com',
      currency: 'INR',
      availableBalance: 100000,
      lockedBalance: 15000,
      totalBalance: 115000,
      lastTransaction: new Date('2024-11-20T11:45:00'),
      status: 'ACTIVE'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWallets(dummyWallets);
      setLoading(false);
    }, 500);
  }, []);

  const handleViewDetails = (wallet) => {
    setSelectedWallet(wallet);
    setShowModal(true);
  };

  const filteredWallets = wallets.filter(wallet => {
    const matchesSearch = 
      wallet.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const totalStats = {
    totalWallets: wallets.length,
    totalBalance: wallets.reduce((sum, w) => sum + w.totalBalance, 0),
    totalAvailable: wallets.reduce((sum, w) => sum + w.availableBalance, 0),
    totalLocked: wallets.reduce((sum, w) => sum + w.lockedBalance, 0)
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading wallets...</p>
      </div>
    );
  }

  return (
    <div className="wallets-container">
      {/* Stats Cards */}
      <div className="wallet-stats">
        <div className="stat-card-small total">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p>Total Wallets</p>
            <h3>{totalStats.totalWallets}</h3>
          </div>
        </div>
        <div className="stat-card-small balance">
          <div className="stat-icon">💵</div>
          <div className="stat-info">
            <p>Total Balance</p>
            <h3>₹{totalStats.totalBalance.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card-small available">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <p>Available Balance</p>
            <h3>₹{totalStats.totalAvailable.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card-small locked">
          <div className="stat-icon">🔒</div>
          <div className="stat-info">
            <p>Locked Balance</p>
            <h3>₹{totalStats.totalLocked.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="wallets-header">
        <div>
          <h1>Client Wallets</h1>
          <p>Manage client wallet balances</p>
        </div>
        <button className="btn btn-primary">
          <MdRefresh size={20} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="wallets-filters">
        <div className="search-box">
          <MdSearch size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="btn btn-success">
          <MdFileDownload size={20} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <p>Showing {filteredWallets.length} of {wallets.length} wallets</p>
      </div>

      {/* Wallets Table */}
      <div className="wallets-table-container">
        <table className="wallets-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Available Balance</th>
              <th>Locked Balance</th>
              <th>Total Balance</th>
              <th>Currency</th>
              <th>Last Transaction</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWallets.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No wallets found
                </td>
              </tr>
            ) : (
              filteredWallets.map((wallet) => (
                <tr key={wallet.id}>
                  <td>
                    <div className="client-info-small">
                      <div className="client-name">{wallet.userName}</div>
                      <div className="client-email">{wallet.userEmail}</div>
                    </div>
                  </td>
                  <td>
                    <span className="balance available">
                      ₹{wallet.availableBalance.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className="balance locked">
                      ₹{wallet.lockedBalance.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className="balance total">
                      ₹{wallet.totalBalance.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className="currency-badge">{wallet.currency}</span>
                  </td>
                  <td>{wallet.lastTransaction.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${wallet.status.toLowerCase()}`}>
                      {wallet.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-view" 
                        title="View Details"
                        onClick={() => handleViewDetails(wallet)}
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button 
                        className="btn-icon btn-credit" 
                        title="Credit"
                      >
                        <MdAdd size={18} />
                      </button>
                      <button 
                        className="btn-icon btn-debit" 
                        title="Debit"
                      >
                        <MdRemove size={18} />
                      </button>
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
      {showModal && selectedWallet && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Wallet Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Client Name:</span>
                <span className="detail-value">{selectedWallet.userName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedWallet.userEmail}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Available Balance:</span>
                <span className="detail-value balance">₹{selectedWallet.availableBalance.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Locked Balance:</span>
                <span className="detail-value balance">₹{selectedWallet.lockedBalance.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Balance:</span>
                <span className="detail-value balance">₹{selectedWallet.totalBalance.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Currency:</span>
                <span className="detail-value">{selectedWallet.currency}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge status-${selectedWallet.status.toLowerCase()}`}>
                  {selectedWallet.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Last Transaction:</span>
                <span className="detail-value">{selectedWallet.lastTransaction.toLocaleString()}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-success">
                <MdAdd size={20} />
                Credit Wallet
              </button>
              <button className="btn btn-danger">
                <MdRemove size={20} />
                Debit Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}