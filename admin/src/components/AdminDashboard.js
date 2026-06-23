import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import BlogManagement from './BlogManagement';
import JobManagement from './JobManagement';
import ProjectManagement from './ProjectManagement';
import ApplicationsManagement from './ApplicationsManagement';
import ContactMessages from './ContactMessages';
import Settings from './Settings';
import TestimonialManagement from './TestimonialManagement';
import CaseStudyManagement from './CaseStudyManagement';
import NewsletterManagement from './NewsletterManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { admin, logout } = useAdmin();

  const menuItems = [
    { path: '', label: 'Dashboard', icon: 'fa-tachometer-alt' },
    { path: 'projects', label: 'Projects', icon: 'fa-project-diagram' },
    { path: 'blogs', label: 'Blogs', icon: 'fa-blog' },
    { path: 'jobs', label: 'Careers', icon: 'fa-briefcase' },
    { path: 'applications', label: 'Applications', icon: 'fa-file-signature' },
    { path: 'messages', label: 'Messages', icon: 'fa-envelope' },
    { path: 'testimonials', label: 'Testimonials', icon: 'fa-comments' },
    { path: 'case-studies', label: 'Case Studies', icon: 'fa-video' },
    { path: 'newsletter', label: 'Newsletter', icon: 'fa-paper-plane' },
    { path: 'settings', label: 'Settings', icon: 'fa-cog' },
  ];

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="admin-nav-brand">
          <h2>TDC<span>.USA</span> Admin</h2>
        </div>
        <ul className="admin-nav-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={`/${item.path}`}>
                <i className={`fas ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="admin-nav-logout">
            <button onClick={logout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <main className="admin-content">
        <div className="admin-content-header">
          <h1>Welcome, {admin?.name}</h1>
          <p>Manage your TDC.USA website content</p>
        </div>
        <Routes>
          <Route path="/" element={<div>Dashboard Overview</div>} />
          <Route path="/blogs" element={<BlogManagement />} />
          <Route path="/jobs" element={<JobManagement />} />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/applications" element={<ApplicationsManagement />} />
          <Route path="/messages" element={<ContactMessages />} />
          <Route path="/testimonials" element={<TestimonialManagement />} />
          <Route path="/case-studies" element={<CaseStudyManagement />} />
          <Route path="/newsletter" element={<NewsletterManagement />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;