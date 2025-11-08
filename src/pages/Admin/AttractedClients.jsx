import React, { useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import '../../styles/Admin/AttractedClients.css';

function AttractedClients() {
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Mock clients data - empty for now
  const clients = [
    // Will show "No clients found" message
  ];

  return (
    <div className="attracted-clients-page">
      <div className="clients-header">
        <div className="header-content">
          <FiUsers size={32} className="header-icon" />
          <div>
            <h1>Attracted Clients Details</h1>
            <p>View and manage all your referred clients</p>
          </div>
        </div>
      </div>

      <div className="clients-container">
        {/* Entries Per Page Selector */}
        <div className="table-controls">
          <div className="entries-control">
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries per page</span>
          </div>
        </div>

        {/* Clients Table */}
        <div className="clients-table-container">
          <table className="clients-table">
            <thead>
              <tr>
                <th>USER NAME</th>
                <th>USER EMAIL</th>
                <th>TOTAL DEPOSITS ($)</th>
                <th>TOTAL WITHDRAWALS</th>
                <th>TOTAL VOLUME</th>
                <th>TOTAL COMMISSION</th>
                <th>COUNTRY</th>
                <th>REGISTRATION DATE</th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? (
                clients.map((client, index) => (
                  <tr key={index}>
                    <td>{client.userName}</td>
                    <td>{client.userEmail}</td>
                    <td className="amount">${client.totalDeposits}</td>
                    <td className="amount">${client.totalWithdrawals}</td>
                    <td className="volume">{client.totalVolume}</td>
                    <td className="commission">${client.totalCommission}</td>
                    <td>{client.country}</td>
                    <td>{client.registrationDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    <div className="empty-state">
                      <FiUsers size={64} className="empty-icon" />
                      <h3>No clients found.</h3>
                      <p>Start sharing your referral link to attract new clients!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="pagination-info">
          <span>Showing 1 to 0 of 0 entries</span>
        </div>
      </div>
    </div>
  );
}

export default AttractedClients;