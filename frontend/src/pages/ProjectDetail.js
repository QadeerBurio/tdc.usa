import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { renderTechBadge } from '../utils/techIconMap';
import './ProjectDetail.css';

const DEFAULT_PROJECT_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%231e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="32" fill="%23f9c349">TDC.USA</text></svg>`;

const getImageUrl = (imagePath) => {
  if (!imagePath) return DEFAULT_PROJECT_IMAGE;
  if (imagePath.startsWith('http')) return imagePath;
  const apiBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${apiBase}${imagePath}`;
};

const handleImageError = (e) => {
  e.target.src = DEFAULT_PROJECT_IMAGE;
};

const getCategoryIcon = (category) => {
  const catLower = category?.toLowerCase() || '';
  if (catLower.includes('web') || catLower.includes('ecommerce')) {
    return 'fa-solid fa-cart-shopping';
  }
  if (catLower.includes('saas') || catLower.includes('analytics') || catLower.includes('dashboard')) {
    return 'fa-solid fa-chart-simple';
  }
  if (catLower.includes('mobile') || catLower.includes('fitness')) {
    return 'fa-solid fa-mobile-screen-button';
  }
  return 'fa-solid fa-laptop';
};

const ProjectDetail = () => {
  const { slug } = useParams(); // Holds the project _id
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjectDetails();
  }, [slug]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/projects`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects list');
      }
      const data = await response.json();
      
      // Find the specific project by id (slug parameter)
      const foundProject = data.find(p => p._id === slug);
      if (!foundProject) {
        throw new Error('Project not found');
      }
      setProject(foundProject);

      // Find related projects (same category, capped at 3, excluding current project)
      const filteredRelated = data
        .filter(p => p.category === foundProject.category && p._id !== foundProject._id)
        .slice(0, 3);
      setRelatedProjects(filteredRelated);

    } catch (err) {
      console.error('Error loading project details:', err);
      setError(err.message || 'Error loading project.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading project details...</div>;

  if (error || !project) {
    return (
      <div className="container error-container" style={{ padding: '6rem 20px', textAlign: 'center' }}>
        <h2>Error loading project</h2>
        <p style={{ margin: '1rem 0 2rem', color: '#666' }}>{error || 'The requested project could not be found.'}</p>
        <button onClick={() => navigate('/projects')} className="btn-primary">
          Back to Projects
        </button>
      </div>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 90, damping: 14 }
    }
  };

  return (
    <div className="project-detail-page">
      {/* Case Study Hero Section */}
      <section className="project-hero-section">
        <div className="container">
          <div className="project-hero-grid">
            <motion.div 
              className="project-hero-text"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="project-breadcrumb">
                <Link to="/projects">Projects</Link> <i className="fa-solid fa-chevron-right"></i> <span>Case Study</span>
              </div>
              <span className="case-study-pre">{project.category || 'CASE STUDY'}</span>
              <h1 className="project-title">{project.title}</h1>
              <p className="project-excerpt">{project.description}</p>
            </motion.div>
            
            <motion.div 
              className="project-hero-image"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <img 
                src={getImageUrl(project.image)} 
                alt={project.title} 
                onError={handleImageError}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Case Study Meta & Quick Facts */}
      <section className="project-meta-section">
        <div className="container">
          <motion.div 
            className="meta-info-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="meta-info-item">
              <span className="meta-info-label">CLIENT</span>
              <span className="meta-info-value">{project.client || 'Confidential Client'}</span>
            </div>
            <div className="meta-info-item">
              <span className="meta-info-label">INDUSTRY</span>
              <span className="meta-info-value">{project.industry || project.category || 'Technology'}</span>
            </div>
            <div className="meta-info-item">
              <span className="meta-info-label">DATE COMPLETED</span>
              <span className="meta-info-value">
                {project.completionDate ? new Date(project.completionDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long'
                }) : 'Ongoing'}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Case Study Content Blocks */}
      <section className="project-body-section">
        <div className="container">
          <div className="project-body-grid">
            <motion.div 
              className="project-body-main"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Overview Section */}
              <motion.div className="body-content-block" variants={itemVariants}>
                <h2>Project Overview</h2>
                <p>{project.description}</p>
              </motion.div>

              {/* Challenge Section */}
              {project.challenge && (
                <motion.div className="body-content-block challenge-block" variants={itemVariants}>
                  <div className="block-icon"><i className="fa-solid fa-triangle-exclamation"></i></div>
                  <div className="block-text">
                    <h2>The Challenge</h2>
                    <p>{project.challenge}</p>
                  </div>
                </motion.div>
              )}

              {/* Solution Section */}
              {project.solution && (
                <motion.div className="body-content-block solution-block" variants={itemVariants}>
                  <div className="block-icon"><i className="fa-solid fa-lightbulb"></i></div>
                  <div className="block-text">
                    <h2>Our Solution</h2>
                    <p>{project.solution}</p>
                  </div>
                </motion.div>
              )}

              {/* Results Section */}
              {project.results && (
                <motion.div className="body-content-block results-block" variants={itemVariants}>
                  <div className="block-icon"><i className="fa-solid fa-chart-line"></i></div>
                  <div className="block-text">
                    <h2>The Results</h2>
                    <p>{project.results}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              className="project-body-sidebar"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Tech stack sidebar */}
              <div className="sidebar-tech-card">
                <h3>Technologies Used</h3>
                <div className="sidebar-tech-list">
                  {project.technologies && project.technologies.length > 0 ? (
                    project.technologies.map(tech => renderTechBadge(tech))
                  ) : (
                    <span className="no-tech-info">Standard Tech Stack</span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Projects Section */}
      {relatedProjects.length > 0 && (
        <section className="related-projects-section">
          <div className="container">
            <h2 className="related-section-title">Related Projects</h2>
            <motion.div 
              className="related-projects-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {relatedProjects.map((rel) => (
                <motion.div 
                  key={rel._id} 
                  className="project-card"
                  variants={itemVariants}
                  onClick={() => navigate(`/projects/${rel._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="project-image-container">
                    <img 
                      src={getImageUrl(rel.image)} 
                      alt={rel.title}
                      onError={handleImageError}
                    />
                    <div className="project-category-overlay-icon">
                      <i className={getCategoryIcon(rel.category)}></i>
                    </div>
                    <div className="project-category-overlay-label">
                      {rel.category || 'WEB APPLICATION'}
                    </div>
                  </div>
                  <div className="project-content">
                    <h3>{rel.title}</h3>
                    <p>{rel.description}</p>
                    <div className="project-tech-badges">
                      {rel.technologies && rel.technologies.slice(0, 3).map(tech => renderTechBadge(tech))}
                    </div>
                    <div className="project-card-footer">
                      <span className="view-details-label">View Details &rarr;</span>
                      <div className="arrow-circle-button">
                        <i className="fa-solid fa-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact CTA banner */}
      <section className="project-detail-cta-section">
        <div className="container">
          <motion.div 
            className="cta-banner-box"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          >
            <h2>Interested in a similar project?</h2>
            <p>Let's collaborate to build something exceptional that elevates your business logic and engineering standards.</p>
            <motion.button 
              className="btn-secondary" 
              onClick={() => navigate('/contact')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Let's Talk &rarr;
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
