import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SkeletonGrid } from '../components/SkeletonLoader';
import Counter from '../components/Counter';
import {
  containerVariants,
  fadeUpVariants,
  slideFromLeft,
  slideFromRight,
  scaleIn,
  pageHeaderVariants,
  pageHeaderTitle,
  pageHeaderSubtitle,
  defaultViewport,
} from '../utils/animationVariants';
import './About.css';

const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23cbd5e1"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="24" fill="%23475569">User</text></svg>`;
const DEFAULT_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60"><rect width="200" height="60" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23475569">Logo</text></svg>`;

const getTestimonialImageUrl = (imagePath, isLogo = false) => {
  if (!imagePath) return isLogo ? DEFAULT_LOGO : DEFAULT_AVATAR;
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
  const apiBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${apiBase}${imagePath}`;
};

const coreValues = [
  { icon: 'fa-lightbulb', title: 'Innovation', desc: 'Pushing boundaries with creative solutions.' },
  { icon: 'fa-handshake', title: 'Integrity', desc: 'Building trust through honesty and transparency.' },
  { icon: 'fa-users', title: 'Collaboration', desc: 'Working together to achieve excellence.' },
  { icon: 'fa-star', title: 'Excellence', desc: 'Delivering quality in everything we do.' },
];

const teamMembers = [
  { name: 'John Doe', role: 'CEO & Founder' },
  { name: 'Jane Smith', role: 'CTO' },
  { name: 'Mike Johnson', role: 'Head of Consulting' },
];

const About = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
    window.scrollTo(0, 0);
  }, []);

  const fetchTestimonials = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/testimonials?active=true`);
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials on About page:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="about-page">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="about-page-header">
        <div className="container">
          <motion.div
            variants={pageHeaderVariants}
            initial="hidden"
            animate="visible"
            className="about-header-inner"
          >
            <motion.div variants={pageHeaderTitle} className="about-pre-pill-wrapper">
              <span className="about-pre-pill">WHO WE ARE</span>
            </motion.div>
            <motion.h1 variants={pageHeaderTitle}>
              About <span className="about-highlight">TDC.USA</span>
            </motion.h1>
            <motion.p variants={pageHeaderSubtitle} className="about-header-subtitle">
              Leading the way in technology and digital consulting since 2014.
            </motion.p>
          </motion.div>
        </div>
        <div className="about-header-orbs">
          <div className="about-orb about-orb-1" />
          <div className="about-orb about-orb-2" />
        </div>
      </div>

      {/* ── Mission & Vision ─────────────────────────────────────────────── */}
      <section className="about-mission">
        <div className="container">
          <div className="mission-grid">
            <motion.div
              className="mission-content"
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              <span className="mission-label">OUR PURPOSE</span>
              <h2>Our Mission</h2>
              <p>
                To empower businesses with innovative technology solutions that drive growth,
                efficiency, and competitive advantage in the digital economy.
              </p>
              <h2>Our Vision</h2>
              <p>
                To be the global leader in technology consulting, creating sustainable value for
                clients through digital transformation and strategic innovation.
              </p>
            </motion.div>

            <motion.div
              className="mission-image"
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              <div className="mission-stats">
                <motion.div
                  className="stat-item"
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                >
                  <h3><Counter value="2014" duration={1.5} /></h3>
                  <p>Founded</p>
                </motion.div>
                <motion.div
                  className="stat-item"
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                  transition={{ delay: 0.1 }}
                >
                  <h3><Counter value="50+" /></h3>
                  <p>Team Members</p>
                </motion.div>
                <motion.div
                  className="stat-item"
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                  transition={{ delay: 0.2 }}
                >
                  <h3><Counter value="20+" /></h3>
                  <p>Countries Served</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Core Values ──────────────────────────────────────────────────── */}
      <section className="about-values">
        <div className="container">
          <motion.div
            className="about-section-header"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <span className="about-pre-pill">OUR FOUNDATION</span>
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide every decision we make.</p>
          </motion.div>

          <motion.div
            className="values-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {coreValues.map((val, i) => (
              <motion.div
                key={val.title}
                className="value-card"
                variants={fadeUpVariants}
                whileHover={{ y: -8, boxShadow: '0 20px 45px rgba(0,0,0,0.08), 0 0 0 1px rgba(249,195,73,0.35)' }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <div className="value-icon-wrapper">
                  <i className={`fas ${val.icon}`}></i>
                </div>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Leadership Team ───────────────────────────────────────────────── */}
      <section className="about-team">
        <div className="container">
          <motion.div
            className="about-section-header"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <span className="about-pre-pill">THE PEOPLE</span>
            <h2 className="section-title">Leadership Team</h2>
            <p className="section-subtitle">Visionaries dedicated to shaping the future of technology.</p>
          </motion.div>

          <motion.div
            className="team-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                className="team-card"
                variants={i % 2 === 0 ? slideFromLeft : slideFromRight}
                whileHover={{ y: -8, boxShadow: '0 20px 45px rgba(0,0,0,0.08)' }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <div className="team-image">
                  <i className="fas fa-user-circle"></i>
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="about-testimonials">
        <div className="container">
          <motion.div
            className="about-section-header"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <span className="about-pre-pill">CLIENT LOVE</span>
            <h2 className="section-title text-center">Client Success Stories</h2>
            <p className="section-subtitle">What our partners say about working with TDC.USA.</p>
          </motion.div>

          {loading ? (
            <SkeletonGrid type="testimonial" count={3} />
          ) : (
            <motion.div
              className="testimonials-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              {testimonials.map((t, i) => (
                <motion.div
                  key={t._id}
                  className="testimonial-card"
                  variants={fadeUpVariants}
                  whileHover={{ y: -8, boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}
                >
                  <div className="testimonial-avatar-wrapper">
                    <img
                      src={getTestimonialImageUrl(t.profileImage)}
                      alt={t.clientName}
                      className="client-avatar"
                      onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                    />
                  </div>
                  <div className="rating-stars">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <i key={idx} className={`fas fa-star ${idx < t.rating ? 'active' : 'inactive'}`}></i>
                    ))}
                  </div>
                  <p className="testimonial-review">"{t.review}"</p>
                  <div className="testimonial-client-meta">
                    <h4>{t.clientName}</h4>
                    <p className="client-designation">{t.designation}</p>
                    <div className="client-company-row">
                      <span className="company-name">{t.companyName || t.company}</span>
                      {t.companyLogo && (
                        <img
                          src={getTestimonialImageUrl(t.companyLogo, true)}
                          alt={t.companyName || t.company}
                          className="company-logo-img"
                          onError={(e) => { e.target.src = DEFAULT_LOGO; }}
                        />
                      )}
                    </div>
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

export default About;