import React from 'react';
import { motion } from 'framer-motion';
import { servicesData } from '../data/servicesData';
import ServiceCard from '../components/ServiceCard';
import {
  containerVariants,
  fadeUpVariants,
  pageHeaderVariants,
  pageHeaderTitle,
  pageHeaderSubtitle,
  defaultViewport,
} from '../utils/animationVariants';
import './Services.css';

const Services = () => {
  const services = servicesData;

  return (
    <main className="services-page">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="services-page-header">
        <div className="container">
          <motion.div
            variants={pageHeaderVariants}
            initial="hidden"
            animate="visible"
            className="services-header-inner"
          >
            <motion.div variants={pageHeaderTitle} className="services-pre-pill-wrapper">
              <span className="services-pre-pill">WHAT WE DO</span>
            </motion.div>
            <motion.h1 variants={pageHeaderTitle}>
              Our <span className="services-highlight">Services</span>
            </motion.h1>
            <motion.p variants={pageHeaderSubtitle} className="services-header-subtitle">
              We provide comprehensive technology and digital consulting services
              to help your business succeed.
            </motion.p>
          </motion.div>
        </div>
        <div className="services-header-orbs">
          <div className="services-orb services-orb-1" />
          <div className="services-orb services-orb-2" />
        </div>
      </div>

      {/* ── Services Grid ─────────────────────────────────────────────────── */}
      <section className="services-list">
        <div className="container">
          <motion.div
            className="services-grid-responsive"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {services.map((service, index) => (
              <ServiceCard
                key={service.slug}
                service={service}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Services;