import React from 'react';
import { motion } from 'framer-motion';
import './TrustedBySection.css';

// Automatically import all logos from the assets folder using require.context
const importAllLogos = () => {
  try {
    const context = require.context('../assets/logos', false, /\.(png|jpe?g|svg|webp)$/);
    return context.keys().map(context);
  } catch (error) {
    console.error('Error importing logos dynamically:', error);
    return [];
  }
};

const TrustedBySection = () => {
  const logos = importAllLogos();
  
  if (logos.length === 0) return null;

  // Split logos into two rows
  const midPoint = Math.ceil(logos.length / 2);
  const row1Logos = logos.slice(0, midPoint);
  const row2Logos = logos.slice(midPoint);

  // Repeat logo arrays to ensure seamless infinite marquee looping
  const row1Items = [...row1Logos, ...row1Logos, ...row1Logos, ...row1Logos];
  const row2Items = [...row2Logos, ...row2Logos, ...row2Logos, ...row2Logos];

  return (
    <section className="trusted-by-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="section-header-center"
        >
          <div className="section-pre-pill-wrapper">
            <span className="section-pre-pill">TRUSTED BY INDUSTRY LEADERS</span>
          </div>
          <h2 className="section-title text-center">Trusted By Leading Brands</h2>
          <p className="section-subtitle text-center">
            Organizations and businesses that trust TDC.USA to deliver digital transformation, software solutions, and technology innovation.
          </p>
        </motion.div>

        <div className="logo-marquee-container">
          {/* Row 1 - Moves Left */}
          <div className="logo-marquee-row row-left">
            <div className="logo-marquee-track">
              {row1Items.map((logoUrl, index) => (
                <div key={`logo-r1-${index}`} className="logo-wrapper-minimal">
                  <img src={logoUrl} alt="Partner Logo" className="partner-logo-img" />
                </div>
              ))}
            </div>
          </div>

          {/* Glowing separation line */}
          <div className="marquee-glow-separator"></div>

          {/* Row 2 - Moves Right */}
          <div className="logo-marquee-row row-right">
            <div className="logo-marquee-track">
              {row2Items.map((logoUrl, index) => (
                <div key={`logo-r2-${index}`} className="logo-wrapper-minimal">
                  <img src={logoUrl} alt="Partner Logo" className="partner-logo-img" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
