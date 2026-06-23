import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './StatsSection.css';

const Counter = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value, 10);
      if (isNaN(end) || start === end) {
        setCount(value);
        return;
      }

      const totalMiliseconds = duration;
      const stepTime = Math.max(Math.floor(totalMiliseconds / end), 12);
      
      const timer = setInterval(() => {
        start += Math.ceil(end / (duration / stepTime));
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setCount(start);
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
};

const StatsSection = () => {
  const stats = [
    { label: 'Projects Delivered', value: '150', suffix: '+' },
    { label: 'Enterprise Clients', value: '50', suffix: '+' },
    { label: 'Industries Served', value: '10', suffix: '+' },
    { label: 'Client Satisfaction', value: '99', suffix: '%' }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <section className="stats-section">
      <div className="container">
        <motion.div 
          className="stats-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, i) => (
            <motion.div key={i} className="stat-card" variants={itemVariants}>
              <div className="stat-value-container">
                <span className="stat-value">
                  <Counter value={stat.value} />
                </span>
                <span className="stat-suffix">{stat.suffix}</span>
              </div>
              <p className="stat-label">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
