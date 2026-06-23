import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { renderTechBadge } from '../utils/techIconMap';
import { SkeletonGrid } from '../components/SkeletonLoader';
import {
  containerVariants,
  fadeUpVariants,
  pageHeaderVariants,
  pageHeaderTitle,
  pageHeaderSubtitle,
  defaultViewport,
} from '../utils/animationVariants';
import './Projects.css';

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
  if (catLower.includes('web') || catLower.includes('ecommerce')) return 'fa-solid fa-cart-shopping';
  if (catLower.includes('saas') || catLower.includes('analytics') || catLower.includes('dashboard')) return 'fa-solid fa-chart-simple';
  if (catLower.includes('mobile') || catLower.includes('fitness')) return 'fa-solid fa-mobile-screen-button';
  return 'fa-solid fa-laptop';
};

// Each card gets a unique directional entrance based on its column position in a 3-col grid
const getProjectEntryVariant = (index) => {
  const col = index % 3;
  if (col === 0) return { hidden: { opacity: 0, x: -40, y: 20 }, visible: { opacity: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 80, damping: 14 } } };
  if (col === 1) return { hidden: { opacity: 0, y: 55, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 14 } } };
  return { hidden: { opacity: 0, x: 40, y: 20 }, visible: { opacity: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 80, damping: 14 } } };
};

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    window.scrollTo(0, 0);
  }, []);

  const fetchProjects = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="projects-page">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="projects-page-header">
        <div className="container">
          <motion.div
            variants={pageHeaderVariants}
            initial="hidden"
            animate="visible"
            className="projects-header-inner"
          >
            <motion.div variants={pageHeaderTitle} className="projects-pre-pill-wrapper">
              <span className="projects-pre-pill">OUR PORTFOLIO</span>
            </motion.div>
            <motion.h1 variants={pageHeaderTitle}>
              Our <span className="projects-highlight">Projects</span>
            </motion.h1>
            <div className="section-title-underline-yellow"></div>
            <motion.p variants={pageHeaderSubtitle} className="projects-header-subtitle">
              Explore our portfolio of successful projects and innovative solutions built to drive business transformation.
            </motion.p>
          </motion.div>
        </div>
        <div className="projects-header-orbs">
          <div className="projects-orb projects-orb-1" />
          <div className="projects-orb projects-orb-2" />
        </div>
      </div>

      {/* ── Projects Grid ─────────────────────────────────────────────────── */}
      <section className="projects-list">
        <div className="container">
          {loading ? (
            <SkeletonGrid type="project" count={6} />
          ) : (
            <motion.div
              className="projects-grid-full"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              {projects.length === 0 ? (
                <motion.p className="no-projects" variants={fadeUpVariants}>
                  No projects available yet.
                </motion.p>
              ) : (
                projects.map((project, i) => (
                  <motion.div
                    key={project._id}
                    className="project-card"
                    variants={getProjectEntryVariant(i)}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    style={{ cursor: 'pointer' }}
                    whileHover={{ y: -8, boxShadow: '0 24px 50px rgba(0,0,0,0.10), 0 0 0 1px rgba(249,195,73,0.3)' }}
                    transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                  >
                    <div className="project-image-container">
                      <img
                        src={getImageUrl(project.image)}
                        alt={project.title}
                        onError={handleImageError}
                      />
                      <div className="project-category-overlay-icon">
                        <i className={getCategoryIcon(project.category)}></i>
                      </div>
                      <div className="project-category-overlay-label">
                        {project.category || 'WEB APPLICATION'}
                      </div>
                    </div>
                    <div className="project-content">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="project-tech-badges">
                        {project.technologies && project.technologies.map(tech => renderTechBadge(tech))}
                      </div>
                      <div className="project-card-footer">
                        <span className="view-details-label">View Details &rarr;</span>
                        <div className="arrow-circle-button">
                          <i className="fa-solid fa-arrow-right"></i>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Projects;