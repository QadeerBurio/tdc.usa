import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const servicesList = [
  { slug: 'custom-software-development', title: 'Custom Software Development', icon: 'fas fa-laptop-code', desc: 'Tailored software solutions designed and built to address your specific business challenges.' },
  { slug: 'web-development', title: 'Web Development', icon: 'fas fa-globe', desc: 'High-performance, responsive websites and enterprise web applications.' },
  { slug: 'mobile-app-development', title: 'Mobile App Development', icon: 'fas fa-mobile-alt', desc: 'Native and cross-platform mobile apps for iOS and Android.' },
  { slug: 'cloud-solutions', title: 'Cloud Solutions', icon: 'fas fa-cloud', desc: 'Secure, scalable cloud migrations, infrastructure management, and serverless.' },
  { slug: 'ai-solutions', title: 'AI Solutions', icon: 'fas fa-brain', desc: 'Machine learning, natural language processing, and predictive analytics.' },
  { slug: 'ui-ux-design', title: 'UI/UX Design', icon: 'fas fa-palette', desc: 'User-centered design systems and interactive wireframes.' },
  { slug: 'it-consulting', title: 'IT Consulting', icon: 'fas fa-comments', desc: 'Strategic technology advisory services to align your IT investments.' }
];

const fallbackProjects = [
  { _id: '1', title: 'Enterprise Portal', description: 'A highly secure enterprise client portal built with React and Node.js.', image: '' },
  { _id: '2', title: 'SaaS Analytics Dashboard', description: 'Real-time telemetry and analytic dashboard for cloud systems.', image: '' }
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [projects, setProjects] = useState([]);
  
  // Mobile accordion states
  const [mobileAccordions, setMobileAccordions] = useState({
    services: false,
    projects: false,
    resources: false,
    about: false
  });

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMobileAccordion = (key) => {
    setMobileAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/projects/featured`);
        if (res.ok) {
          const data = await res.json();
          setProjects(data.slice(0, 2));
        } else {
          setProjects(fallbackProjects);
        }
      } catch (err) {
        console.error('Error fetching header projects:', err);
        setProjects(fallbackProjects);
      }
    };
    fetchFeaturedProjects();
  }, []);

  const handleMouseEnter = (menu) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
    setHoverTimeout(timeout);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%231e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23E5B63E">TDC.USA</text></svg>`;
    if (imagePath.startsWith('http')) return imagePath;
    const apiBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${apiBase}${imagePath}`;
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="nav">
          <motion.div 
            className="logo" 
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <h1>TDC<span>.USA</span></h1>
          </motion.div>

          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Desktop Nav Links */}
          <ul className="nav-links desktop-only">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active-nav-link' : '')}>
                Home
              </NavLink>
            </li>

            {/* Services Mega Dropdown */}
            <li 
              className="dropdown-trigger-wrapper"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <span className={`dropdown-trigger-label ${location.pathname.startsWith('/services') ? 'active-nav-link' : ''}`}>
                Services <i className={`fa-solid fa-chevron-down dropdown-arrow ${activeDropdown === 'services' ? 'rotated' : ''}`}></i>
              </span>
              
              <AnimatePresence>
                {activeDropdown === 'services' && (
                  <motion.div 
                    className="mega-menu-dropdown services-mega-menu"
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="mega-menu-grid">
                      <div className="mega-menu-links-col">
                        <h3>Our Expert Capabilities</h3>
                        <div className="mega-menu-links-grid">
                          {servicesList.map((item) => (
                            <div 
                              key={item.slug} 
                              className="mega-menu-link-item"
                              onClick={() => {
                                setActiveDropdown(null);
                                navigate(`/services/${item.slug}`);
                              }}
                            >
                              <div className="mega-menu-icon">
                                <i className={item.icon}></i>
                              </div>
                              <div className="mega-menu-text">
                                <h4>{item.title}</h4>
                                <p>{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mega-menu-featured-col">
                        <div className="featured-service-nav-card">
                          <span className="featured-tag">HOT OFFERINGS</span>
                          <h4>Artificial Intelligence</h4>
                          <p>Accelerate your growth using pre-trained large language models, retrieval augmented generation databases, and computer vision tools.</p>
                          <button 
                            className="nav-featured-cta"
                            onClick={() => {
                              setActiveDropdown(null);
                              navigate('/services/ai-solutions');
                            }}
                          >
                            Explore AI Solutions &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Projects Dropdown */}
            <li 
              className="dropdown-trigger-wrapper"
              onMouseEnter={() => handleMouseEnter('projects')}
              onMouseLeave={handleMouseLeave}
            >
              <span className={`dropdown-trigger-label ${location.pathname.startsWith('/projects') ? 'active-nav-link' : ''}`}>
                Projects <i className={`fa-solid fa-chevron-down dropdown-arrow ${activeDropdown === 'projects' ? 'rotated' : ''}`}></i>
              </span>
              
              <AnimatePresence>
                {activeDropdown === 'projects' && (
                  <motion.div 
                    className="mega-menu-dropdown projects-mega-menu"
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="projects-dropdown-container">
                      <h3>Latest Featured Projects</h3>
                      <div className="projects-dropdown-grid">
                        {projects.map((proj) => (
                          <div 
                            key={proj._id} 
                            className="proj-drop-card"
                            onClick={() => {
                              setActiveDropdown(null);
                              navigate(`/projects/${proj._id}`);
                            }}
                          >
                            <div className="proj-drop-img">
                              <img src={getImageUrl(proj.image)} alt={proj.title} />
                            </div>
                            <div className="proj-drop-info">
                              <h4>{proj.title}</h4>
                              <p>{proj.description || 'Enterprise grade scalable application'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="projects-drop-footer" onClick={() => {
                        setActiveDropdown(null);
                        navigate('/projects');
                      }}>
                        <span>View All Projects &rarr;</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Blogs Link */}
            <li>
              <NavLink to="/blogs" className={({ isActive }) => (isActive ? 'active-nav-link' : '')}>
                Blogs
              </NavLink>
            </li>

            {/* Careers Link */}
            <li>
              <NavLink to="/careers" className={({ isActive }) => (isActive ? 'active-nav-link' : '')}>
                Careers
              </NavLink>
            </li>

            {/* About Link */}
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-nav-link' : '')}>
                About
              </NavLink>
            </li>

            {/* Contact Link */}
            <li>
              <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active-nav-link' : '')}>
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Mobile Nav Links with Accordion Accordance */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.ul 
                className="nav-links mobile-menu"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
              >
                <li>
                  <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                    Home
                  </NavLink>
                </li>

                {/* Mobile Accordion Services */}
                <li className="mobile-accordion-li">
                  <div className="mobile-accordion-header" onClick={() => toggleMobileAccordion('services')}>
                    <span>Services</span>
                    <i className={`fa-solid fa-chevron-down accordion-arrow ${mobileAccordions.services ? 'rotated' : ''}`}></i>
                  </div>
                  <AnimatePresence>
                    {mobileAccordions.services && (
                      <motion.ul 
                        className="mobile-accordion-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {servicesList.map((item) => (
                          <li key={item.slug}>
                            <NavLink to={`/services/${item.slug}`} onClick={() => setIsMenuOpen(false)}>
                              <i className={item.icon} style={{ marginRight: '8px', color: 'var(--primary-yellow)' }}></i> {item.title}
                            </NavLink>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>

                {/* Mobile Accordion Projects */}
                <li className="mobile-accordion-li">
                  <div className="mobile-accordion-header" onClick={() => toggleMobileAccordion('projects')}>
                    <span>Projects</span>
                    <i className={`fa-solid fa-chevron-down accordion-arrow ${mobileAccordions.projects ? 'rotated' : ''}`}></i>
                  </div>
                  <AnimatePresence>
                    {mobileAccordions.projects && (
                      <motion.ul 
                        className="mobile-accordion-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <li>
                          <NavLink to="/projects" onClick={() => setIsMenuOpen(false)}>
                            View All Projects
                          </NavLink>
                        </li>
                        {projects.map((proj) => (
                          <li key={proj._id}>
                            <NavLink to={`/projects/${proj._id}`} onClick={() => setIsMenuOpen(false)}>
                              {proj.title}
                            </NavLink>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>

                {/* Mobile Blogs */}
                <li>
                  <NavLink to="/blogs" onClick={() => setIsMenuOpen(false)}>
                    Blogs
                  </NavLink>
                </li>

                {/* Mobile Careers */}
                <li>
                  <NavLink to="/careers" onClick={() => setIsMenuOpen(false)}>
                    Careers
                  </NavLink>
                </li>

                {/* Mobile About */}
                <li>
                  <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
                    About
                  </NavLink>
                </li>

                {/* Mobile Contact */}
                <li>
                  <NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
                    Contact
                  </NavLink>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  );
};

export default Header;