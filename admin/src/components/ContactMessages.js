import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import './AdminManagement.css';
import './ContactMessages.css';

const ContactMessages = () => {
  const { getToken } = useAdmin();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [replyForm, setReplyForm] = useState({
    show: false,
    messageId: null,
    reply: ''
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contact`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Error loading messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await fetchMessages();
      alert(`Message marked as ${status}`);
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Error updating message status.');
    }
  };

  const deleteMessage = async (id) => {
    setDeleteId(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contact/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      await fetchMessages();
      if (selectedMessage && selectedMessage._id === deleteId) {
        setSelectedMessage(null);
      }
      alert('Message deleted successfully!');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message.');
    } finally {
      setShowConfirmDialog(false);
      setDeleteId(null);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyForm.reply.trim()) {
      alert('Please enter a reply message.');
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contact/${replyForm.messageId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reply: replyForm.reply })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reply');
      }

      await fetchMessages();
      setReplyForm({ show: false, messageId: null, reply: '' });
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert(error.message || 'Error sending reply. Please try again.');
    }
  };

  const getFilteredMessages = () => {
    let filtered = messages;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(msg => 
        msg.name.toLowerCase().includes(search) ||
        msg.email.toLowerCase().includes(search) ||
        msg.subject.toLowerCase().includes(search) ||
        msg.message.toLowerCase().includes(search)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(msg => msg.status === filterStatus);
    }

    return filtered;
  };

  const getStatusCount = (status) => {
    return messages.filter(msg => msg.status === status).length;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return 'fa-envelope';
      case 'read':
        return 'fa-eye';
      case 'replied':
        return 'fa-reply';
      case 'archived':
        return 'fa-archive';
      default:
        return 'fa-envelope';
    }
  };

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  const filteredMessages = getFilteredMessages();

  return (
    <div className="admin-management contact-messages">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirm-dialog">
          <div className="dialog-box">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="dialog-actions">
              <button className="btn-cancel" onClick={() => {
                setShowConfirmDialog(false);
                setDeleteId(null);
              }}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmDelete}>
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="message-stats">
        <div className="stat-card">
          <div className="stat-number">{messages.length}</div>
          <div className="stat-label">Total Messages</div>
        </div>
        <div className="stat-card stat-new">
          <div className="stat-number">{getStatusCount('new')}</div>
          <div className="stat-label">New</div>
        </div>
        <div className="stat-card stat-read">
          <div className="stat-number">{getStatusCount('read')}</div>
          <div className="stat-label">Read</div>
        </div>
        <div className="stat-card stat-replied">
          <div className="stat-number">{getStatusCount('replied')}</div>
          <div className="stat-label">Replied</div>
        </div>
        <div className="stat-card stat-archived">
          <div className="stat-number">{getStatusCount('archived')}</div>
          <div className="stat-label">Archived</div>
        </div>
      </div>

      {/* Messages List */}
      <div className="management-list">
        <div className="list-header">
          <h2>Contact Messages</h2>
          <div className="list-controls">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
            <span className="item-count">{filteredMessages.length} messages</span>
          </div>
        </div>

        <div className="items-table">
          {filteredMessages.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h3>No Messages Found</h3>
              <p>
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters.' 
                  : 'No contact messages have been received yet.'}
              </p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((message) => (
                  <tr 
                    key={message._id} 
                    className={`${message.status === 'new' ? 'unread' : ''} clickable-row ${selectedMessage?._id === message._id ? 'selected-row' : ''}`}
                    onClick={(e) => {
                      if (e.target.closest('.actions') || e.target.closest('a')) return;
                      setSelectedMessage(
                        selectedMessage?._id === message._id ? null : message
                      );
                    }}
                  >
                    <td>
                      <div className="sender-info">
                        <div className="sender-name">{message.name}</div>
                        <div className="sender-email">{message.email}</div>
                      </div>
                    </td>
                    <td>
                      <div className="subject-info">
                        <div className="subject-text">{message.subject}</div>
                        {message.phone && (
                          <div className="subject-phone">
                            <i className="fas fa-phone"></i> {message.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`status ${message.status}`}>
                        <i className={`fas ${getStatusIcon(message.status)}`}></i>
                        {message.status}
                      </span>
                    </td>
                    <td>
                      <div className="date-info">
                        <div>{formatDate(message.createdAt)}</div>
                        <div className="time-info">
                          {new Date(message.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="actions">
                      <button 
                        className="btn-view"
                        onClick={() => setSelectedMessage(
                          selectedMessage?._id === message._id ? null : message
                        )}
                        title="View details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      {message.status === 'new' && (
                        <button 
                          className="btn-read"
                          onClick={() => updateStatus(message._id, 'read')}
                          title="Mark as read"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      <button 
                        className="btn-reply"
                        onClick={() => {
                          setReplyForm({
                            show: true,
                            messageId: message._id,
                            reply: `Dear ${message.name},\n\nThank you for contacting TDC.USA. `
                          });
                          setSelectedMessage(null);
                        }}
                        title="Reply"
                      >
                        <i className="fas fa-reply"></i>
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => deleteMessage(message._id)}
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Message Detail View */}
        {selectedMessage && (
          <div className="message-detail">
            <div className="message-detail-header">
              <h3>Message Details</h3>
              <button 
                className="btn-close"
                onClick={() => setSelectedMessage(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="message-content">
              <div className="detail-row">
                <div className="detail-label">From:</div>
                <div className="detail-value">
                  <strong>{selectedMessage.name}</strong>
                  <span className="detail-email">({selectedMessage.email})</span>
                </div>
              </div>
              {selectedMessage.phone && (
                <div className="detail-row">
                  <div className="detail-label">Phone:</div>
                  <div className="detail-value">
                    <a href={`tel:${selectedMessage.phone}`}>
                      {selectedMessage.phone}
                    </a>
                  </div>
                </div>
              )}
              <div className="detail-row">
                <div className="detail-label">Subject:</div>
                <div className="detail-value">{selectedMessage.subject}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Status:</div>
                <div className="detail-value">
                  <span className={`status ${selectedMessage.status}`}>
                    <i className={`fas ${getStatusIcon(selectedMessage.status)}`}></i>
                    {selectedMessage.status}
                  </span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Received:</div>
                <div className="detail-value">
                  {new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="detail-row message-body-row">
                <div className="detail-label">Message:</div>
                <div className="detail-value message-body">
                  {selectedMessage.message}
                </div>
              </div>
              <div className="message-actions">
                {selectedMessage.status !== 'replied' && (
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      setReplyForm({
                        show: true,
                        messageId: selectedMessage._id,
                        reply: `Dear ${selectedMessage.name},\n\nThank you for contacting TDC.USA. `
                      });
                      setSelectedMessage(null);
                    }}
                  >
                    <i className="fas fa-reply"></i> Reply
                  </button>
                )}
                {selectedMessage.status === 'new' && (
                  <button 
                    className="btn-secondary"
                    onClick={() => updateStatus(selectedMessage._id, 'read')}
                  >
                    <i className="fas fa-check"></i> Mark as Read
                  </button>
                )}
                {selectedMessage.status !== 'archived' && (
                  <button 
                    className="btn-secondary"
                    onClick={() => updateStatus(selectedMessage._id, 'archived')}
                  >
                    <i className="fas fa-archive"></i> Archive
                  </button>
                )}
                <button 
                  className="btn-danger"
                  onClick={() => deleteMessage(selectedMessage._id)}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reply Form */}
        {replyForm.show && (
          <div className="reply-modal">
            <div className="reply-modal-content">
              <div className="reply-modal-header">
                <h3>
                  <i className="fas fa-reply"></i> Reply to Message
                </h3>
                <button 
                  className="btn-close"
                  onClick={() => setReplyForm({ show: false, messageId: null, reply: '' })}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleReplySubmit}>
                <div className="form-group">
                  <label>Reply Message</label>
                  <textarea
                    value={replyForm.reply}
                    onChange={(e) => setReplyForm({ ...replyForm, reply: e.target.value })}
                    rows="6"
                    placeholder="Type your reply here..."
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    <i className="fas fa-paper-plane"></i> Send Reply
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setReplyForm({ show: false, messageId: null, reply: '' })}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessages;