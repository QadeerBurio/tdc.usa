import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import './AdminManagement.css';
import './ApplicationsManagement.css';

const ApplicationsManagement = () => {
  const { getToken } = useAdmin();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  // Filtering states
  const [filterJob, setFilterJob] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, [filterJob, filterStatus]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      // Build query string
      let queryParams = [];
      if (filterJob) queryParams.push(`jobId=${filterJob}`);
      if (filterStatus) queryParams.push(`status=${filterStatus}`);
      const queryStr = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      const [appsRes, jobsRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/applications${queryStr}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_API_URL}/jobs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const appsData = await appsRes.json();
      const jobsData = await jobsRes.json();

      setApplications(appsData);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching applications management data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedApp = await response.json();
        
        // Update local lists
        setApplications(prev => prev.map(app => app._id === appId ? updatedApp : app));
        
        // If selected application detail modal is open, update it too
        if (selectedApplication && selectedApplication._id === appId) {
          setSelectedApplication(updatedApp);
        }
        
        alert('Application status updated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Error updating status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Network error. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && applications.length === 0) return <div className="loading">Loading applications...</div>;

  return (
    <div className="admin-management applications-management">
      {/* Detail Modal */}
      {selectedApplication && (
        <div className="detail-modal" onClick={() => setSelectedApplication(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Applicant Profile Details</h3>
              <button className="close-btn" onClick={() => setSelectedApplication(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="profile-section">
                <div className="profile-field">
                  <strong>Full Name:</strong> <span>{selectedApplication.fullName}</span>
                </div>
                <div className="profile-field">
                  <strong>Position Applied:</strong> <span>{selectedApplication.jobTitle}</span>
                </div>
                <div className="profile-field">
                  <strong>Email:</strong> <a href={`mailto:${selectedApplication.email}`}>{selectedApplication.email}</a>
                </div>
                <div className="profile-field">
                  <strong>Phone:</strong> <a href={`tel:${selectedApplication.phone}`}>{selectedApplication.phone}</a>
                </div>
                <div className="profile-field">
                  <strong>Location:</strong> <span>{selectedApplication.location}</span>
                </div>
                {selectedApplication.linkedin && (
                  <div className="profile-field">
                    <strong>LinkedIn URL:</strong> <a href={selectedApplication.linkedin} target="_blank" rel="noopener noreferrer">{selectedApplication.linkedin}</a>
                  </div>
                )}
                {selectedApplication.portfolio && (
                  <div className="profile-field">
                    <strong>Portfolio URL:</strong> <a href={selectedApplication.portfolio} target="_blank" rel="noopener noreferrer">{selectedApplication.portfolio}</a>
                  </div>
                )}
                {selectedApplication.resume && (
                  <div className="profile-field" style={{ marginTop: '0.5rem' }}>
                    <strong>Resume Document:</strong> 
                    <a 
                      href={getImageUrl(selectedApplication.resume)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', textAlign: 'center', padding: '8px 16px', marginTop: '0.5rem' }}
                    >
                      <i className="fas fa-file-pdf"></i> View Resume
                    </a>
                  </div>
                )}
                <div className="profile-field">
                  <strong>Applied Date:</strong> <span>{formatDate(selectedApplication.createdAt)}</span>
                </div>
              </div>

              <div className="cover-letter-section">
                <h4>Cover Letter / Message</h4>
                <div className="cover-letter-box">
                  {selectedApplication.coverLetter ? selectedApplication.coverLetter : 'No cover letter provided.'}
                </div>
              </div>

              <div className="status-control-section">
                <h4>Update Candidate Status</h4>
                <select
                  value={selectedApplication.status}
                  onChange={(e) => handleStatusChange(selectedApplication._id, e.target.value)}
                  className={`status-select ${selectedApplication.status.toLowerCase()}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Hired">Hired</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="filter-toolbar">
        <div className="filter-group">
          <label>Filter by Job Role</label>
          <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)}>
            <option value="">All Job Openings</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>{job.title} ({job.department})</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Filter by Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
            <option value="Hired">Hired</option>
          </select>
        </div>
      </div>

      {/* Main List Section */}
      <div className="management-list">
        <div className="list-header">
          <h2>Job Applications</h2>
          <span className="item-count">{applications.length} candidates found</span>
        </div>

        <div className="items-table">
          {applications.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-user-tie"></i>
              <h3>No Applications Found</h3>
              <p>No candidates fit the chosen query criteria.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Position</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div className="candidate-cell">
                        <div className="candidate-name">{app.fullName}</div>
                        <div className="candidate-contact">{app.email} | {app.phone}</div>
                      </div>
                    </td>
                    <td>{app.jobTitle}</td>
                    <td>{formatDate(app.createdAt)}</td>
                    <td>
                      <span className={`status-badge ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="actions">
                      {app.resume && (
                        <a 
                          href={getImageUrl(app.resume)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-primary"
                          style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '0.85rem', marginRight: '5px' }}
                          title="Open resume in new tab"
                        >
                          <i className="fas fa-file-alt"></i> View Resume
                        </a>
                      )}
                      <button 
                        className="btn-edit" 
                        onClick={() => setSelectedApplication(app)}
                        title="View application details"
                      >
                        <i className="fas fa-eye"></i> View Profile
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

export default ApplicationsManagement;
