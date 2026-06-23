import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  slideFromLeft,
  slideFromRight,
  fadeUpVariants,
  pageHeaderVariants,
  pageHeaderTitle,
  pageHeaderSubtitle,
  defaultViewport,
} from '../utils/animationVariants';
import './Contact.css';

const contactInfoItems = [
  { icon: 'fa-map-marker-alt', label: 'Address', key: 'address' },
  { icon: 'fa-phone', label: 'Phone', key: 'phone' },
  { icon: 'fa-envelope', label: 'Email', key: 'email' },
  { icon: 'fa-clock', label: 'Working Hours', key: 'hours' },
];

const Contact = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/settings/public`);
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const jobParam = searchParams.get('job');
    if (jobParam) {
      setFormData(prev => ({
        ...prev,
        subject: `Application for: ${jobParam}`,
        message: `Dear Hiring Team,\n\nI am writing to express my interest in the "${jobParam}" position at TDC.USA. Please find my details attached below.\n\nBest regards,\n`,
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => navigate('/'), 3000);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMapSrc = () => {
    if (settings?.googleMapsUrl) {
      if (settings.googleMapsUrl.includes('/embed') || settings.googleMapsUrl.includes('embed?pb=')) {
        return settings.googleMapsUrl;
      }
      return `https://maps.google.com/maps?q=${encodeURIComponent(settings.googleMapsUrl)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    }
    if (settings) {
      const query = `${settings.address}, ${settings.city}, ${settings.state}, ${settings.country}`;
      return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    }
    return 'https://maps.google.com/maps?q=Times+Square,New+York,NY,USA&t=&z=13&ie=UTF8&iwloc=&output=embed';
  };

  return (
    <main className="contact-page">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="contact-page-header">
        <div className="container">
          <motion.div
            variants={pageHeaderVariants}
            initial="hidden"
            animate="visible"
            className="contact-header-inner"
          >
            <motion.div variants={pageHeaderTitle} className="contact-pre-pill-wrapper">
              <span className="contact-pre-pill">GET IN TOUCH</span>
            </motion.div>
            <motion.h1 variants={pageHeaderTitle}>
              Contact <span className="contact-highlight">Us</span>
            </motion.h1>
            <motion.p variants={pageHeaderSubtitle} className="contact-header-subtitle">
              Get in touch with us. We'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>
        <div className="contact-header-orbs">
          <div className="contact-orb contact-orb-1" />
          <div className="contact-orb contact-orb-2" />
        </div>
      </div>

      {/* ── Contact Section ───────────────────────────────────────────────── */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">

            {/* Info Panel */}
            <motion.div
              className="contact-info"
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              <span className="contact-info-label">REACH US</span>
              <h2>Get in Touch</h2>
              <p className="contact-info-desc">
                Have questions or want to discuss a project? We're ready to help.
              </p>

              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon-wrapper">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4>Address</h4>
                    <p style={{ lineHeight: '1.7' }}>
                      {settings ? (
                        <>
                          {settings.address}<br />
                          {settings.city}, {settings.state} {settings.postalCode}<br />
                          {settings.country}
                        </>
                      ) : 'New York, USA'}
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon-wrapper">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div>
                    <h4>Phone</h4>
                    <p>{settings ? settings.phone : '+1 (555) 123-4567'}</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon-wrapper">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4>Email</h4>
                    <p>
                      <a href={`mailto:${settings ? settings.email : 'info@tdc.usa'}`}>
                        {settings ? settings.email : 'info@tdc.usa'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon-wrapper">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h4>Working Hours</h4>
                    <p>Mon–Fri: 9:00 AM – 6:00 PM</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form Panel */}
            <motion.div
              className="contact-form-wrapper"
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    className="success-message"
                    key="success"
                    initial={{ scale: 0.88, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.88, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <div className="success-icon-ring">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <h3>Thank You!</h3>
                    <p>Your message has been sent. We'll get back to you soon.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="contact-form-header">
                      <h3>Send a Message</h3>
                      <p>Fill out the form and our team will respond promptly.</p>
                    </div>

                    {error && (
                      <motion.div
                        className="error-message"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <i className="fas fa-exclamation-circle"></i> {error}
                      </motion.div>
                    )}

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="subject">Subject *</label>
                        <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="How can we help?" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message *</label>
                      <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required placeholder="Tell us about your project or inquiry…"></textarea>
                    </div>

                    <button type="submit" className="btn-primary contact-submit-btn" disabled={loading}>
                      {loading ? (
                        <><i className="fas fa-spinner fa-spin"></i> Sending…</>
                      ) : (
                        <><i className="fas fa-paper-plane"></i> Send Message</>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── Office Map ──────────────────────────────────────────────── */}
          <motion.div
            className="contact-map-section"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <div className="contact-map-header">
              <span className="contact-map-label">OUR LOCATION</span>
              <h2>Visit Our Office</h2>
            </div>
            <div className="map-container">
              <iframe
                title="TDC.USA Office Map"
                src={getMapSrc()}
                width="100%"
                height="450"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Contact;