import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Careers from './pages/Careers';
import CareerDetail from './pages/CareerDetail';
import JobApplicationForm from './pages/JobApplicationForm';
import Contact from './pages/Contact';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import './App.css';

const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.35, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <ScrollToTop />
      <Header />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/services" element={<AnimatedPage><Services /></AnimatedPage>} />
            <Route path="/services/:slug" element={<AnimatedPage><ServiceDetail /></AnimatedPage>} />
            <Route path="/projects" element={<AnimatedPage><Projects /></AnimatedPage>} />
            <Route path="/projects/:slug" element={<AnimatedPage><ProjectDetail /></AnimatedPage>} />
            <Route path="/blogs" element={<AnimatedPage><Blogs /></AnimatedPage>} />
            <Route path="/blogs/:slug" element={<AnimatedPage><BlogDetail /></AnimatedPage>} />
            <Route path="/careers" element={<AnimatedPage><Careers /></AnimatedPage>} />
            <Route path="/careers/:slug" element={<AnimatedPage><CareerDetail /></AnimatedPage>} />
            <Route path="/careers/:slug/apply" element={<AnimatedPage><JobApplicationForm /></AnimatedPage>} />
            <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
            <Route path="/case-studies" element={<AnimatedPage><CaseStudies /></AnimatedPage>} />
            <Route path="/case-studies/:slug" element={<AnimatedPage><CaseStudyDetail /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;