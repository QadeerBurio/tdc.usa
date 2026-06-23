import React, { useState, useEffect } from 'react';
import './ScrollToTop.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle visibility
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Scroll Progress Bar at the top of the viewport */}
      <div 
        className="scroll-progress-line" 
        style={{ width: `${scrollProgress}%` }}
      />
      
      {/* Floating scroll to top button */}
      <div 
        className={`scroll-to-top-btn ${isVisible ? 'visible' : ''}`} 
        onClick={scrollToTop}
        title="Scroll to top"
      >
        <svg className="progress-ring" width="46" height="46">
          <circle
            className="progress-ring-circle"
            stroke="var(--primary-yellow)"
            strokeWidth="3"
            fill="transparent"
            r="20"
            cx="23"
            cy="23"
            style={{
              strokeDasharray: `${2 * Math.PI * 20}`,
              strokeDashoffset: `${2 * Math.PI * 20 - (scrollProgress / 100) * (2 * Math.PI * 20)}`
            }}
          />
        </svg>
        <div className="arrow-inner">
          <i className="fa-solid fa-arrow-up"></i>
        </div>
      </div>
    </>
  );
};

export default ScrollToTop;
