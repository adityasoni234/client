import React, { useState } from 'react';
import { FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../../styles/Admin/SupportTickets.css';

function SupportTickets() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterPriority, setFilterPriority] = useState('All Priority');

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    priority: 'medium',
    category: 'general',
    message: '',
    attachment: null
  });

  // Mock tickets data
  const tickets = [
    // Empty state for now
  ];

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setTicketForm({
      ...ticketForm,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Ticket Created!\nSubject: ${ticketForm.subject}\nPriority: ${ticketForm.priority}`);
    setShowCreateModal(false);
    setTicketForm({
      subject: '',
      priority: 'medium',
      category: 'general',
      message: '',
      attachment: null
    });
  };

  const handleClear = () => {
    setFilterStatus('All Status');
    setFilterPriority('All Priority');
  };

  return (
    <div className="support-tickets-page">
      <div className="tickets-header">
        <div>
          <h1>Support Tickets</h1>
          <p>Create and manage your support requests.</p>
        </div>
        <button className="btn-create-ticket" onClick={() => setShowCreateModal(true)}>
          <FiPlus /> Create New Ticket
        </button>
      </div>

      <div className="tickets-container">
        {/* Filters */}
        <div className="tickets-filters">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>

          <select
            className="filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option>All Priority</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Urgent</option>
          </select>

          <button className="btn-search">Search</button>
          <button className="btn-clear" onClick={handleClear}>Clear</button>
        </div>

        {/* Ticket Details Section */}
        <div className="ticket-details-section">
          <div className="section-title-row">
            <h2>Ticket Details</h2>
            <div className="pagination-controls">
              <button className="pagination-btn" disabled>
                <FiChevronLeft />
              </button>
              <button className="pagination-btn" disabled>
                <FiChevronRight />
              </button>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="tickets-table-container">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Last Updated</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length > 0 ? (
                  tickets.map((ticket, index) => (
                    <tr key={index}>
                      <td>{ticket.id}</td>
                      <td>{ticket.subject}</td>
                      <td>{ticket.type}</td>
                      <td>{ticket.lastUpdated}</td>
                      <td>
                        <span className={`status-badge ${ticket.status.toLowerCase()}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-view">View</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      You have not created any support tickets yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Ticket</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>

            <form className="ticket-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter ticket subject"
                  value={ticketForm.subject}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority *</label>
                  <select
                    name="priority"
                    value={ticketForm.priority}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={ticketForm.category}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Related</option>
                    <option value="deposit">Deposit Issue</option>
                    <option value="withdrawal">Withdrawal Issue</option>
                    <option value="trading">Trading Issue</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Describe your issue in detail..."
                  value={ticketForm.message}
                  onChange={handleFormChange}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Attachment (Optional)</label>
                <input
                  type="file"
                  name="attachment"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFormChange}
                />
                <small>Max file size: 5MB. Supported formats: JPG, PNG, PDF, DOC</small>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupportTickets;