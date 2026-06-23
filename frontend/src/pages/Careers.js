import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SkeletonGrid } from '../components/SkeletonLoader';
import {
  containerVariants,
  fadeUpVariants,
  slideFromLeft,
  slideFromRight,
  pageHeaderVariants,
  pageHeaderTitle,
  pageHeaderSubtitle,
  defaultViewport,
} from '../utils/animationVariants';
import './Careers.css';

const perksData = [
  { icon: 'fa-rocket', label: 'Fast Growth' },
  { icon: 'fa-globe', label: 'Remote-Friendly' },
  { icon: 'fa-heart', label: 'Great Benefits' },
  { icon: 'fa-users', label: 'Strong Culture' },
];

// Alternating slide-in from left/right for job cards
const getJobVariant = (index) => (index % 2 === 0 ? slideFromLeft : slideFromRight);

const Careers = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    window.scrollTo(0, 0);
  }, []);

  const fetchJobs = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/jobs`);
      const data = await response.json();
      const openJobs = data.filter(job => job.activeJob !== false && (job.status || 'Open') === 'Open');
      setJobs(openJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="careers-page">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="careers-page-header">
        <div className="container">
          <motion.div
            variants={pageHeaderVariants}
            initial="hidden"
            animate="visible"
            className="careers-header-inner"
          >
            <motion.div variants={pageHeaderTitle} className="careers-pre-pill-wrapper">
              <span className="careers-pre-pill">JOIN THE TEAM</span>
            </motion.div>
            <motion.h1 variants={pageHeaderTitle}>
              Careers at <span className="careers-highlight">TDC.USA</span>
            </motion.h1>
            <motion.p variants={pageHeaderSubtitle} className="careers-header-subtitle">
              Join our team and be part of the digital transformation journey.
            </motion.p>
          </motion.div>

          {/* Perks bar */}
          <motion.div
            className="careers-perks-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {perksData.map((perk) => (
              <div key={perk.label} className="careers-perk-item">
                <i className={`fas ${perk.icon}`}></i>
                <span>{perk.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="careers-header-orbs">
          <div className="careers-orb careers-orb-1" />
          <div className="careers-orb careers-orb-2" />
        </div>
      </div>

      {/* ── Job Listings ─────────────────────────────────────────────────── */}
      <section className="careers-list">
        <div className="container">
          <motion.div
            className="careers-section-header"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <span className="careers-open-label">Open Positions</span>
            <h2>Find Your Next Opportunity</h2>
            <p>We're looking for talented people to join our growing team.</p>
          </motion.div>

          {loading ? (
            <SkeletonGrid type="career" count={3} />
          ) : jobs.length === 0 ? (
            <motion.div
              className="no-jobs"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <i className="fas fa-briefcase no-content-icon"></i>
              <h3>No Open Positions</h3>
              <p>Check back later for new opportunities.</p>
            </motion.div>
          ) : (
            <motion.div
              className="jobs-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              {jobs.map((job, i) => (
                <motion.div
                  key={job._id}
                  className="job-card"
                  variants={getJobVariant(i)}
                  onClick={() => navigate(`/careers/${job._id}`)}
                  style={{ cursor: 'pointer' }}
                  whileHover={{ y: -6, boxShadow: '0 20px 45px rgba(0,0,0,0.08), 0 0 0 1px rgba(249,195,73,0.3)' }}
                  transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                >
                  <div className="job-header">
                    <div className="job-title-group">
                      <h2>{job.title}</h2>
                      <div className="job-badges">
                        <span className={`job-type ${job.type?.toLowerCase().replace(' ', '-') || 'full-time'}`}>
                          {job.type}
                        </span>
                        <span className="job-dept-badge">{job.department}</span>
                      </div>
                    </div>
                    <div className="job-arrow-circle">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>

                  <div className="job-details">
                    <span className="job-detail-item">
                      <i className="fas fa-map-marker-alt"></i>
                      {job.location}
                    </span>
                    <span className="job-detail-item">
                      <i className="fas fa-briefcase"></i>
                      {job.experienceLevel || 'Mid-Level'}
                    </span>
                    {job.salary && (
                      <span className="job-detail-item">
                        <i className="fas fa-dollar-sign"></i>
                        {job.salary}
                      </span>
                    )}
                  </div>

                  <div className="job-description">
                    <p>{job.description}</p>
                  </div>

                  <div className="job-footer" onClick={(e) => e.stopPropagation()}>
                    <span className="job-posted">
                      <i className="fas fa-calendar-alt"></i>
                      Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <button
                      className="btn-primary job-apply-btn"
                      onClick={() => navigate(`/careers/${job._id}`)}
                    >
                      View Details <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Careers;