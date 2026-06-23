import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SkeletonGrid } from '../components/SkeletonLoader';
import {
  containerVariants,
  fadeUpVariants,
  pageHeaderVariants,
  pageHeaderTitle,
  pageHeaderSubtitle,
  defaultViewport,
} from '../utils/animationVariants';
import './Blogs.css';

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

// Each blog card gets a unique directional entrance based on its grid position
const getBlogCardVariant = (index) => {
  const col = index % 3;
  if (col === 0) return { hidden: { opacity: 0, x: -40, y: 20 }, visible: { opacity: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 85, damping: 14 } } };
  if (col === 1) return { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 85, damping: 14 } } };
  return { hidden: { opacity: 0, x: 40, y: 20 }, visible: { opacity: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 85, damping: 14 } } };
};

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
    window.scrollTo(0, 0);
  }, []);

  const fetchBlogs = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/blogs`);
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="blogs-page">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="blogs-page-header">
        <div className="container">
          <motion.div
            variants={pageHeaderVariants}
            initial="hidden"
            animate="visible"
            className="blogs-header-inner"
          >
            <motion.div variants={pageHeaderTitle} className="blogs-pre-pill-wrapper">
              <span className="blogs-pre-pill">INSIGHTS & IDEAS</span>
            </motion.div>
            <motion.h1 variants={pageHeaderTitle}>
              Our <span className="blogs-highlight">Blog</span>
            </motion.h1>
            <motion.p variants={pageHeaderSubtitle} className="blogs-header-subtitle">
              Insights, updates, and thought leadership from the TDC.USA team.
            </motion.p>
          </motion.div>
        </div>
        <div className="blogs-header-orbs">
          <div className="blogs-orb blogs-orb-1" />
          <div className="blogs-orb blogs-orb-2" />
        </div>
      </div>

      {/* ── Blog Grid ────────────────────────────────────────────────────── */}
      <section className="blogs-list">
        <div className="container">
          {loading ? (
            <SkeletonGrid type="blog" count={3} />
          ) : blogs.length === 0 ? (
            <motion.div
              className="no-blogs"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <i className="fas fa-pen-nib no-content-icon"></i>
              <h3>No Blog Posts Yet</h3>
              <p>Check back soon for new content.</p>
            </motion.div>
          ) : (
            <motion.div
              className="blogs-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              {blogs.map((blog, i) => (
                <motion.article
                  key={blog._id}
                  className="blog-card"
                  variants={getBlogCardVariant(i)}
                  whileHover={{ y: -8, boxShadow: '0 24px 50px rgba(0,0,0,0.10), 0 0 0 1px rgba(249,195,73,0.3)' }}
                  onClick={() => navigate(`/blogs/${blog.slug || blog._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="blog-image">
                    <img
                      src={getImageUrl(blog.featuredImage || blog.image)}
                      alt={blog.title}
                      onError={handleImageError}
                    />
                    <span className="blog-category-badge">{blog.category}</span>
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">
                        <i className="fas fa-calendar-alt"></i>
                        {new Date(blog.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="blog-read-time">
                        <i className="fas fa-clock"></i>
                        {blog.readTime || '5 min read'}
                      </span>
                    </div>
                    <h2>{blog.title}</h2>
                    <p className="blog-excerpt">{blog.excerpt}</p>
                    <div className="blog-footer" onClick={(e) => e.stopPropagation()}>
                      <span className="blog-author">
                        <i className="fas fa-user"></i>
                        {blog.author}
                      </span>
                      <Link
                        to={`/blogs/${blog.slug || blog._id}`}
                        className="read-more-link"
                      >
                        Read Article <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Blogs;