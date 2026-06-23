import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './ServiceCard.css';

const ServiceCard = ({ service, index, parallaxY }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const rotateX = -(y - yc) / (rect.height / 8);
    const rotateY = (x - xc) / (rect.width / 8);
    
    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
  };

  // Layout-specific animation variants for staggered entrance
  const getCardVariants = () => {
    if (index === 0) {
      return {
        hidden: { opacity: 0, x: -100 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { type: 'spring', stiffness: 90, damping: 15 }
        }
      };
    }
    if (index === 1) {
      return {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { type: 'spring', stiffness: 90, damping: 15, delay: 0.1 }
        }
      };
    }
    if (index === 2) {
      return {
        hidden: { opacity: 0, x: 100 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { type: 'spring', stiffness: 90, damping: 15, delay: 0.2 }
        }
      };
    }
    return {
      hidden: { opacity: 0, y: 35 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 70, damping: 14, delay: index * 0.1 }
      }
    };
  };

  const cardVariants = getCardVariants();

  const handleCardClick = () => {
    navigate(`/services/${service.slug}`);
  };

  return (
    <motion.div
      ref={cardRef}
      className="premium-service-card"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover="hover"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{ y: parallaxY }}
    >
      {/* Subtle high-tech background pattern */}
      <div className="service-card-bg-graphic">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" preserveAspectRatio="none">
          <defs>
            <pattern id={`circuit-grid-${service.slug}`} width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#circuit-grid-${service.slug})`} opacity="0.08" />
          <path d="M 0 60 L 60 60 L 90 90 L 160 90 L 180 110 L 200 110" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
          <circle cx="60" cy="60" r="2.5" fill="currentColor" opacity="0.2" />
          <circle cx="90" cy="90" r="2.5" fill="currentColor" opacity="0.2" />
          <circle cx="160" cy="90" r="2.5" fill="currentColor" opacity="0.2" />
        </svg>
      </div>

      <div className="service-card-top">
        <motion.div 
          className="service-card-icon"
          variants={{
            hover: { scale: 1.15, rotate: 2 }
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <i className={service.icon || 'fas fa-cog'}></i>
        </motion.div>
        
        <h3 className="service-card-title">{service.title}</h3>
      </div>

      <p className="service-card-desc">{service.description}</p>

      {/* Tech stack highlights */}
      {service.technologies && service.technologies.length > 0 && (
        <div className="service-card-highlights">
          {service.technologies.slice(0, 3).map((tech, i) => (
            <div key={i} className="highlight-tag">
              <span className="highlight-check">✓</span>
              <span className="highlight-text">{tech}</span>
            </div>
          ))}
        </div>
      )}

      <div className="service-card-footer">
        <span className="service-learn-more">
          Learn More
          <motion.span 
            className="learn-more-arrow"
            variants={{
              hover: { x: 6 }
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            →
          </motion.span>
        </span>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
