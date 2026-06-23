import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './CaseStudiesSection.css';

const CaseStudiesSection = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const navigate = useNavigate();

  // Parallax Scroll Offsets for cinematic feel
  const { scrollYProgress } = useScroll();
  const yParallax1 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const yParallax2 = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const yParallax3 = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const getParallaxValue = (index) => {
    if (index % 3 === 0) return yParallax1;
    if (index % 3 === 2) return yParallax3;
    return yParallax2;
  };

  useEffect(() => {
    fetchFeaturedCaseStudies();
  }, []);

  const fetchFeaturedCaseStudies = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/case-studies/featured`);
      if (response.ok) {
        const data = await response.json();
        setCaseStudies(data);
      }
    } catch (error) {
      console.error('Error fetching featured case studies:', error);
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

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveVideoUrl(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading || caseStudies.length === 0) return null;

  return (
    <section className="case-studies-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="section-header-center"
        >
          <div className="section-pre-pill-wrapper">
            <span className="section-pre-pill">CASE STUDIES</span>
          </div>
          <h2 className="section-title text-center">See How We Deliver <span className="highlight-case">Real Business Results</span></h2>
          <div className="section-title-underline-yellow"></div>
          <p className="section-subtitle text-center">
            Explore real projects, client success stories, and software solutions delivered by TDC.USA.
          </p>
        </motion.div>

        <motion.div 
          className="case-studies-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {caseStudies.map((study, index) => (
            <CaseStudyCard 
              key={study._id} 
              study={study} 
              getMediaUrl={getMediaUrl}
              onPlay={() => setActiveVideoUrl(getMediaUrl(study.video))}
              onClickDetails={() => navigate(`/case-studies/${study.slug}`)}
              parallaxY={getParallaxValue(index)}
            />
          ))}
        </motion.div>
      </div>

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
    </section>
  );
};

// Sub-component for individual card with hover video behaviors
const CaseStudyCard = ({ study, getMediaUrl, onPlay, onClickDetails, parallaxY }) => {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
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
    const card = cardRef.current;
    if (card) {
      card.style.setProperty('--rotate-x', '0deg');
      card.style.setProperty('--rotate-y', '0deg');
    }
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const rotateX = -(y - yc) / (rect.height / 10);
    const rotateY = (x - xc) / (rect.width / 10);
    
    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 90, damping: 14 }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="case-study-card"
      variants={cardVariants}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={onClickDetails}
      style={{ cursor: 'pointer', y: parallaxY }}
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

export default CaseStudiesSection;
