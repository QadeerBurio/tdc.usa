import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './BlogDetail.css';

const DEFAULT_BLOG_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%231e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="32" fill="%23f9c349">TDC.USA</text></svg>`;

const getImageUrl = (imagePath) => {
  if (!imagePath) return DEFAULT_BLOG_IMAGE;
  if (imagePath.startsWith('http')) return imagePath;
  const apiBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${apiBase}${imagePath}`;
};

const handleImageError = (e) => {
  e.target.src = DEFAULT_BLOG_IMAGE;
};

const BlogDetail = () => {
  const { slug } = useParams(); // Holds the blog slug or _id
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogAndRelated();
  }, [slug]);

  const fetchBlogAndRelated = async () => {
    try {
      setLoading(true);
      setError('');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

      // 1. Fetch current blog by slug or ID
      const response = await fetch(`${apiUrl}/blogs/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Blog not found');
        }
        throw new Error('Unable to load blog');
      }
      const data = await response.json();
      setBlog(data);

      // 2. Fetch related blogs by category
      const allRes = await fetch(`${apiUrl}/blogs/${slug}/related`);
      if (allRes.ok) {
        const allData = await allRes.json();
        setRelatedBlogs(allData);
      }
    } catch (err) {
      console.error('Error loading blog details:', err);
      if (err.message === 'Blog not found') {
        setError('Blog not found');
      } else {
        setError('Unable to load blog');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading" style={{ textAlign: 'center', padding: '6rem' }}>Loading...</div>;

  if (error || !blog) {
    return (
      <div className="container error-container" style={{ padding: '6rem 20px', textAlign: 'center' }}>
        <h2>{error || 'Blog not found'}</h2>
        <button onClick={() => navigate('/blogs')} className="btn-primary" style={{ marginTop: '2rem' }}>
          Back to Blogs
        </button>
      </div>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="blog-detail-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="container">
          <motion.div 
            className="breadcrumb"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/blogs">Blogs</Link> &gt; <span>{blog.title}</span>
          </motion.div>
          <motion.span 
            className="category-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {blog.category}
          </motion.span>
          <motion.h1 
            className="article-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {blog.title}
          </motion.h1>
          
          {/* Article Metadata */}
          <motion.div 
            className="article-meta"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="meta-item">
              <i className="fas fa-user"></i>
              <span>By {blog.author || 'TDC.USA Team'}</span>
            </div>
            <div className="meta-item">
              <i className="far fa-calendar-alt"></i>
              <span>{new Date(blog.publishedDate || blog.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            {blog.readTime && (
              <div className="meta-item">
                <i className="far fa-clock"></i>
                <span>{blog.readTime}</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <div className="container">
        <motion.article 
          className="blog-article"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {/* Featured Image */}
          <div className="article-image">
            <img 
              src={getImageUrl(blog.featuredImage || blog.image)} 
              alt={blog.title} 
              onError={handleImageError}
            />
          </div>

          {/* Content Section */}
          <div className="article-content" style={{ marginTop: '3rem' }}>
            {blog.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <footer className="article-footer">
              <div className="tags-section">
                <strong>Tags:</strong>
                <div className="tag-badges">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="tag-badge">#{tag}</span>
                  ))}
                </div>
              </div>
            </footer>
          )}
        </motion.article>

        {/* Related Articles Section */}
        {relatedBlogs.length > 0 && (
          <section className="related-blogs-section">
            <h2 className="related-title">Related Insights</h2>
            <motion.div 
              className="related-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {relatedBlogs.map((item) => (
                <motion.div 
                  key={item._id} 
                  className="related-card"
                  variants={itemVariants}
                  onClick={() => navigate(`/blogs/${item.slug || item._id}`)}
                  style={{ cursor: 'pointer' }}
                  whileHover={{ y: -6, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}
                >
                  <div className="related-card-image">
                    <img 
                      src={getImageUrl(item.featuredImage || item.image)} 
                      alt={item.title} 
                      onError={handleImageError}
                    />
                  </div>
                  <div className="related-card-body">
                    <span className="related-category">{item.category}</span>
                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>
                    <span className="read-link">Read Article &rarr;</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* CTA Section */}
        <section className="blog-cta" style={{ marginTop: '5rem' }}>
          <motion.div 
            className="cta-container-vibrant" 
            style={{ background: 'linear-gradient(135deg, #000000 0%, #1e293b 100%)', borderRadius: '16px', padding: '4rem 2rem', textAlignment: 'center', color: '#ffffff', textAlign: 'center' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', fontWeight: '800' }}>Accelerate Your Tech Journey</h2>
            <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '0 auto 2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Want to see how these insights can be leveraged for your custom product? Speak to our software engineering architects today.
            </p>
            <Link to="/contact" className="btn-primary" style={{ textDecoration: 'none' }}>
              Contact Our Team <i className="fas fa-arrow-right" style={{ marginLeft: '6px' }}></i>
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetail;
