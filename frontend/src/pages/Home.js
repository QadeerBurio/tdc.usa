import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import Hero from '../components/Hero';
import { servicesData } from '../data/servicesData';
import { renderTechBadge } from '../utils/techIconMap';
import { SkeletonGrid } from '../components/SkeletonLoader';
import ServiceCard from '../components/ServiceCard';
import ProcessTimeline from '../components/ProcessTimeline';
import CaseStudiesSection from '../components/CaseStudiesSection';
import TrustedBySection from '../components/TrustedBySection';
import './Home.css';

const DEFAULT_BLOG_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%231e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="32" fill="%23f9c349">TDC.USA</text></svg>`;

const getImageUrl = (imagePath) => {
  if (!imagePath) return DEFAULT_BLOG_IMAGE;
  if (imagePath.startsWith('http')) return imagePath;
  const apiBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${apiBase}${imagePath}`;
};

const handleImageError = (e) => {
  e.target.src = DEFAULT_BLOG_IMAGE;
};

const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23cbd5e1"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="24" fill="%23475569">User</text></svg>`;
const DEFAULT_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60"><rect width="200" height="60" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23475569">Logo</text></svg>`;

const getTestimonialImageUrl = (imagePath, isLogo = false) => {
  if (!imagePath) return isLogo ? DEFAULT_LOGO : DEFAULT_AVATAR;
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
  const apiBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${apiBase}${imagePath}`;
};

const getCategoryIcon = (category) => {
  const catLower = category?.toLowerCase() || '';
  if (catLower.includes('web development') || catLower === 'web development') {
    return 'fa-solid fa-globe';
  }
  if (catLower.includes('mobile application') || catLower.includes('mobile app')) {
    return 'fa-solid fa-mobile-screen-button';
  }
  if (catLower.includes('saas platform') || catLower.includes('saas')) {
    return 'fa-solid fa-layer-group';
  }
  if (catLower.includes('ai solution') || catLower.includes('ai ') || catLower.includes('artificial intelligence')) {
    return 'fa-solid fa-brain';
  }
  if (catLower.includes('cloud solution') || catLower.includes('cloud')) {
    return 'fa-solid fa-cloud';
  }
  if (catLower.includes('e-commerce') || catLower.includes('ecommerce')) {
    return 'fa-solid fa-cart-shopping';
  }
  if (catLower.includes('healthcare') || catLower.includes('medical')) {
    return 'fa-solid fa-heart';
  }
  if (catLower.includes('fintech') || catLower.includes('finance') || catLower.includes('payment')) {
    return 'fa-solid fa-wallet';
  }
  return null; // fallback: do not display any icon
};

const Home = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const whySectionRef = useRef(null);

  const { scrollYProgress: whyScrollProgress } = useScroll({
    target: whySectionRef,
    offset: ["start 65%", "end 60%"]
  });
  const whyLineScale = useSpring(whyScrollProgress, { stiffness: 85, damping: 25 });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto slide effect for testimonials carousel
  useEffect(() => {
    if (testimonials.length === 0 || isTestimonialHovered) return;
    const interval = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials, isTestimonialHovered]);

  // Parallax Scroll Offsets for creating depth
  const { scrollYProgress } = useScroll();
  const yParallax1 = useTransform(scrollYProgress, [0, 1], [-45, 45]);
  const yParallax2 = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const yParallax3 = useTransform(scrollYProgress, [0, 1], [45, -45]);

  const getParallaxValue = (index) => {
    if (index === 0) return yParallax1;
    if (index === 2) return yParallax3;
    return yParallax2;
  };

  // Take the 3 specified featured services
  const featuredSlugs = ['web-development', 'mobile-app-development', 'cloud-solutions'];
  const featuredServices = featuredSlugs
    .map(slug => servicesData.find(s => s.slug === slug))
    .filter(Boolean);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

      const [projectsRes, blogsRes, jobsRes, testimonialsRes] = await Promise.all([
        fetch(`${apiUrl}/projects/featured`),
        fetch(`${apiUrl}/blogs`),
        fetch(`${apiUrl}/jobs/featured`),
        fetch(`${apiUrl}/testimonials?featured=true`)
      ]);

      const projectsData = await projectsRes.json();
      const blogsData = await blogsRes.json();
      const jobsData = await jobsRes.json();
      const testimonialsData = await testimonialsRes.json();

      setProjects(projectsData);
      setTestimonials(testimonialsData.slice(0, 3));
      // Show only 3 featured blogs. If fewer than 3 exist, fall back to latest published blogs
      let featuredBlogs = blogsData.filter(b => b.featured === true);
      if (featuredBlogs.length < 3) {
        const nonFeatured = blogsData.filter(b => b.featured !== true);
        featuredBlogs = [...featuredBlogs, ...nonFeatured].slice(0, 3);
      }
      setBlogs(featuredBlogs);
      setJobs(jobsData.slice(0, 3));
    } catch (error) {
      console.error('Error fetching home page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    const rotateX = -(y - yc) / (rect.height / 10);
    const rotateY = (x - xc) / (rect.width / 10);

    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
  };

  // Stagger variants for list containers
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  // Slide/Fade variants for individual cards
  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 90, damping: 14 }
    }
  };

  const whyIconVariants = {
    hidden: { scale: 0, rotate: -45, filter: 'drop-shadow(0 0 0px rgba(249, 195, 73, 0))' },
    visible: {
      scale: 1,
      rotate: 0,
      filter: 'drop-shadow(0 0 8px rgba(249, 195, 73, 0.35))',
      transition: { type: 'spring', stiffness: 120, damping: 12, delay: 0.15 }
    },
    hovered: {
      scale: 1.15,
      rotate: 6,
      filter: 'drop-shadow(0 0 15px rgba(249, 195, 73, 0.6))',
      transition: { type: 'spring', stiffness: 200, damping: 10 }
    }
  };

  const slideFromLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 85, damping: 14 }
    }
  };

  const slideFromRight = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 85, damping: 14 }
    }
  };

  const getProjectVariants = (index) => {
    if (index === 0) {
      return {
        hidden: { opacity: 0, x: -75 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { type: 'spring', stiffness: 70, damping: 14 }
        }
      };
    }
    if (index === 1) {
      return {
        hidden: { opacity: 0, scale: 0.9, y: 25 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { type: 'spring', stiffness: 70, damping: 14 }
        }
      };
    }
    if (index === 2) {
      return {
        hidden: { opacity: 0, x: 75 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { type: 'spring', stiffness: 70, damping: 14 }
        }
      };
    }
    return itemVariants;
  };

  const getIndustryVariants = (index) => {
    if (index < 3) {
      return {
        hidden: { opacity: 0, x: -50 },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            type: 'spring',
            stiffness: 85,
            damping: 14,
            delay: index * 0.15
          }
        }
      };
    } else {
      const bottomDelay = 0.45 + (5 - index) * 0.15;
      return {
        hidden: { opacity: 0, x: 50 },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            type: 'spring',
            stiffness: 85,
            damping: 14,
            delay: bottomDelay
          }
        }
      };
    }
  };

  return (
    <div className="home-container">
      <Hero />


      {/* Services Preview Section */}
      <section className="services-preview">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title text-center">Featured Services</h2>
            <p className="section-subtitle text-center">
              Comprehensive technology and digital solutions tailored to your business needs.
            </p>
          </motion.div>
          <motion.div
            className="services-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {featuredServices.map((service, index) => (
              <ServiceCard
                key={service.slug}
                service={service}
                index={index}
                parallaxY={getParallaxValue(index)}
              />
            ))}
          </motion.div>
          <div className="text-center section-action">
            <button
              className="btn-secondary view-all-btn"
              onClick={() => navigate('/services')}
            >
              View All Services &rarr;
            </button>
          </div>
        </div>
      </section>

      <ProcessTimeline />

      {/* Featured Projects Section */}
      <section className="featured-projects">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-pre-pill-wrapper">
              <span className="section-pre-pill">OUR WORK</span>
            </div>
            <h2 className="section-title text-center">Featured <span className="highlight-projects">Projects</span></h2>
            <div className="section-title-underline-yellow"></div>
            <p className="section-subtitle text-center">
              Explore some of our recent successful projects that deliver real results and create impact.
            </p>
          </motion.div>

          {loading ? (
            <SkeletonGrid type="project" count={3} />
          ) : (
            <motion.div
              className="projects-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {projects.slice(0, 3).map((project, index) => (
                <motion.div
                  key={project._id}
                  className="project-card"
                  variants={getProjectVariants(index)}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  style={{ cursor: 'pointer', y: getParallaxValue(index) }}
                >
                  <div className="project-image-container">
                    <img
                      src={getImageUrl(project.image)}
                      alt={project.title}
                      onError={handleImageError}
                    />
                    {getCategoryIcon(project.category) && (
                      <div className="project-category-overlay-icon">
                        <i className={getCategoryIcon(project.category)}></i>
                      </div>
                    )}
                    <div className="project-category-overlay-label">
                      {project.category || 'WEB APPLICATION'}
                    </div>
                  </div>
                  <div className="project-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tech-badges">
                      {project.technologies && project.technologies.map(tech => renderTechBadge(tech))}
                    </div>
                    <div className="project-card-footer">
                      <span className="view-details-label">View Details &rarr;</span>
                      <div className="arrow-circle-button">
                        <i className="fa-solid fa-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center section-action">
            <button
              className="view-all-projects-pill-btn"
              onClick={() => navigate('/projects')}
            >
              View All Projects <span className="yellow-arrow-right">&rarr;</span>
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose TDC.USA Section */}
      <section className="why-choose-section" ref={whySectionRef}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title text-center">Why Choose TDC.USA</h2>
            <p className="section-subtitle text-center">
              We partner with businesses to deliver future-proof solutions through collaborative engineering and robust processes.
            </p>
          </motion.div>

          <div className="why-choose-connect-container">
            {/* Scroll-Linked Progress Connector Line */}
            <div className="why-connect-line-bg">
              <motion.div
                className="why-connect-line-fill"
                style={{
                  scaleX: isMobile ? 1 : whyLineScale,
                  scaleY: isMobile ? whyLineScale : 1
                }}
              />
            </div>

            <motion.div
              className="why-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div
                className="why-card"
                variants={slideFromLeft}
                whileHover="hovered"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <motion.div
                  className="why-icon-wrapper"
                  variants={whyIconVariants}
                >
                  <i className="fa-solid fa-cubes"></i>
                </motion.div>
                <h3>Custom Software Solutions</h3>
                <p>Tailored applications built from the ground up to solve your unique business challenges, optimize operations, and drive growth.</p>
              </motion.div>
              <motion.div
                className="why-card"
                variants={slideFromRight}
                whileHover="hovered"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <motion.div
                  className="why-icon-wrapper"
                  variants={whyIconVariants}
                >
                  <i className="fa-solid fa-arrows-spin"></i>
                </motion.div>
                <h3>Agile Development Process</h3>
                <p>Iterative delivery and rapid feedback cycles ensure complete adaptability, delivering premium code on schedule and budget.</p>
              </motion.div>
              <motion.div
                className="why-card"
                variants={slideFromLeft}
                whileHover="hovered"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <motion.div
                  className="why-icon-wrapper"
                  variants={whyIconVariants}
                >
                  <i className="fa-solid fa-comments"></i>
                </motion.div>
                <h3>Transparent Communication</h3>
                <p>We maintain full visibility with daily updates, collaborative workspaces, and direct developer access so you are always in control.</p>
              </motion.div>
              <motion.div
                className="why-card"
                variants={slideFromRight}
                whileHover="hovered"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <motion.div
                  className="why-icon-wrapper"
                  variants={whyIconVariants}
                >
                  <i className="fa-solid fa-headset"></i>
                </motion.div>
                <h3>Long-Term Support</h3>
                <p>Ongoing post-launch optimization, cloud infrastructure management, security audits, and dedicated support for your ongoing success.</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industries We Serve Section */}
      <section className="industries-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title text-center">Our Focus Industries</h2>
            <p className="section-subtitle text-center">
              Delivering tailor-made digital strategies and technical expertise to solve complex challenges across diverse sectors.
            </p>
          </motion.div>
          <motion.div
            className="industries-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="industry-card"
              variants={getIndustryVariants(0)}
              whileHover="hovered"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <motion.div
                className="industry-icon-wrapper"
                variants={{ hovered: { scale: 1.15, rotate: -6 } }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <i className="fa-solid fa-heart-pulse"></i>
              </motion.div>
              <h3>Healthcare</h3>
              <p>Advanced digital health solutions, secure telemedicine platforms, and HIPAA-compliant medical record management systems.</p>

              <div className="industry-hover-overlay">
                <h4>Healthcare Solutions</h4>
                <ul className="related-solutions">
                  <li>Telemedicine Platforms</li>
                  <li>EHR/EMR Integrations</li>
                  <li>Patient Portal Systems</li>
                </ul>
                <div className="tech-stack-mini">
                  <span>React Native</span>
                  <span>Node.js</span>
                  <span>AWS</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="industry-card"
              variants={getIndustryVariants(1)}
              whileHover="hovered"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <motion.div
                className="industry-icon-wrapper"
                variants={{ hovered: { scale: 1.15, rotate: 6 } }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <i className="fa-solid fa-graduation-cap"></i>
              </motion.div>
              <h3>Education</h3>
              <p>Interactive e-learning platforms, virtual classrooms, and comprehensive student information systems for modern academic institutions.</p>

              <div className="industry-hover-overlay">
                <h4>Education Solutions</h4>
                <ul className="related-solutions">
                  <li>LMS Systems Setup</li>
                  <li>Virtual Classrooms</li>
                  <li>E-Learning Portals</li>
                </ul>
                <div className="tech-stack-mini">
                  <span>React</span>
                  <span>WebRTC</span>
                  <span>Firebase</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="industry-card"
              variants={getIndustryVariants(2)}
              whileHover="hovered"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <motion.div
                className="industry-icon-wrapper"
                variants={{ hovered: { scale: 1.15, rotate: -6 } }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <i className="fa-solid fa-chart-line"></i>
              </motion.div>
              <h3>Finance</h3>
              <p>Secure fintech applications, robust payment gateways, and real-time analytic dashboards adhering to strict financial regulations.</p>

              <div className="industry-hover-overlay">
                <h4>Finance Solutions</h4>
                <ul className="related-solutions">
                  <li>Fintech Web Apps</li>
                  <li>Payment Gateways</li>
                  <li>Analytics Dashboards</li>
                </ul>
                <div className="tech-stack-mini">
                  <span>Angular</span>
                  <span>Python</span>
                  <span>PostgreSQL</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="industry-card"
              variants={getIndustryVariants(3)}
              whileHover="hovered"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <motion.div
                className="industry-icon-wrapper"
                variants={{ hovered: { scale: 1.15, rotate: 6 } }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <i className="fa-solid fa-cart-shopping"></i>
              </motion.div>
              <h3>Retail</h3>
              <p>Custom e-commerce ecosystems, smart inventory management, and omnichannel digital shopping experiences that drive sales.</p>

              <div className="industry-hover-overlay">
                <h4>Retail Solutions</h4>
                <ul className="related-solutions">
                  <li>E-commerce Hubs</li>
                  <li>Inventory Software</li>
                  <li>Omnichannel Systems</li>
                </ul>
                <div className="tech-stack-mini">
                  <span>Next.js</span>
                  <span>Shopify SDK</span>
                  <span>Tailwind</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="industry-card"
              variants={getIndustryVariants(4)}
              whileHover="hovered"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <motion.div
                className="industry-icon-wrapper"
                variants={{ hovered: { scale: 1.15, rotate: -6 } }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <i className="fa-solid fa-truck-fast"></i>
              </motion.div>
              <h3>Logistics</h3>
              <p>Real-time supply chain tracking, fleet management software, and automated warehousing systems to optimize operations.</p>

              <div className="industry-hover-overlay">
                <h4>Logistics Solutions</h4>
                <ul className="related-solutions">
                  <li>Supply Chain Hubs</li>
                  <li>Fleet Management</li>
                  <li>Automated Warehousing</li>
                </ul>
                <div className="tech-stack-mini">
                  <span>React</span>
                  <span>Google Maps</span>
                  <span>Docker</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="industry-card"
              variants={getIndustryVariants(5)}
              whileHover="hovered"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <motion.div
                className="industry-icon-wrapper"
                variants={{ hovered: { scale: 1.15, rotate: 6 } }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <i className="fa-solid fa-building-user"></i>
              </motion.div>
              <h3>Real Estate</h3>
              <p>Property listing portals, CRM systems for brokers, and virtual touring management platforms that connect buyers and sellers.</p>

              <div className="industry-hover-overlay">
                <h4>Real Estate Solutions</h4>
                <ul className="related-solutions">
                  <li>Property Listings</li>
                  <li>Broker CRM Software</li>
                  <li>Virtual Touring</li>
                </ul>
                <div className="tech-stack-mini">
                  <span>Vue.js</span>
                  <span>Three.js</span>
                  <span>MongoDB</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <CaseStudiesSection />

      <TrustedBySection />

      {/* Latest Insights & Blogs Section */}
      <section className="home-blogs">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title text-center">Latest Insights & Blogs</h2>
            <p className="section-subtitle text-center">
              Thought leadership and technical articles from our engineering team.
            </p>
          </motion.div>

          {loading ? (
            <SkeletonGrid type="blog" count={3} />
          ) : (
            <motion.div
              className="blogs-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {blogs.slice(0, 3).map((blog, index) => (
                <motion.div
                  key={blog._id}
                  className="blog-card"
                  variants={itemVariants}
                  onClick={() => navigate(`/blogs/${blog.slug || blog._id}`)}
                  style={{ cursor: 'pointer', y: getParallaxValue(index) }}
                >
                  <div className="blog-image">
                    <img
                      src={getImageUrl(blog.featuredImage || blog.image)}
                      alt={blog.title}
                      onError={handleImageError}
                    />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-category">{blog.category}</span>
                      <span className="blog-date">
                        {new Date(blog.publishedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h3>{blog.title}</h3>
                    <p>{blog.excerpt}</p>
                    <div className="blog-card-footer" style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--borders)' }}>
                      <span className="read-more-label" style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--gold-accent)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        Read More <span className="read-more-arrow" style={{ transition: 'transform 0.3s ease' }}>&rarr;</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center section-action">
            <button
              className="btn-secondary view-all-btn"
              onClick={() => navigate('/blogs')}
            >
              View All &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="home-testimonials">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title text-center">What Our Clients Say</h2>
            <p className="section-subtitle text-center">
              Hear from industry leaders about their experience partnering with TDC.USA.
            </p>
          </motion.div>

          {loading ? (
            <SkeletonGrid type="testimonial" count={3} />
          ) : (
            <div
              className="testimonials-carousel-wrapper"
              onMouseEnter={() => setIsTestimonialHovered(true)}
              onMouseLeave={() => setIsTestimonialHovered(false)}
            >
              {testimonials.length > 0 && (
                <div className="carousel-inner-container">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTestimonialIdx}
                      initial={{ opacity: 0, x: 50, scale: 0.98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -50, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      className="testimonial-card carousel-card"
                    >
                      <div className="testimonial-avatar-wrapper">
                        <img
                          src={getTestimonialImageUrl(testimonials[activeTestimonialIdx].profileImage)}
                          alt={testimonials[activeTestimonialIdx].clientName}
                          className="client-avatar"
                          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                        />
                      </div>
                      <div className="rating-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${i < testimonials[activeTestimonialIdx].rating ? 'active' : 'inactive'}`}
                          ></i>
                        ))}
                      </div>
                      <p className="testimonial-review">"{testimonials[activeTestimonialIdx].review}"</p>
                      <div className="testimonial-client-meta">
                        <h4>{testimonials[activeTestimonialIdx].clientName}</h4>
                        <p className="client-designation">{testimonials[activeTestimonialIdx].designation}</p>
                        <div className="client-company-row">
                          <span className="company-name">{testimonials[activeTestimonialIdx].companyName || testimonials[activeTestimonialIdx].company}</span>
                          {testimonials[activeTestimonialIdx].companyLogo && (
                            <img
                              src={getTestimonialImageUrl(testimonials[activeTestimonialIdx].companyLogo, true)}
                              alt={testimonials[activeTestimonialIdx].companyName || testimonials[activeTestimonialIdx].company}
                              className="company-logo-img"
                              onError={(e) => { e.target.src = DEFAULT_LOGO; }}
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <button
                    className="carousel-nav-btn prev-btn"
                    onClick={() => setActiveTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    aria-label="Previous Testimonial"
                  >
                    &larr;
                  </button>
                  <button
                    className="carousel-nav-btn next-btn"
                    onClick={() => setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length)}
                    aria-label="Next Testimonial"
                  >
                    &rarr;
                  </button>

                  {/* Navigation Dots */}
                  <div className="carousel-dots">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        className={`carousel-dot ${idx === activeTestimonialIdx ? 'active' : ''}`}
                        onClick={() => setActiveTestimonialIdx(idx)}
                        aria-label={`Go to testimonial ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Latest Careers Section */}
      <section className="home-careers">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title text-center">Career Opportunities</h2>
            <p className="section-subtitle text-center">
              Join our fast-growing engineering and design teams.
            </p>
          </motion.div>

          {loading ? (
            <SkeletonGrid type="career" count={3} />
          ) : (
            <motion.div
              className="jobs-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {jobs.slice(0, 3).map((job, index) => (
                <motion.div
                  key={job._id}
                  className="job-card"
                  variants={itemVariants}
                  onClick={() => navigate(`/careers/${job._id}`)}
                  style={{ cursor: 'pointer', y: getParallaxValue(index) }}
                >
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    <span className={`job-type ${job.type?.toLowerCase() || 'full-time'}`}>
                      {job.type}
                    </span>
                  </div>
                  <div className="job-details" style={{ margin: '1rem 0', display: 'flex', flexWrap: 'wrap', gap: '10px 20px' }}>
                    <span><i className="fas fa-building" style={{ color: 'var(--primary-yellow)', marginRight: '6px' }}></i>{job.department}</span>
                    <span><i className="fas fa-map-marker-alt" style={{ color: 'var(--primary-yellow)', marginRight: '6px' }}></i>{job.location}</span>
                    <span><i className="fas fa-briefcase" style={{ color: 'var(--primary-yellow)', marginRight: '6px' }}></i>{job.experienceLevel || 'Mid-Level'}</span>
                  </div>
                  <p style={{ marginBottom: '1.5rem' }}>{job.description}</p>
                  <div className="job-card-footer" style={{ borderTop: '1px solid var(--borders)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <button
                      className="hero-btn-primary"
                      onClick={(e) => { e.stopPropagation(); navigate(`/careers/${job._id}`); }}
                      style={{ padding: '8px 18px', fontSize: '0.85rem', fontWeight: '700', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Apply Now &rarr;
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center section-action">
            <button
              className="btn-secondary view-all-btn"
              onClick={() => navigate('/careers')}
            >
              View All Opportunities &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 70, damping: 14 }}
          >
            <h2>Ready to Transform Your Business?</h2>
            <p>
              Let's discuss how TDC.USA can help you achieve your digital
              transformation goals.
            </p>
            <motion.button
              className="btn-primary shine-sweep-btn"
              onClick={() => navigate('/contact')}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Us Today <span className="cta-btn-arrow">→</span>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;



