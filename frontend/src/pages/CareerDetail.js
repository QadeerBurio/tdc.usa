import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CareerDetail.css';

const CareerDetail = () => {
  const { slug } = useParams(); // Holds the job _id
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [slug]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/jobs/${slug}`);
      if (!response.ok) {
        throw new Error('Job opening not found');
      }
      const data = await response.json();
      setJob(data);
    } catch (err) {
      console.error('Error loading job details:', err);
      setError(err.message || 'Error loading job opening.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading job details...</div>;

  if (error || !job) {
    return (
      <div className="container error-container" style={{ padding: '6rem 20px', textAlign: 'center' }}>
        <h2>Error loading job opening</h2>
        <p style={{ margin: '1rem 0 2rem', color: '#666' }}>{error || 'The requested career opportunity could not be found.'}</p>
        <button onClick={() => navigate('/careers')} className="btn-primary">
          Back to Careers
        </button>
      </div>
    );
  }

  // Fallback benefits if none are stored in the database
  const jobBenefits = job.benefits
    ? (typeof job.benefits === 'string' ? job.benefits.split('\n').filter(b => b.trim()) : job.benefits)
    : [
      'Comprehensive health, dental, and vision insurance options.',
      '401(k) retirement plan with corporate matching contributions.',
      'Flexible remote-first work environment with home office stipends.',
      'Generous paid time off (PTO) and observed annual holidays.',
      'Ongoing learning budgets for professional courses and certifications.'
    ];

  return (
    <div className="career-detail-page">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <motion.div 
          className="breadcrumb"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/careers">Careers</Link> &gt; <span>{job.title}</span>
        </motion.div>
 
        <div className="career-layout">
          {/* Main Info */}
          <div className="career-main">
            <motion.div 
              className="career-header-card"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className={`type-badge ${job.type?.toLowerCase().replace(' ', '-') || 'full-time'}`}>
                {job.type || 'Full Time'}
              </span>
              <h1 className="job-title">{job.title}</h1>
              
              <div className="job-meta-badges">
                <span>
                  <i className="fas fa-building"></i> {job.department}
                </span>
                <span>
                  <i className="fas fa-map-marker-alt"></i> {job.location}
                </span>
                <span>
                  <i className="fas fa-clock"></i> {job.type || 'Full Time'}
                </span>
                <span>
                  <i className="fas fa-graduation-cap"></i> {job.experienceLevel || 'Mid-Level'}
                </span>
                {job.salary && (
                  <span>
                    <i className="fas fa-dollar-sign"></i> {job.salary}
                  </span>
                )}
                {job.applicationDeadline && (
                  <span>
                    <i className="fas fa-calendar-alt"></i> Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="job-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2>Role Description</h2>
              <p className="description-text">{job.description}</p>
            </motion.div>
 
            {job.responsibilities && job.responsibilities.length > 0 && (
              <motion.div 
                className="job-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2>Key Responsibilities</h2>
                <ul className="bullet-list">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </motion.div>
            )}
 
            {job.requirements && job.requirements.length > 0 && (
              <motion.div 
                className="job-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2>Role Requirements</h2>
                <ul className="bullet-list">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </motion.div>
            )}
 
            <motion.div 
              className="job-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2>Benefits & Perks</h2>
              <ul className="bullet-list benefits-list">
                {jobBenefits.map((benefit, index) => (
                  <li key={index}>
                    <i className="fas fa-gift"></i> {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
 
          {/* Sticky Sidebar CTA */}
          <div className="career-sidebar">
            <motion.div 
              className="cta-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3>Interested in this role?</h3>
              <p>Submit your details and apply today. Our recruitment team will review your application within 48 business hours.</p>
              
              <Link 
                to={`/careers/${slug}/apply`} 
                className="btn-primary block-btn"
                style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
              >
                Apply for this Position <i className="fas fa-paper-plane" style={{ marginLeft: '6px' }}></i>
              </Link>
 
              <span className="posted-date">
                Posted: {new Date(job.postedDate || job.createdAt).toLocaleDateString()}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerDetail;
