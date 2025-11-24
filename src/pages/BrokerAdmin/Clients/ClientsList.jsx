import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdSearch, 
  MdAdd, 
  MdFileDownload, 
  MdVisibility, 
  MdBlock, 
  MdCheckCircle 
} from 'react-icons/md';
import './ClientsList.css';

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Dummy data for now
  const dummyClients = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      role: 'CLIENT',
      status: 'ACTIVE',
      kycStatus: 'APPROVED',
      balance: 50000,
      mt5Login: '12345',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 9876543211',
      role: 'CLIENT',
      status: 'ACTIVE',
      kycStatus: 'PENDING',
      balance: 25000,
      mt5Login: '12346',
      createdAt: new Date('2024-02-10')
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+91 9876543212',
      role: 'CLIENT',
      status: 'SUSPENDED',
      kycStatus: 'APPROVED',
      balance: 15000,
      mt5Login: '12347',
      createdAt: new Date('2024-03-05')
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      phone: '+91 9876543213',
      role: 'CLIENT',
      status: 'ACTIVE',
      kycStatus: 'REJECTED',
      balance: 75000,
      mt5Login: '12348',
      createdAt: new Date('2024-03-20')
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david@example.com',
      phone: '+91 9876543214',
      role: 'MASTER',
      status: 'ACTIVE',
      kycStatus: 'APPROVED',
      balance: 100000,
      mt5Login: '12349',
      createdAt: new Date('2024-04-01')
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClients(dummyClients);
      setLoading(false);
    }, 500);
  }, []);

  const handleBlock = (clientId) => {
    if (window.confirm('Are you sure you want to block this client?')) {
      setClients(clients.map(client => 
        client.id === clientId ? { ...client, status: 'BLOCKED' } : client
      ));
      alert('Client blocked successfully!');
    }
  };

  const handleUnblock = (clientId) => {
    setClients(clients.map(client => 
      client.id === clientId ? { ...client, status: 'ACTIVE' } : client
    ));
    alert('Client unblocked successfully!');
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'ALL' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading clients...</p>
      </div>
    );
  }

  return (
    <div className="clients-container">
      {/* Header */}
      <div className="clients-header">
        <div>
          <h1>Clients Management</h1>
          <p>Manage all your trading clients</p>
        </div>
        <button className="btn btn-primary">
          <MdAdd size={20} />
          <span>Add Client</span>
        </button>
      </div>

      {/* Filters */}
      <div className="clients-filters">
        <div className="search-box">
          <MdSearch size={20} />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
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
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BLOCKED">Blocked</option>
          <option value="PENDING">Pending</option>
        </select>

        <button className="btn btn-success">
          <MdFileDownload size={20} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>Showing {filteredClients.length} of {clients.length} clients</p>
      </div>

      {/* Clients Table */}
      <div className="clients-table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Contact</th>
              <th>MT5 Login</th>
              <th>Balance</th>
              <th>KYC Status</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No clients found
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div className="client-info">
                      <div className="client-avatar">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div className="client-name">{client.name}</div>
                        <div className="client-email">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{client.phone}</td>
                  <td>
                    <span className="mt5-badge">{client.mt5Login}</span>
                  </td>
                  <td>
                    <span className="balance">₹{client.balance.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className={`status-badge kyc-${client.kycStatus.toLowerCase()}`}>
                      {client.kycStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${client.status.toLowerCase()}`}>
                      {client.status}
                    </span>
                  </td>
                  <td>{client.createdAt.toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-view" 
                        title="View Details"
                      >
                        <MdVisibility size={18} />
                      </button>
                      {client.status === 'ACTIVE' || client.status === 'SUSPENDED' ? (
                        <button 
                          className="btn-icon btn-block" 
                          title="Block Client"
                          onClick={() => handleBlock(client.id)}
                        >
                          <MdBlock size={18} />
                        </button>
                      ) : (
                        <button 
                          className="btn-icon btn-unblock" 
                          title="Unblock Client"
                          onClick={() => handleUnblock(client.id)}
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
    </div>
  );
}