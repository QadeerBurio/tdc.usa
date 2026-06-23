import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import './AdminManagement.css';

const JobManagement = () => {
  const { getToken } = useAdmin();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full Time',
    experienceLevel: 'Entry Level',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    salary: '',
    applicationDeadline: '',
    status: 'Open',
    featuredJob: false,
    featured: false,
    activeJob: true
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    const url = editingJob 
      ? `${process.env.REACT_APP_API_URL}/jobs/${editingJob._id}`
      : `${process.env.REACT_APP_API_URL}/jobs`;
    
    const method = editingJob ? 'PUT' : 'POST';
    
    const requirementsArray = formData.requirements.split('\n').filter(item => item.trim());
    const responsibilitiesArray = formData.responsibilities.split('\n').filter(item => item.trim());

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          requirements: requirementsArray,
          responsibilities: responsibilitiesArray,
          isActive: formData.status === 'Open',
          applicationDeadline: formData.applicationDeadline || undefined
        })
      });

      if (response.ok) {
        resetForm();
        fetchJobs();
        alert(editingJob ? 'Job updated successfully!' : 'Job posted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Error saving job');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    
    try {
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchJobs();
        alert('Job deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Error deleting job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type || 'Full Time',
      experienceLevel: job.experienceLevel || 'Entry Level',
      description: job.description,
      requirements: job.requirements.join('\n'),
      responsibilities: job.responsibilities.join('\n'),
      benefits: job.benefits || '',
      salary: job.salary || '',
      applicationDeadline: job.applicationDeadline ? job.applicationDeadline.split('T')[0] : '',
      status: job.status || (job.isActive ? 'Open' : 'Closed'),
      featuredJob: job.featuredJob || false,
      featured: job.featured || false,
      activeJob: job.activeJob !== false
    });
  };

  const resetForm = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'Full Time',
      experienceLevel: 'Entry Level',
      description: '',
      requirements: '',
      responsibilities: '',
      benefits: '',
      salary: '',
      applicationDeadline: '',
      status: 'Open',
      featuredJob: false,
      featured: false,
      activeJob: true
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-management">
      <div className="management-form">
        <h2>{editingJob ? 'Edit Job' : 'Post New Job'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Senior React Developer"
              />
            </div>
            <div className="form-group">
              <label>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., New York, NY (Hybrid)"
              />
            </div>
            <div className="form-group">
              <label>Job Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Experience Level *</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
            <div className="form-group">
              <label>Application Deadline</label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the job role and responsibilities..."
            />
          </div>
          <div className="form-group">
            <label>Requirements (one per line)</label>
            <textarea
              name="requirements"
              rows="4"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Bachelor's degree in Computer Science&#10;5+ years of experience&#10;Strong JavaScript skills"
            />
          </div>
          <div className="form-group">
            <label>Responsibilities (one per line)</label>
            <textarea
              name="responsibilities"
              rows="4"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="Lead development team&#10;Design system architecture&#10;Write clean, maintainable code"
            />
          </div>
          <div className="form-group">
            <label>Benefits (one per line)</label>
            <textarea
              name="benefits"
              rows="3"
              value={formData.benefits}
              onChange={handleChange}
              placeholder="Flexible Hours&#10;Health Coverage&#10;Remote Work&#10;Learning Budget"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Salary Range</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="$80,000 - $100,000"
              />
            </div>
            <div className="form-group">
              <label>Job Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <label htmlFor="featured">Featured on Homepage</label>
            </div>
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="activeJob"
                name="activeJob"
                checked={formData.activeJob}
                onChange={handleChange}
              />
              <label htmlFor="activeJob">Active Job (Show on Careers Page)</label>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingJob ? 'Update Job' : 'Post Job'}
            </button>
            {editingJob && (
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="management-list">
        <h2>All Job Postings</h2>
        <div className="items-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Location</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Applications Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.department}</td>
                  <td>{job.location}</td>
                  <td>
                    <span className={`status ${(job.status || (job.isActive ? 'Open' : 'Closed')) === 'Open' ? 'published' : 'draft'}`}>
                      {job.status || (job.isActive ? 'Open' : 'Closed')}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${(job.featured || job.featuredJob) ? 'published' : 'draft'}`}>
                      {(job.featured || job.featuredJob) ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td>
                    <span className="item-count" style={{ display: 'inline-block' }}>
                      {job.applicationsCount || 0}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="btn-view"
                      title="Preview Job Page"
                      onClick={() => window.open(`http://localhost:3000/careers/${job._id}`, '_blank')}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(job)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(job._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobManagement;