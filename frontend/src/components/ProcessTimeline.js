import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import './ProcessTimeline.css';

const ProcessTimeline = () => {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: 'Discovery',
      desc: 'Collaborative sessions to audit your goals, map stakeholders, and outline project parameters.',
      icon: 'fas fa-search-dollar'
    },
    {
      title: 'Planning',
      desc: 'Formulating strategic roadmaps, resource allocations, and systems architecture blueprints.',
      icon: 'fas fa-map'
    },
    {
      title: 'Design',
      desc: 'Pixel-perfect UI screens, interactive user journeys, and Figma wireframes validation.',
      icon: 'fas fa-bezier-curve'
    },
    {
      title: 'Development',
      desc: 'Writing clean, testable, and optimized code within agile iterative sprint structures.',
      icon: 'fas fa-code'
    },
    {
      title: 'Testing',
      desc: 'End-to-end QA validation, comprehensive security audits, load limits testing, and UAT.',
      icon: 'fas fa-vial'
    },
    {
      title: 'Launch',
      desc: 'Secure hosting migration, production release setup, and dedicated hypercare support.',
      icon: 'fas fa-rocket'
    }
  ];

  // Scroll tracking to fill timeline path gradually
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 75%"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  const heightPercent = useTransform(scaleY, [0, 1], ["0%", "100%"]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0.25, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 70, damping: 14 }
    }
  };

  return (
    <section className="timeline-section" ref={containerRef}>
      <div className="container">
        <div className="section-header-centered">
          <span className="section-pre-pill">METHODOLOGY</span>
          <h2 className="section-title text-center">Our Development Process</h2>
          <p className="section-subtitle text-center">
            A battle-tested phased delivery process designed to guarantee project success and software scalability.
          </p>
        </div>

        <motion.div 
          className="timeline-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-120px" }}
        >
          {/* Timeline progress line bar */}
          <div className="timeline-progress-bar">
            <motion.div className="timeline-progress-fill" style={{ height: heightPercent }} />
          </div>

          <div className="timeline-steps-grid">
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className={`timeline-step-card ${index % 2 === 0 ? 'even' : 'odd'} ${activeStep === index ? 'active' : ''}`}
                variants={stepVariants}
                viewport={{ once: false, amount: 0.6 }}
                onViewportEnter={() => setActiveStep(index)}
              >
                <div className="timeline-step-badge">
                  <span>0{index + 1}</span>
                </div>
                <motion.div 
                  className="timeline-step-icon-wrapper"
                  whileHover={{ scale: 1.2, rotate: 12 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 10 }}
                >
                  <i className={step.icon}></i>
                </motion.div>
                <div className="timeline-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
