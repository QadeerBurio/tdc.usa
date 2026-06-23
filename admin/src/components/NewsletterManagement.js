import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import './AdminManagement.css';
import './NewsletterManagement.css';

const NewsletterManagement = () => {
  const { getToken } = useAdmin();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/newsletter`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }

      const data = await response.json();
      setSubscribers(data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      showStatus('error', 'Error loading subscribers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Are you sure you want to remove ${email} from the newsletter subscribers list?`)) {
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/newsletter/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete subscriber');
      }

      setSubscribers(prev => prev.filter(sub => sub._id !== id));
      showStatus('success', 'Subscriber removed successfully!');
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      showStatus('error', 'Error removing subscriber.');
    }
  };

  const showStatus = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
  };

  const handleExportCSV = () => {
    const listToExport = getFilteredSubscribers();
    if (listToExport.length === 0) {
      alert('No subscribers found to export.');
      return;
    }

    // CSV Headers
    const headers = ['Email Address', 'Subscription Date', 'Subscription Time'];

    // CSV Rows
    const rows = listToExport.map(sub => {
      const dateObj = new Date(sub.subscribedAt);
      return [
        sub.email,
        dateObj.toLocaleDateString(),
        dateObj.toLocaleTimeString()
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredSubscribers = () => {
    if (!searchTerm.trim()) return subscribers;
    const term = searchTerm.toLowerCase().trim();
    return subscribers.filter(sub => sub.email.toLowerCase().includes(term));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading subscribers list...</div>;
  }

  const filteredSubscribers = getFilteredSubscribers();

  return (
    <div className="admin-management newsletter-management">
      {statusMessage.text && (
        <div className={`status-notification ${statusMessage.type}`}>
          <i className={statusMessage.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'}></i>
          {statusMessage.text}
        </div>
      )}

      {/* Stats Counter */}
      <div className="newsletter-stats">
        <div className="stat-card">
          <div className="stat-number">{subscribers.length}</div>
          <div className="stat-label">Total Subscribers</div>
        </div>
        <div className="stat-card stat-filtered">
          <div className="stat-number">{filteredSubscribers.length}</div>
          <div className="stat-label">Filtered Matches</div>
        </div>
      </div>

      {/* Main List Management */}
      <div className="management-list">
        <div className="list-header">
          <h2>Newsletter Subscribers</h2>
          <div className="list-controls">
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button 
              className="btn-primary btn-csv" 
              onClick={handleExportCSV}
              title="Export filtered list to CSV"
            >
              <i className="fas fa-file-csv"></i> Export CSV
            </button>
            <span className="item-count">{filteredSubscribers.length} subscribers</span>
          </div>
        </div>

        <div className="items-table">
          {filteredSubscribers.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-paper-plane"></i>
              <h3>No Subscribers Found</h3>
              <p>
                {searchTerm 
                  ? 'No subscribers match your search term.' 
                  : 'No emails have subscribed to the newsletter yet.'}
              </p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>S.No</th>
                  <th>Email Address</th>
                  <th>Subscribed Date</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((sub, index) => (
                  <tr key={sub._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="subscriber-email-container">
                        <i className="far fa-envelope mail-icon"></i>
                        <span className="subscriber-email">{sub.email}</span>
                      </div>
                    </td>
                    <td>{formatDate(sub.subscribedAt)}</td>
                    <td className="actions" style={{ textAlign: 'center' }}>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(sub._id, sub.email)}
                        title="Delete Subscription"
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterManagement;
