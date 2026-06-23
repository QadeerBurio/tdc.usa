import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import './AdminManagement.css';
import './ProjectManagement.css';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const apiBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${apiBase}${imagePath}`;
};

const ProjectManagement = () => {
  const { getToken } = useAdmin();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: '',
    technologies: '',
    client: '',
    completionDate: '',
    isFeatured: false,
    isActive: true,
    industry: 'Technology',
    challenge: '',
    solution: '',
    results: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    const url = editingProject 
      ? `${process.env.REACT_APP_API_URL}/projects/${editingProject._id}`
      : `${process.env.REACT_APP_API_URL}/projects`;
    
    const method = editingProject ? 'PUT' : 'POST';
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('category', formData.category);
    submitData.append('description', formData.description);
    submitData.append('technologies', formData.technologies);
    submitData.append('client', formData.client);
    submitData.append('completionDate', formData.completionDate);
    submitData.append('isFeatured', formData.isFeatured);
    submitData.append('isActive', formData.isActive);
    submitData.append('industry', formData.industry);
    submitData.append('challenge', formData.challenge);
    submitData.append('solution', formData.solution);
    submitData.append('results', formData.results);

    if (imageFile) {
      submitData.append('image', imageFile);
    } else if (editingProject && editingProject.image) {
      submitData.append('image', editingProject.image);
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
        fetchProjects();
        alert(editingProject ? 'Project updated successfully!' : 'Project added successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Error saving project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchProjects();
        alert('Project deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Error deleting project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Network error. Please try again.');
    } finally {
      setShowConfirmDialog(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      image: project.image || '',
      technologies: project.technologies.join(', '),
      client: project.client || '',
      completionDate: project.completionDate ? project.completionDate.split('T')[0] : '',
      isFeatured: project.isFeatured || false,
      isActive: project.isActive,
      industry: project.industry || 'Technology',
      challenge: project.challenge || '',
      solution: project.solution || '',
      results: project.results || ''
    });

    if (project.image) {
      setImagePreview(getImageUrl(project.image));
    } else {
      setImagePreview('');
    }
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      image: '',
      technologies: '',
      client: '',
      completionDate: '',
      isFeatured: false,
      isActive: true,
      industry: 'Technology',
      challenge: '',
      solution: '',
      results: ''
    });
    setImageFile(null);
    setImagePreview('');
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

  // Preview project card
  const renderProjectPreview = () => {
    if (!formData.title && !formData.description) return null;
    
    return (
      <div className="project-preview-card">
        <h4>Preview</h4>
        <div className="preview-content">
          <div className="preview-header">
            <h3>{formData.title || 'Project Title'}</h3>
            <span className={`preview-status ${formData.isActive ? 'active' : 'inactive'}`}>
              {formData.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p>{formData.description || 'Project description will appear here...'}</p>
          {formData.client && (
            <p><strong>Client:</strong> {formData.client}</p>
          )}
          <p><strong>Industry:</strong> {formData.industry}</p>
          {formData.technologies && (
            <div className="preview-technologies">
              <strong>Technologies:</strong>
              <div className="tech-tags">
                {formData.technologies.split(',').map((tech, i) => 
                  tech.trim() && <span key={i} className="tech-tag">{tech.trim()}</span>
                )}
              </div>
            </div>
          )}
          {formData.category && (
            <span className="preview-category">{formData.category}</span>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div className="admin-management project-management">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirm-dialog">
          <div className="dialog-box">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="dialog-actions">
              <button className="btn-cancel" onClick={() => {
                setShowConfirmDialog(false);
                setDeleteId(null);
              }}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmDelete}>
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Section */}
      <div className="management-form">
        <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Project Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., E-Commerce Platform"
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., Web Development"
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
              placeholder="Describe the project in detail..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Technologies (comma separated)</label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB, Express"
              />
            </div>
            <div className="form-group">
              <label>Client</label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="Client name or company"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Industry *</label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
              >
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="Retail">Retail</option>
                <option value="Logistics">Logistics</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Technology">Technology</option>
                <option value="Government">Government</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Completion Date</label>
              <input
                type="date"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Project Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'block', margin: '0.5rem 0' }}
            />
            {imagePreview && (
              <div className="image-preview-container" style={{ marginTop: '1rem', border: '1px solid #ddd', borderRadius: '4px', padding: '5px', display: 'inline-block', position: 'relative' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', maxHeight: '150px', display: 'block', borderRadius: '4px' }} 
                />
                <button 
                  type="button" 
                  onClick={() => { setImageFile(null); setImagePreview(''); }}
                  style={{ marginTop: '5px', padding: '4px 8px', fontSize: '0.8rem', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', cursor: 'pointer', borderRadius: '4px', display: 'block', width: '100%' }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Challenge (Business problem)</label>
            <textarea
              name="challenge"
              rows="3"
              value={formData.challenge}
              onChange={handleChange}
              placeholder="Describe the business problem the client faced..."
            />
          </div>

          <div className="form-group">
            <label>Solution (Implemented solution)</label>
            <textarea
              name="solution"
              rows="3"
              value={formData.solution}
              onChange={handleChange}
              placeholder="Describe the implemented solution..."
            />
          </div>

          <div className="form-group">
            <label>Results (Measurable outcomes)</label>
            <textarea
              name="results"
              rows="3"
              value={formData.results}
              onChange={handleChange}
              placeholder="Describe measurable outcomes..."
            />
          </div>

          <div className="form-row checkbox-group">
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                Featured Project
                <span className="checkbox-hint">(Shows on homepage)</span>
              </label>
            </div>
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active Project
                <span className="checkbox-hint">(Visible on website)</span>
              </label>
            </div>
          </div>

          {renderProjectPreview()}

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingProject ? (
                <>
                  <i className="fas fa-save"></i> Update Project
                </>
              ) : (
                <>
                  <i className="fas fa-plus-circle"></i> Add Project
                </>
              )}
            </button>
            {editingProject && (
              <button type="button" className="btn-secondary" onClick={resetForm}>
                <i className="fas fa-times"></i> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="management-list">
        <div className="list-header">
          <h2>All Projects</h2>
          <span className="item-count">{projects.length} projects</span>
        </div>
        
        <div className="items-table">
          {projects.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-folder-open"></i>
              <h3>No Projects Yet</h3>
              <p>Add your first project using the form above.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id} className={project.isActive ? '' : 'inactive-row'}>
                    <td>
                      <div className="project-cell">
                        {project.image && (
                          <img 
                            src={getImageUrl(project.image)} 
                            alt={project.title}
                            className="project-thumbnail"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div className="project-title">{project.title}</div>
                          <div className="project-meta">
                            {project.completionDate && (
                              <span>
                                <i className="far fa-calendar-alt"></i>
                                {formatDate(project.completionDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{project.category}</span>
                    </td>
                    <td>{project.client || 'N/A'}</td>
                    <td>
                      <span className={`status ${project.isActive ? 'active' : 'inactive'}`}>
                        <span className="status-dot"></span>
                        {project.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {project.isFeatured && (
                        <span className="featured-badge">
                          <i className="fas fa-star"></i> Featured
                        </span>
                      )}
                    </td>
                    <td className="actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(project)}
                        title="Edit project"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(project._id)}
                        title="Delete project"
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
      </div>
    </div>
  );
};

export default ProjectManagement;