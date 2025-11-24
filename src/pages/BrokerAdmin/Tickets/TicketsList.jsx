import React, { useState, useEffect } from 'react';
import { 
  MdSearch, 
  MdRefresh,
  MdVisibility,
  MdClose,
  MdSend
} from 'react-icons/md';
import './TicketsList.css';

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  const dummyTickets = [
    {
      id: 'TKT-001',
      raisedBy: 'John Doe',
      raisedByEmail: 'john@example.com',
      subject: 'Unable to withdraw funds',
      priority: 'HIGH',
      status: 'OPEN',
      category: 'WITHDRAWAL',
      createdAt: new Date('2024-11-20T10:30:00'),
      updatedAt: new Date('2024-11-20T10:30:00'),
      assignedTo: 'Support Team',
      messages: [
        {
          id: '1',
          from: 'John Doe',
          message: 'I am unable to withdraw my funds. The withdrawal button is not working.',
          timestamp: new Date('2024-11-20T10:30:00')
        }
      ]
    },
    {
      id: 'TKT-002',
      raisedBy: 'Jane Smith',
      raisedByEmail: 'jane@example.com',
      subject: 'KYC verification pending',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      category: 'KYC',
      createdAt: new Date('2024-11-19T09:15:00'),
      updatedAt: new Date('2024-11-20T08:00:00'),
      assignedTo: 'KYC Team',
      messages: [
        {
          id: '1',
          from: 'Jane Smith',
          message: 'My KYC has been pending for 3 days. Please check.',
          timestamp: new Date('2024-11-19T09:15:00')
        },
        {
          id: '2',
          from: 'Support',
          message: 'We are reviewing your documents. You will hear from us within 24 hours.',
          timestamp: new Date('2024-11-20T08:00:00')
        }
      ]
    },
    {
      id: 'TKT-003',
      raisedBy: 'Mike Johnson',
      raisedByEmail: 'mike@example.com',
      subject: 'Trading platform login issue',
      priority: 'HIGH',
      status: 'OPEN',
      category: 'TECHNICAL',
      createdAt: new Date('2024-11-20T11:45:00'),
      updatedAt: new Date('2024-11-20T11:45:00'),
      assignedTo: 'Tech Support',
      messages: [
        {
          id: '1',
          from: 'Mike Johnson',
          message: 'Cannot login to MT5 platform. Getting error "Invalid credentials".',
          timestamp: new Date('2024-11-20T11:45:00')
        }
      ]
    },
    {
      id: 'TKT-004',
      raisedBy: 'Sarah Williams',
      raisedByEmail: 'sarah@example.com',
      subject: 'Question about IB commission',
      priority: 'LOW',
      status: 'RESOLVED',
      category: 'INQUIRY',
      createdAt: new Date('2024-11-18T15:20:00'),
      updatedAt: new Date('2024-11-19T10:00:00'),
      assignedTo: 'Support Team',
      messages: [
        {
          id: '1',
          from: 'Sarah Williams',
          message: 'How is IB commission calculated?',
          timestamp: new Date('2024-11-18T15:20:00')
        },
        {
          id: '2',
          from: 'Support',
          message: 'IB commission is calculated based on the trading volume of your referred clients. You earn 40% of the spread.',
          timestamp: new Date('2024-11-19T10:00:00')
        }
      ]
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setTickets(dummyTickets);
      setLoading(false);
    }, 500);
  }, []);

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
    setReplyMessage('');
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    const newMessage = {
      id: Date.now().toString(),
      from: 'Support Team',
      message: replyMessage,
      timestamp: new Date()
    };

    setTickets(tickets.map(t => 
      t.id === selectedTicket.id 
        ? { 
            ...t, 
            messages: [...t.messages, newMessage],
            updatedAt: new Date(),
            status: 'IN_PROGRESS'
          } 
        : t
    ));

    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage]
    });

    setReplyMessage('');
    alert('Reply sent successfully!');
  };

  const handleCloseTicket = (ticketId) => {
    if (window.confirm('Are you sure you want to close this ticket?')) {
      setTickets(tickets.map(t => 
        t.id === ticketId 
          ? { ...t, status: 'RESOLVED', updatedAt: new Date() } 
          : t
      ));
      setShowModal(false);
      alert('Ticket closed successfully!');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.raisedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    open: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length,
    highPriority: tickets.filter(t => t.priority === 'HIGH' && t.status !== 'RESOLVED').length
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return '#ef4444';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="tickets-container">
      {/* Stats Cards */}
      <div className="ticket-stats">
        <div className="stat-card-small open">
          <div className="stat-icon">📩</div>
          <div className="stat-info">
            <p>Open Tickets</p>
            <h3>{stats.open}</h3>
          </div>
        </div>
        <div className="stat-card-small progress">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <p>In Progress</p>
            <h3>{stats.inProgress}</h3>
          </div>
        </div>
        <div className="stat-card-small resolved">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <p>Resolved</p>
            <h3>{stats.resolved}</h3>
          </div>
        </div>
        <div className="stat-card-small urgent">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <p>High Priority</p>
            <h3>{stats.highPriority}</h3>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="tickets-header">
        <div>
          <h1>Support Tickets</h1>
          <p>Manage customer support requests</p>
        </div>
        <button className="btn btn-primary">
          <MdRefresh size={20} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="tickets-filters">
        <div className="search-box">
          <MdSearch size={20} />
          <input
            type="text"
            placeholder="Search by ticket ID, name, or subject..."
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
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">All Priority</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <p>Showing {filteredTickets.length} of {tickets.length} tickets</p>
      </div>

      {/* Tickets Table */}
      <div className="tickets-table-container">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Raised By</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  No tickets found
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <span className="ticket-id">{ticket.id}</span>
                  </td>
                  <td>
                    <div className="client-info-small">
                      <div className="client-name">{ticket.raisedBy}</div>
                      <div className="client-email">{ticket.raisedByEmail}</div>
                    </div>
                  </td>
                  <td>
                    <span className="ticket-subject">{ticket.subject}</span>
                  </td>
                  <td>
                    <span className="category-badge">{ticket.category}</span>
                  </td>
                  <td>
                    <span 
                      className="priority-badge"
                      style={{ 
                        backgroundColor: getPriorityColor(ticket.priority) + '20',
                        color: getPriorityColor(ticket.priority)
                      }}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${ticket.status.toLowerCase().replace('_', '-')}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{ticket.assignedTo}</td>
                  <td>{ticket.createdAt.toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-view" 
                        title="View Ticket"
                        onClick={() => handleViewTicket(ticket)}
                      >
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

      {/* Ticket Details Modal */}
      {showModal && selectedTicket && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedTicket.id}: {selectedTicket.subject}</h2>
                <p className="ticket-meta">
                  Raised by {selectedTicket.raisedBy} • {selectedTicket.createdAt.toLocaleString()}
                </p>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="ticket-details-header">
                <div className="detail-item">
                  <span className="detail-label">Priority:</span>
                  <span 
                    className="priority-badge"
                    style={{ 
                      backgroundColor: getPriorityColor(selectedTicket.priority) + '20',
                      color: getPriorityColor(selectedTicket.priority)
                    }}
                  >
                    {selectedTicket.priority}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge status-${selectedTicket.status.toLowerCase().replace('_', '-')}`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="category-badge">{selectedTicket.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Assigned To:</span>
                  <span>{selectedTicket.assignedTo}</span>
                </div>
              </div>

              <div className="conversation-section">
                <h3>Conversation</h3>
                <div className="messages-list">
                  {selectedTicket.messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`message ${msg.from === 'Support' || msg.from === 'Support Team' ? 'message-support' : 'message-user'}`}
                    >
                      <div className="message-header">
                        <span className="message-from">{msg.from}</span>
                        <span className="message-time">{msg.timestamp.toLocaleString()}</span>
                      </div>
                      <div className="message-body">{msg.message}</div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTicket.status !== 'RESOLVED' && (
                <div className="reply-section">
                  <h3>Send Reply</h3>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="4"
                    className="reply-textarea"
                  />
                  <div className="reply-actions">
                    <button className="btn btn-primary" onClick={handleSendReply}>
                      <MdSend size={18} />
                      <span>Send Reply</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            {selectedTicket.status !== 'RESOLVED' && (
              <div className="modal-footer">
                <button 
                  className="btn btn-danger"
                  onClick={() => handleCloseTicket(selectedTicket.id)}
                >
                  <MdClose size={20} />
                  Close Ticket
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}