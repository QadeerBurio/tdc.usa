import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import './AdminManagement.css';
import './TestimonialManagement.css';

const DEFAULT_PROFILE_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23cbd5e1"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="24" fill="%23475569">User</text></svg>`;
const DEFAULT_LOGO_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60"><rect width="200" height="60" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23475569">Logo</text></svg>`;

const handleProfileError = (e) => {
  e.target.src = DEFAULT_PROFILE_IMAGE;
};

const handleLogoError = (e) => {
  e.target.src = DEFAULT_LOGO_IMAGE;
};

const TestimonialManagement = () => {
  const { getToken } = useAdmin();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  
  // File states
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [companyLogoFile, setCompanyLogoFile] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState('');

  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    designation: '',
    review: '',
    rating: 5,
    featured: false,
    active: true
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/testimonials?active=all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyLogoFile(file);
      setCompanyLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    const url = editingTestimonial 
      ? `${process.env.REACT_APP_API_URL}/testimonials/${editingTestimonial._id}`
      : `${process.env.REACT_APP_API_URL}/testimonials`;
    
    const method = editingTestimonial ? 'PUT' : 'POST';
    
    const submitData = new FormData();
    submitData.append('clientName', formData.clientName);
    submitData.append('companyName', formData.companyName);
    submitData.append('designation', formData.designation);
    submitData.append('review', formData.review);
    submitData.append('rating', formData.rating);
    submitData.append('featured', formData.featured);
    submitData.append('active', formData.active);

    // Profile Image
    if (profileImageFile) {
      submitData.append('profileImage', profileImageFile);
    } else if (editingTestimonial && editingTestimonial.profileImage) {
      submitData.append('profileImage', editingTestimonial.profileImage);
    }

    // Company Logo
    if (companyLogoFile) {
      submitData.append('companyLogo', companyLogoFile);
    } else if (editingTestimonial && editingTestimonial.companyLogo) {
      submitData.append('companyLogo', editingTestimonial.companyLogo);
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
        fetchTestimonials();
      } else {
        const errData = await response.json();
        alert(errData.message || 'Error saving testimonial');
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Error connecting to server');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const token = getToken();
      await fetch(`${process.env.REACT_APP_API_URL}/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      clientName: testimonial.clientName,
      companyName: testimonial.companyName || testimonial.company,
      designation: testimonial.designation,
      review: testimonial.review,
      rating: testimonial.rating,
      featured: testimonial.featured || false,
      active: testimonial.active || false
    });

    const apiBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    
    if (testimonial.profileImage) {
      setProfileImagePreview(testimonial.profileImage.startsWith('http') ? testimonial.profileImage : `${apiBase}${testimonial.profileImage}`);
    } else {
      setProfileImagePreview('');
    }
    
    if (testimonial.companyLogo) {
      setCompanyLogoPreview(testimonial.companyLogo.startsWith('http') ? testimonial.companyLogo : `${apiBase}${testimonial.companyLogo}`);
    } else {
      setCompanyLogoPreview('');
    }

    setProfileImageFile(null);
    setCompanyLogoFile(null);
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setFormData({
      clientName: '',
      companyName: '',
      designation: '',
      review: '',
      rating: 5,
      featured: false,
      active: true
    });
    setProfileImageFile(null);
    setProfileImagePreview('');
    setCompanyLogoFile(null);
    setCompanyLogoPreview('');
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
        <h2>{editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Client Name *</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Company *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Designation *</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Rating (1-5 stars) *</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Review Content *</label>
            <textarea
              name="review"
              rows="6"
              value={formData.review}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Client Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileChange}
              />
              {profileImagePreview && (
                <div className="image-preview-container-t">
                  <img 
                    src={profileImagePreview} 
                    alt="Profile Preview" 
                    onError={handleProfileError}
                    className="profile-preview-t"
                  />
                  <button 
                    type="button" 
                    className="btn-remove-t"
                    onClick={() => { setProfileImageFile(null); setProfileImagePreview(''); }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Company Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
              />
              {companyLogoPreview && (
                <div className="image-preview-container-t">
                  <img 
                    src={companyLogoPreview} 
                    alt="Logo Preview" 
                    onError={handleLogoError}
                    className="logo-preview-t"
                  />
                  <button 
                    type="button" 
                    className="btn-remove-t"
                    onClick={() => { setCompanyLogoFile(null); setCompanyLogoPreview(''); }}
                  >
                    Remove
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
              <label htmlFor="featured">Featured Testimonial (Homepage)</label>
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
              {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
            </button>
            {editingTestimonial && (
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="management-list">
        <h2>All Testimonials</h2>
        <div className="items-table">
          <table>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Company</th>
                <th>Designation</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t._id}>
                  <td>{t.clientName}</td>
                  <td>{t.companyName || t.company}</td>
                  <td>{t.designation}</td>
                  <td>
                    <span className="stars-list">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <i key={i} className="fas fa-star" style={{ color: '#f59e0b', fontSize: '0.9rem' }}></i>
                      ))}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${t.active ? 'published' : 'draft'}`}>
                      {t.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${t.featured ? 'published' : 'draft'}`}>
                      {t.featured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(t)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(t._id)}
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

export default TestimonialManagement;
