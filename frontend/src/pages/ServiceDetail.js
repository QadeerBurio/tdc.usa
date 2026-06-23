import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { servicesData } from '../data/servicesData';
import {
  containerVariants,
  fadeUpVariants,
  slideFromLeft,
  slideFromRight,
  defaultViewport,
} from '../utils/animationVariants';
import './ServiceDetail.css';

const ServiceDetail = () => {
  const { slug } = useParams();
  const [activeFaq, setActiveFaq] = useState(null);

  // Find the service by slug
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="service-detail-page">
      {/* Hero Section */}
      <section className="service-hero">
        <div className="container">
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <i className={service.icon}></i> {service.title}
          </motion.div>
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {service.title}
          </motion.h1>
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {service.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to={`/contact?job=${encodeURIComponent(service.title)}`} className="btn-primary">
              Request Quote <i className="fas fa-chevron-right"></i>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="service-overview">
        <div className="container">
          <div className="section-grid">
            <motion.div 
              className="overview-content"
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              <h2>Service Overview</h2>
              <p className="lead-text">{service.overview}</p>
            </motion.div>
            <motion.div 
              className="overview-accent-box"
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              whileHover={{ scale: 1.02 }}
            >
              <div className="accent-inner">
                <i className={service.icon}></i>
                <h3>Let's build together</h3>
                <p>Enterprise-grade consulting and delivery tailored to your growth strategy.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="service-benefits">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={defaultViewport}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Key Benefits</h2>
            <p className="section-subtitle">Why choose TDC.USA for your {service.title.toLowerCase()} needs.</p>
          </motion.div>
          
          <motion.div 
            className="benefits-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {service.benefits.map((benefit, index) => (
              <motion.div 
                key={index} 
                className="benefit-card"
                variants={fadeUpVariants}
                whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)' }}
              >
                <div className="benefit-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="benefit-content">
                  <p>{benefit}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="service-technologies">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={defaultViewport}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Technologies & Frameworks</h2>
            <p className="section-subtitle">We leverage state-of-the-art tools and technical stacks for optimal results.</p>
          </motion.div>
          
          <motion.div 
            className="tech-tags-container"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {service.technologies.map((tech, index) => (
              <motion.span 
                key={index} 
                className="tech-badge-large"
                variants={fadeUpVariants}
                whileHover={{ scale: 1.05, backgroundColor: '#f9c349', color: '#000000' }}
                transition={{ duration: 0.2 }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Development Process Section */}
      <section className="service-process">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={defaultViewport}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Development Process</h2>
            <p className="section-subtitle">Our systematic approach to delivering robust, scalable solutions.</p>
          </motion.div>

          <motion.div 
            className="process-timeline"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {service.process.map((step, index) => (
              <motion.div 
                key={index} 
                className="process-step"
                variants={fadeUpVariants}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <h3>{step}</h3>
                  <p>Phased validation guarantees that implementation matches architectural blueprints.</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="service-faqs">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">Common inquiries regarding our {service.title.toLowerCase()} process.</p>
            </motion.div>

            <div className="faq-accordion">
              {service.faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                >
                  <div className="faq-question" onClick={() => toggleFaq(index)}>
                    <h3>{faq.question}</h3>
                    <span className="faq-toggle-icon">
                      <i className={`fas ${activeFaq === index ? 'fa-minus' : 'fa-plus'}`}></i>
                    </span>
                  </div>
                  <div 
                    className="faq-answer"
                    style={{ 
                      maxHeight: activeFaq === index ? '200px' : '0',
                      padding: activeFaq === index ? '1.5rem' : '0 1.5rem',
                      borderTop: activeFaq === index ? '1px solid #e2e8f0' : 'none',
                      transition: 'all 0.3s ease-in-out'
                    }}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA Section */}
      <section className="service-cta">
        <div className="container">
          <motion.div 
            className="cta-container-vibrant"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2>Partner With Us Today</h2>
            <p>
              Ready to transform your ideas into production-ready software? Let's setup a consulting session with our engineering leads.
            </p>
            <Link to="/contact" className="btn-primary light">
              Get Started Today <i className="fas fa-arrow-right"></i>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
