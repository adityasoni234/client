import React, { useState } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../../styles/Admin/TransactionHistory.css';

function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Statuses');

  // Mock transaction data
  const transactions = [
    // Empty state for now - will show "No transactions found"
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction?.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All Types' || transaction?.type === filterType;
    const matchesStatus = filterStatus === 'All Statuses' || transaction?.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="transaction-history-page">
      <div className="transaction-header">
        <div>
          <h1>Transaction History</h1>
          <p>View, search, and filter your past transactions.</p>
        </div>
      </div>

      <div className="transaction-container">
        {/* Filters */}
        <div className="transaction-filters">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option>All Types</option>
            <option>Deposit</option>
            <option>Withdrawal</option>
            <option>Credit</option>
            <option>Rebate</option>
          </select>

          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Completed</option>
          </select>
        </div>

        {/* Transaction Table */}
        <div className="transaction-table-container">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>TYPE</th>
                <th>MODE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>COMMENT</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.id}</td>
                    <td>
                      <span className={`type-badge ${transaction.type.toLowerCase()}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td>{transaction.mode}</td>
                    <td className="amount">${transaction.amount}</td>
                    <td>
                      <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>{transaction.date}</td>
                    <td>{transaction.comment}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">Showing 1 to 0 of 0 entries</span>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled>
              <FiChevronLeft />
            </button>
            <button className="pagination-btn" disabled>
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;