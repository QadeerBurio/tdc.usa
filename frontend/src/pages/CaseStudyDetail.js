import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { renderTechBadge } from '../utils/techIconMap';
import './CaseStudyDetail.css';

const CaseStudyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [study, setStudy] = useState(null);
  const [relatedStudies, setRelatedStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);

  useEffect(() => {
    fetchCaseStudyData();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchCaseStudyData = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Fetch current study
      const res = await fetch(`${apiUrl}/case-studies/slug/${slug}`);
      if (!res.ok) {
        throw new Error('Case study not found');
      }
      const currentStudy = await res.json();
      setStudy(currentStudy);

      // Fetch all to get related
      const listRes = await fetch(`${apiUrl}/case-studies`);
      if (listRes.ok) {
        const allStudies = await listRes.json();
        // Filter by same industry, exclude current study
        const filtered = allStudies
          .filter(s => s.industry.toLowerCase() === currentStudy.industry.toLowerCase() && s._id !== currentStudy._id)
          .slice(0, 3);
        
        // If not enough related by industry, add others
        if (filtered.length < 3) {
          const extra = allStudies.filter(s => s._id !== currentStudy._id && !filtered.find(f => f._id === s._id));
          filtered.push(...extra.slice(0, 3 - filtered.length));
        }
        setRelatedStudies(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error(error);
      setStudy(null);
    } finally {
      setLoading(false);
    }
  };

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const apiBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${apiBase}${path}`;
  };

  if (loading) return <div className="detail-loading">Loading case study details...</div>;
  if (!study) {
    return (
      <div className="detail-error">
        <h2>Case Study Not Found</h2>
        <p>The case study you are looking for does not exist or has been removed.</p>
        <Link to="/case-studies" className="back-btn">&larr; Back to Case Studies</Link>
      </div>
    );
  }

  return (
    <div className="case-study-detail-page">
      {/* Detail Banner */}
      <section className="detail-hero">
        <div className="container">
          <div className="detail-hero-content">
            <span className="detail-industry">{study.industry}</span>
            <h1>{study.title}</h1>
            <p className="detail-lead">{study.description}</p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="detail-main-content">
        <div className="container">
          <div className="detail-grid">
            
            {/* Left Column: Video and Detailed Blocks */}
            <div className="detail-left-col">
              
              {/* Embedded Player */}
              <div className="detail-video-wrapper">
                <video 
                  src={getMediaUrl(study.video)} 
                  controls 
                  preload="metadata"
                  className="detail-video-player"
                />
              </div>

              {/* Challenge Segment */}
              {study.challenge && (
                <div className="content-block">
                  <h2>The Challenge</h2>
                  <div className="accent-bar"></div>
                  <p>{study.challenge}</p>
                </div>
              )}

              {/* Solution Segment */}
              {study.solution && (
                <div className="content-block">
                  <h2>The Solution</h2>
                  <div className="accent-bar"></div>
                  <p>{study.solution}</p>
                </div>
              )}

              {/* Results Segment */}
              {study.results && (
                <div className="content-block">
                  <h2>The Results</h2>
                  <div className="accent-bar"></div>
                  <p>{study.results}</p>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar metadata */}
            <div className="detail-right-col">
              <div className="sidebar-card">
                <h3>Project Metadata</h3>
                <div className="meta-item">
                  <span className="meta-label">Industry</span>
                  <span className="meta-value">{study.industry}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Client Partner</span>
                  <span className="meta-value">TDC.USA Partner</span>
                </div>
                
                {study.technologies && study.technologies.length > 0 && (
                  <div className="meta-technologies">
                    <h4>Technologies Used</h4>
                    <div className="tech-badges-container">
                      {study.technologies.map(tech => renderTechBadge(tech))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Case Studies Grid */}
      {relatedStudies.length > 0 && (
        <section className="related-section">
          <div className="container">
            <h2 className="related-title">Related Case Studies</h2>
            <div className="case-studies-grid-container">
              {relatedStudies.map((rel) => (
                <RelatedCard 
                  key={rel._id}
                  study={rel}
                  getMediaUrl={getMediaUrl}
                  onPlay={() => setActiveVideoUrl(getMediaUrl(rel.video))}
                  onClickDetails={() => navigate(`/case-studies/${rel.slug}`)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div 
            className="video-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideoUrl(null)}
          >
            <motion.div 
              className="video-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="video-modal-close" onClick={() => setActiveVideoUrl(null)}>
                <i className="fas fa-times"></i>
              </button>
              <video src={activeVideoUrl} controls autoPlay className="modal-video-element" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Call to Action */}
      <section className="detail-cta">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Transform Your Business?</h2>
            <p>Let's discuss how TDC.USA's engineering teams can deliver similar business impact for your organization.</p>
            <button className="btn-primary" onClick={() => navigate('/contact')}>
              Let's Connect
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Simple related card with video preview on hover
const RelatedCard = ({ study, getMediaUrl, onPlay, onClickDetails }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      className="case-study-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClickDetails}
      style={{ cursor: 'pointer' }}
    >
      <div className="case-study-media-wrapper">
        <video 
          ref={videoRef}
          src={getMediaUrl(study.video)}
          muted
          loop
          playsInline
          preload="metadata"
          className="case-study-video-preview"
        />
        <div className="video-overlay-gradient"></div>
        <div className="industry-badge-pill">{study.industry}</div>
        
        {/* Play Button Overlay */}
        <div className="play-button-overlay-container" onClick={(e) => { e.stopPropagation(); onPlay(); }}>
          <motion.div 
            className="play-button-pulse-ring"
            animate={isHovered ? { scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] } : {}}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
          <motion.button 
            className="play-button-circle"
            animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <i className="fas fa-play"></i>
          </motion.button>
        </div>
      </div>

      <div className="case-study-body">
        <h3 className="case-study-title">{study.title}</h3>
        <p className="case-study-desc">{study.description}</p>
        <button className="watch-case-study-btn" onClick={(e) => { e.stopPropagation(); onClickDetails(); }}>
          Watch Case Study <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default CaseStudyDetail;
