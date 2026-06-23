import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import './AdminManagement.css';
import './CaseStudyManagement.css';

const CaseStudyManagement = () => {
  const { getToken } = useAdmin();
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudy, setEditingStudy] = useState(null);
  
  // File states
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    industry: '',
    description: '',
    challenge: '',
    solution: '',
    results: '',
    technologies: '',
    featured: false,
    active: true
  });

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/case-studies?active=all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCaseStudies(data);
    } catch (error) {
      console.error('Error fetching case studies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    const url = editingStudy 
      ? `${process.env.REACT_APP_API_URL}/case-studies/${editingStudy._id}`
      : `${process.env.REACT_APP_API_URL}/case-studies`;
    
    const method = editingStudy ? 'PUT' : 'POST';
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('industry', formData.industry);
    submitData.append('description', formData.description);
    submitData.append('challenge', formData.challenge);
    submitData.append('solution', formData.solution);
    submitData.append('results', formData.results);
    submitData.append('technologies', formData.technologies);
    submitData.append('featured', formData.featured);
    submitData.append('active', formData.active);

    if (videoFile) {
      submitData.append('video', videoFile);
    } else if (!editingStudy) {
      alert('Video file is required!');
      return;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (response.ok) {
        resetForm();
        fetchCaseStudies();
      } else {
        const errData = await response.json();
        alert(errData.message || 'Error saving case study');
      }
    } catch (error) {
      console.error('Error saving case study:', error);
      alert('Error connecting to server');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this case study?')) return;
    
    try {
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/case-studies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchCaseStudies();
      } else {
        const errData = await response.json();
        alert(errData.message || 'Error deleting case study');
      }
    } catch (error) {
      console.error('Error deleting case study:', error);
    }
  };

  const handleEdit = (study) => {
    setEditingStudy(study);
    setFormData({
      title: study.title,
      industry: study.industry,
      description: study.description,
      challenge: study.challenge || '',
      solution: study.solution || '',
      results: study.results || '',
      technologies: study.technologies ? study.technologies.join(', ') : '',
      featured: study.featured || false,
      active: study.active || false
    });

    const apiBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    
    if (study.video) {
      setVideoPreview(study.video.startsWith('http') ? study.video : `${apiBase}${study.video}`);
    } else {
      setVideoPreview('');
    }
    setVideoFile(null);
  };

  const resetForm = () => {
    setEditingStudy(null);
    setFormData({
      title: '',
      industry: '',
      description: '',
      challenge: '',
      solution: '',
      results: '',
      technologies: '',
      featured: false,
      active: true
    });
    setVideoFile(null);
    setVideoPreview('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-management">
      <div className="management-form">
        <h2>{editingStudy ? 'Edit Case Study' : 'Create New Case Study'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Case Study Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Industry *</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. Healthcare, Logistics, E-commerce"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Short Description *</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="A brief overview for listings and card display"
              required
            />
          </div>

          <div className="form-group">
            <label>The Challenge</label>
            <textarea
              name="challenge"
              rows="4"
              value={formData.challenge}
              onChange={handleChange}
              placeholder="What problems was the client facing?"
            />
          </div>

          <div className="form-group">
            <label>The Solution</label>
            <textarea
              name="solution"
              rows="4"
              value={formData.solution}
              onChange={handleChange}
              placeholder="How did TDC.USA help solve the problem?"
            />
          </div>

          <div className="form-group">
            <label>The Results</label>
            <textarea
              name="results"
              rows="4"
              value={formData.results}
              onChange={handleChange}
              placeholder="What positive outcomes were achieved?"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Technologies Used (comma separated)</label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="React, Next.js, Node.js, MongoDB"
              />
            </div>
            <div className="form-group">
              <label>Case Study Video *</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                required={!editingStudy}
              />
              {videoPreview && (
                <div className="video-preview-container-admin">
                  <video 
                    src={videoPreview} 
                    controls 
                    className="video-preview-admin"
                  />
                  <button 
                    type="button" 
                    className="btn-remove-admin-video"
                    onClick={() => { setVideoFile(null); setVideoPreview(''); }}
                  >
                    Remove Video
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-row flex-start">
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <label htmlFor="featured">Featured Case Study (Homepage)</label>
            </div>
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              <label htmlFor="active">Active (Visible Publicly)</label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingStudy ? 'Update Case Study' : 'Create Case Study'}
            </button>
            {editingStudy && (
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="management-list">
        <h2>All Case Studies</h2>
        <div className="items-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Industry</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {caseStudies.map((study) => (
                <tr key={study._id}>
                  <td><strong>{study.title}</strong></td>
                  <td>{study.industry}</td>
                  <td>
                    <span className={`status ${study.active ? 'published' : 'draft'}`}>
                      {study.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${study.featured ? 'published' : 'draft'}`}>
                      {study.featured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(study)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(study._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {caseStudies.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No case studies found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyManagement;
