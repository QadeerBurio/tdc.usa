import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  containerVariants,
  pageHeaderVariants,
  pageHeaderTitle,
  pageHeaderSubtitle,
  defaultViewport,
} from '../utils/animationVariants';
import './CaseStudies.css';

// Tri-directional entrance for case study cards
const getCaseStudyVariant = (index) => {
  const col = index % 3;
  if (col === 0) return { hidden: { opacity: 0, x: -45, y: 15 }, visible: { opacity: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 80, damping: 14 } } };
  if (col === 1) return { hidden: { opacity: 0, y: 55, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 14 } } };
  return { hidden: { opacity: 0, x: 45, y: 15 }, visible: { opacity: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 80, damping: 14 } } };
};

const CaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCaseStudies();
    window.scrollTo(0, 0);
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/case-studies`);
      if (response.ok) {
        const data = await response.json();
        setCaseStudies(data);
      }
    } catch (error) {
      console.error('Error fetching case studies:', error);
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

  // Escape key support to close video modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveVideoUrl(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="case-studies-page">

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <section className="case-studies-hero">
        <div className="container">
          <motion.div
            variants={pageHeaderVariants}
            initial="hidden"
            animate="visible"
            className="hero-text-content"
          >
            <motion.div variants={pageHeaderTitle} className="cs-pre-pill-wrapper">
              <span className="cs-pre-pill">SUCCESS STORIES</span>
            </motion.div>
            <motion.h1 variants={pageHeaderTitle}>
              Client <span className="cs-highlight">Success</span> Stories
            </motion.h1>
            <motion.p variants={pageHeaderSubtitle}>
              Discover how TDC.USA empowers businesses around the globe to scale and
              optimize operations through premium technology solutions.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Main Grid Section ─────────────────────────────────────────────── */}
      <section className="case-studies-grid-section">
        <div className="container">
          {loading ? (
            <div className="loading-spinner">Loading case studies…</div>
          ) : (
            <>
              {caseStudies.length === 0 ? (
                <div className="empty-message">No case studies available at the moment. Please check back later!</div>
              ) : (
                <motion.div
                  className="case-studies-grid-container"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                >
                  {caseStudies.map((study, i) => (
                    <CaseStudyCard
                      key={study._id}
                      study={study}
                      index={i}
                      getMediaUrl={getMediaUrl}
                      onPlay={() => setActiveVideoUrl(getMediaUrl(study.video))}
                      onClickDetails={() => navigate(`/case-studies/${study.slug}`)}
                    />
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Fullscreen Video Modal ────────────────────────────────────────── */}
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
    </div>
  );
};

// ── Card Sub-component ────────────────────────────────────────────────────────
const CaseStudyCard = ({ study, index, getMediaUrl, onPlay, onClickDetails }) => {
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
    <motion.div
      className="case-study-card"
      variants={getCaseStudyVariant(index)}
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
    </motion.div>
  );
};

export default CaseStudies;
