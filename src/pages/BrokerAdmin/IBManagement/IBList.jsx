import React, { useState, useEffect } from 'react';
import { 
  MdSearch, 
  MdFileDownload, 
  MdVisibility,
  MdRefresh,
  MdPeople,
  MdTrendingUp
} from 'react-icons/md';
import './IBList.css';

export default function IBList() {
  const [ibs, setIbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const dummyIBs = [
    {
      id: '1',
      name: 'Master IB 1',
      email: 'masterib1@example.com',
      phone: '+91 9876543210',
      role: 'MASTER',
      parentId: null,
      parentName: null,
      totalClients: 25,
      activeClients: 20,
      totalRebates: 50000,
      status: 'ACTIVE',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Super Master IB 1',
      email: 'supermaster1@example.com',
      phone: '+91 9876543211',
      role: 'SUPER_MASTER',
      parentId: null,
      parentName: null,
      totalClients: 50,
      activeClients: 45,
      totalRebates: 150000,
      status: 'ACTIVE',
      createdAt: new Date('2024-01-10')
    },
    {
      id: '3',
      name: 'Master IB 2',
      email: 'masterib2@example.com',
      phone: '+91 9876543212',
      role: 'MASTER',
      parentId: '2',
      parentName: 'Super Master IB 1',
      totalClients: 15,
      activeClients: 12,
      totalRebates: 30000,
      status: 'ACTIVE',
      createdAt: new Date('2024-02-01')
    },
    {
      id: '4',
      name: 'Master IB 3',
      email: 'masterib3@example.com',
      phone: '+91 9876543213',
      role: 'MASTER',
      parentId: null,
      parentName: null,
      totalClients: 30,
      activeClients: 28,
      totalRebates: 75000,
      status: 'ACTIVE',
      createdAt: new Date('2024-02-10')
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setIbs(dummyIBs);
      setLoading(false);
    }, 500);
  }, []);

  const filteredIBs = ibs.filter(ib => {
    const matchesSearch = 
      ib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ib.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'ALL' || ib.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const stats = {
    totalIBs: ibs.length,
    masters: ibs.filter(ib => ib.role === 'MASTER').length,
    superMasters: ibs.filter(ib => ib.role === 'SUPER_MASTER').length,
    totalRebates: ibs.reduce((sum, ib) => sum + ib.totalRebates, 0)
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading IB partners...</p>
      </div>
    );
  }

  return (
    <div className="ib-container">
      {/* Stats Cards */}
      <div className="ib-stats">
        <div className="stat-card-small total">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <p>Total IBs</p>
            <h3>{stats.totalIBs}</h3>
          </div>
        </div>
        <div className="stat-card-small masters">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <p>Masters</p>
            <h3>{stats.masters}</h3>
          </div>
        </div>
        <div className="stat-card-small super-masters">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <p>Super Masters</p>
            <h3>{stats.superMasters}</h3>
          </div>
        </div>
        <div className="stat-card-small rebates">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p>Total Rebates Paid</p>
            <h3>₹{stats.totalRebates.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="ib-header">
        <div>
          <h1>IB Management</h1>
          <p>Manage Introducing Brokers and their hierarchy</p>
        </div>
        <button className="btn btn-primary">
          <MdRefresh size={20} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="ib-filters">
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
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">All Roles</option>
          <option value="SUPER_MASTER">Super Master</option>
          <option value="MASTER">Master</option>
        </select>

        <button className="btn btn-success">
          <MdFileDownload size={20} />
          <span>Export</span>
        </button>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <p>Showing {filteredIBs.length} of {ibs.length} IB partners</p>
      </div>

      {/* IB Table */}
      <div className="ib-table-container">
        <table className="ib-table">
          <thead>
            <tr>
              <th>IB Partner</th>
              <th>Role</th>
              <th>Parent IB</th>
              <th>Total Clients</th>
              <th>Active Clients</th>
              <th>Total Rebates</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIBs.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  No IB partners found
                </td>
              </tr>
            ) : (
              filteredIBs.map((ib) => (
                <tr key={ib.id}>
                  <td>
                    <div className="client-info-small">
                      <div className="client-name">{ib.name}</div>
                      <div className="client-email">{ib.email}</div>
                      <div className="client-phone">{ib.phone}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge role-${ib.role.toLowerCase()}`}>
                      {ib.role === 'SUPER_MASTER' ? 'Super Master' : 'Master'}
                    </span>
                  </td>
                  <td>
                    {ib.parentName ? (
                      <span className="parent-name">{ib.parentName}</span>
                    ) : (
                      <span className="no-parent">Direct</span>
                    )}
                  </td>
                  <td>
                    <div className="client-count">
                      <MdPeople size={16} />
                      <span>{ib.totalClients}</span>
                    </div>
                  </td>
                  <td>
                    <div className="client-count active">
                      <MdTrendingUp size={16} />
                      <span>{ib.activeClients}</span>
                    </div>
                  </td>
                  <td>
                    <span className="rebate-amount">₹{ib.totalRebates.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className={`status-badge status-${ib.status.toLowerCase()}`}>
                      {ib.status}
                    </span>
                  </td>
                  <td>{ib.createdAt.toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon btn-view" title="View Details">
                        <MdVisibility size={18} />
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
    </div>
  );
}