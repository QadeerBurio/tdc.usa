import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { getTechIcon } from '../utils/techIconMap';
import './Hero.css';

const rotatingWords = [
  "→ Custom Software",
  "→ AI Solutions",
  "→ Mobile Applications",
  "→ Cloud Platforms",
  "→ Enterprise Systems"
];

const fallbackProject = {
  _id: 'featured-fallback',
  title: 'Enterprise SaaS Analytics',
  category: 'Cloud Platform',
  description: 'High-performance cloud intelligence mapping system that analyzes real-time log telemetry and generates predictive insights.',
  technologies: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
  image: ''
};

const Hero = () => {
  const navigate = useNavigate();
  const [wordIndex, setWordIndex] = useState(0);
  const [project, setProject] = useState(fallbackProject);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%231e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="%23E5B63E">TDC.USA</text></svg>`;
    if (imagePath.startsWith('http')) return imagePath;
    const apiBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${apiBase}${imagePath}`;
  };

  // Parallax motion tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 25, stiffness: 120 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 120 });

  // Perspective transformations for the featured project card
  const cardX = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const cardY = useTransform(springY, [-0.5, 0.5], [-12, 12]);
  const cardRotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const cardRotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const cardBaseRotate = -3.5; // Base offset angle for premium styling

  // Parallax displacement for floating pills
  const fp1X = useTransform(springX, [-0.5, 0.5], [-22, 22]);
  const fp1Y = useTransform(springY, [-0.5, 0.5], [-22, 22]);

  const fp2X = useTransform(springX, [-0.5, 0.5], [30, -30]);
  const fp2Y = useTransform(springY, [-0.5, 0.5], [-18, 18]);

  const fp3X = useTransform(springX, [-0.5, 0.5], [-26, 26]);
  const fp3Y = useTransform(springY, [-0.5, 0.5], [26, -26]);

  const fp4X = useTransform(springX, [-0.5, 0.5], [22, -22]);
  const fp4Y = useTransform(springY, [-0.5, 0.5], [22, -22]);

  const fp5X = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const fp5Y = useTransform(springY, [-0.5, 0.5], [-30, 30]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    mouseX.set((clientX / width) - 0.5);
    mouseY.set((clientY / height) - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(wordTimer);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/projects/featured`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setProject(data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching featured project for hero:', err);
      }
    };
    fetchFeatured();
  }, []);

  // Heading Stagger Variants
  const headingContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 90, damping: 14 }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const descVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }
    }
  };

  const ctasVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }
    }
  };

  // Staggered trust indicators
  const trustContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.55
      }
    }
  };

  const trustItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  // Card entrance animation
  const cardEntranceVariants = {
    hidden: { opacity: 0, scale: 0.94, y: 25 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
    }
  };

  const techStack = ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Azure', 'Docker'];

  return (
    <section 
      className="hero-section-premium"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background grids and shapes */}
      <div className="hero-digital-grid"></div>
      <div className="hero-radial-spotlight"></div>
      <div className="hero-particles">
        <div className="hero-particle gold-blur-1"></div>
        <div className="hero-particle gold-blur-2"></div>
      </div>

      <div className="container">
        <div className="hero-grid-premium">
          {/* Left Column */}
          <div className="hero-left-col">
            <motion.div 
              className="hero-badge-premium" 
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
            >
              <span className="badge-bullet"></span>
              <span>✓ ENTERPRISE READY TECHNOLOGY</span>
            </motion.div>

            <motion.div 
              className="hero-headline-wrapper"
              variants={headingContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="hero-title-premium">
                <motion.span style={{ display: 'inline-block' }} variants={wordVariants}>We</motion.span>{' '}
                <motion.span style={{ display: 'inline-block' }} variants={wordVariants}>Build</motion.span> <br />
                <span className="rotating-text-span">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="rotating-word"
                    >
                      {rotatingWords[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <br />
                <motion.span style={{ display: 'inline-block' }} variants={wordVariants}>Digital</motion.span>{' '}
                <motion.span style={{ display: 'inline-block' }} variants={wordVariants}>Solutions</motion.span>
              </h1>
            </motion.div>

            <motion.p 
              className="hero-subheading-premium"
              variants={descVariants}
              initial="hidden"
              animate="visible"
            >
              Custom software, web, mobile, cloud, and AI solutions that help businesses scale faster and operate smarter.
            </motion.p>

            <motion.div 
              className="hero-ctas-premium"
              variants={ctasVariants}
              initial="hidden"
              animate="visible"
            >
              <button className="hero-btn-primary" onClick={() => navigate('/contact')}>
                Start a Project <span className="cta-arrow">&rarr;</span>
              </button>
              <button className="hero-btn-secondary" onClick={() => navigate('/projects')}>
                View Our Work
              </button>
            </motion.div>

            <motion.div 
              className="hero-trust-indicators"
              variants={trustContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="trust-indicator-item" variants={trustItemVariants}>
                <i className="fa-solid fa-circle-check"></i> Enterprise Ready
              </motion.div>
              <motion.div className="trust-indicator-item" variants={trustItemVariants}>
                <i className="fa-solid fa-circle-check"></i> Modern & Scalable
              </motion.div>
              <motion.div className="trust-indicator-item" variants={trustItemVariants}>
                <i className="fa-solid fa-circle-check"></i> End-to-End Dev
              </motion.div>
              <motion.div className="trust-indicator-item" variants={trustItemVariants}>
                <i className="fa-solid fa-circle-check"></i> Agile & Transparent
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="hero-right-col" style={{ perspective: 1000 }}>
            <div className="hero-card-wrapper-float">
              <motion.div 
                className="featured-project-hero-card"
                variants={cardEntranceVariants}
                initial="hidden"
                animate="visible"
                style={{
                  x: cardX,
                  y: cardY,
                  rotateX: cardRotateX,
                  rotateY: cardRotateY,
                  rotateZ: cardBaseRotate,
                  transformStyle: "preserve-3d"
                }}
              >
                <div className="hero-card-img-wrapper" style={{ transform: "translateZ(30px)" }}>
                  <img src={getImageUrl(project.image)} alt={project.title} />
                  <span className="hero-card-category-badge">{project.category || 'FEATURED WORK'}</span>
                </div>
                <div className="hero-card-body" style={{ transform: "translateZ(20px)" }}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="hero-card-techs">
                    {project.technologies && project.technologies.slice(0, 4).map(tech => (
                      <span key={tech} className="hero-card-tech-badge">
                        {getTechIcon(tech) && <span className="hero-card-tech-icon">{getTechIcon(tech)}</span>}
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button className="hero-card-view-btn" onClick={() => navigate(`/projects/${project._id}`)}>
                    View Project &rarr;
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Floating Service Pills */}
            <div className="floating-pills-container">
              <motion.div className="floating-pill fp-1" style={{ x: fp1X, y: fp1Y }}>Web Development</motion.div>
              <motion.div className="floating-pill fp-2" style={{ x: fp2X, y: fp2Y }}>AI Solutions</motion.div>
              <motion.div className="floating-pill fp-3" style={{ x: fp3X, y: fp3Y }}>Mobile Apps</motion.div>
              <motion.div className="floating-pill fp-4" style={{ x: fp4X, y: fp4Y }}>Cloud Solutions</motion.div>
              <motion.div className="floating-pill fp-5" style={{ x: fp5X, y: fp5Y }}>UI/UX Design</motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Horizontal Marquee */}
      <div className="hero-tech-stack-marquee-bar">
        <div className="marquee-bar-inner">
          <div className="marquee-bar-track">
            {/* Display tech list twice for continuous scrolling */}
            {[...techStack, ...techStack, ...techStack, ...techStack].map((tech, idx) => (
              <div key={`${tech}-${idx}`} className="marquee-tech-item">
                <span className="marquee-tech-icon">{getTechIcon(tech)}</span>
                <span className="marquee-tech-name">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;