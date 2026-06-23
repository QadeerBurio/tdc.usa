import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import './AdminManagement.css';

const DEFAULT_BLOG_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%231e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="32" fill="%23f9c349">TDC.USA</text></svg>`;

const handleImageError = (e) => {
  e.target.src = DEFAULT_BLOG_IMAGE;
};

const BlogManagement = () => {
  const { getToken } = useAdmin();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'TDC USA Team',
    category: 'Technology',
    tags: '',
    status: 'Draft',
    featured: false,
    readTime: '5 min read',
    slug: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/blogs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
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
    const url = editingBlog 
      ? `${process.env.REACT_APP_API_URL}/blogs/${editingBlog._id}`
      : `${process.env.REACT_APP_API_URL}/blogs`;
    
    const method = editingBlog ? 'PUT' : 'POST';
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('excerpt', formData.excerpt);
    submitData.append('content', formData.content);
    submitData.append('author', formData.author);
    submitData.append('category', formData.category);
    submitData.append('tags', formData.tags);
    submitData.append('status', formData.status);
    submitData.append('featured', formData.featured);
    submitData.append('readTime', formData.readTime);

    if (imageFile) {
      submitData.append('image', imageFile);
    } else if (editingBlog && (editingBlog.featuredImage || editingBlog.image)) {
      const imgPath = editingBlog.featuredImage || editingBlog.image;
      submitData.append('image', imgPath);
      submitData.append('featuredImage', imgPath);
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
        fetchBlogs();
      } else {
        const errData = await response.json();
        alert(errData.message || 'Error saving blog');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error connecting to server');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const token = getToken();
      await fetch(`${process.env.REACT_APP_API_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      tags: blog.tags.join(', '),
      status: blog.status || (blog.isPublished ? 'Published' : 'Draft'),
      featured: blog.featured || false,
      readTime: blog.readTime || '5 min read',
      slug: blog.slug || ''
    });

    const imgPath = blog.featuredImage || blog.image;
    if (imgPath) {
      const apiBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
      setImagePreview(imgPath.startsWith('http') ? imgPath : `${apiBase}${imgPath}`);
    } else {
      setImagePreview('');
    }
    setImageFile(null);
  };

  const resetForm = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: 'TDC USA Team',
      category: 'Technology',
      tags: '',
      status: 'Draft',
      featured: false,
      readTime: '5 min read',
      slug: ''
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-management">
      <div className="management-form">
        <h2>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Excerpt *</label>
            <input
              type="text"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Content *</label>
            <textarea
              name="content"
              rows="8"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Innovation">Innovation</option>
                <option value="Industry">Industry</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="React, JavaScript, Web Development"
            />
          </div>
          
          <div className="form-group">
            <label>Featured Image</label>
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
                  onError={handleImageError}
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

          <div className="form-row">
            <div className="form-group">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div className="form-group">
              <label>Read Time *</label>
              <input
                type="text"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                required
                placeholder="e.g. 5 min read"
              />
            </div>
          </div>
          {editingBlog && (
            <div className="form-group">
              <label>Slug (auto-generated)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                readOnly
                style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
              />
            </div>
          )}
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            <label htmlFor="featured">Featured Blog (Show on Homepage)</label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingBlog ? 'Update Blog' : 'Create Blog'}
            </button>
            {editingBlog && (
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="management-list">
        <h2>All Blogs</h2>
        <div className="items-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Author</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>{blog.title}</td>
                  <td>{blog.category}</td>
                  <td>
                    <span className={`status ${(blog.status || (blog.isPublished ? 'Published' : 'Draft')) === 'Published' ? 'published' : 'draft'}`}>
                      {blog.status || (blog.isPublished ? 'Published' : 'Draft')}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${blog.featured ? 'published' : 'draft'}`}>
                      {blog.featured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td>{blog.author || 'TDC.USA Team'}</td>
                  <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button 
                      className="btn-view"
                      title="Preview Blog"
                      onClick={() => window.open(`http://localhost:3000/blogs/${blog.slug || blog._id}`, '_blank')}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(blog)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(blog._id)}
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

export default BlogManagement;