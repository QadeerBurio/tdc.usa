import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section brand-column">
            <h3>TDC<span>.USA</span></h3>
            <p>
              Technology & Digital Consulting company transforming businesses
              through innovative solutions and strategic insights.
            </p>
            <div className="footer-contacts" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-map-marker-alt" style={{ color: '#E5B63E' }}></i> New York, USA
              </p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-phone" style={{ color: '#E5B63E' }}></i> +1 (555) 123-4567
              </p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-envelope" style={{ color: '#E5B63E' }}></i> info@tdc.usa
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Our Services</h4>
            <ul>
              <li><Link to="/services/custom-software-development">Custom Software</Link></li>
              <li><Link to="/services/web-development">Web Development</Link></li>
              <li><Link to="/services/cloud-solutions">Cloud Solutions</Link></li>
              <li><Link to="/services/ai-solutions">AI Solutions</Link></li>
              <li><Link to="/services/ui-ux-design">UI/UX Design</Link></li>
            </ul>
          </div>

          <div className="footer-section newsletter-section">
            <h4>Stay Connected</h4>
            <p>Subscribe to our newsletter for insights and technology updates.</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Your Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={status === 'loading'}
              />
              <motion.button 
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ scale: 1.03, backgroundColor: '#FFF7E0', color: '#000000', borderColor: '#E5B63E' }}
                whileTap={{ scale: 0.97 }}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </motion.button>
            </form>
            {message && (
              <div 
                className={`newsletter-status ${status}`} 
                style={{ 
                  marginTop: '0.8rem', 
                  fontSize: '0.85rem', 
                  color: status === 'success' ? '#10b981' : '#f87171',
                  fontWeight: '500'
                }}
              >
                {message}
              </div>
            )}
            <div className="social-links" style={{ marginTop: '1.5rem' }}>
              <motion.a href="#" aria-label="LinkedIn" whileHover={{ y: -3, scale: 1.1 }}><i className="fab fa-linkedin-in"></i></motion.a>
              <motion.a href="#" aria-label="Twitter" whileHover={{ y: -3, scale: 1.1 }}><i className="fab fa-twitter"></i></motion.a>
              <motion.a href="#" aria-label="Facebook" whileHover={{ y: -3, scale: 1.1 }}><i className="fab fa-facebook-f"></i></motion.a>
              <motion.a href="#" aria-label="YouTube" whileHover={{ y: -3, scale: 1.1 }}><i className="fab fa-youtube"></i></motion.a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TDC.USA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;