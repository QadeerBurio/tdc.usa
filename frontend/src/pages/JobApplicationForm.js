import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './JobApplicationForm.css';

const JobApplicationForm = () => {
  const { slug } = useParams(); // Holds the job _id
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Resume states
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    coverLetter: ''
  });

  useEffect(() => {
    fetchJobDetails();
  }, [slug]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/jobs/${slug}`);
      if (!response.ok) {
        throw new Error('The job opening you are applying for could not be found.');
      }
      const data = await response.json();
      setJob(data);
    } catch (err) {
      console.error('Error fetching job details for application:', err);
      setError(err.message || 'Error loading job details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeError('');
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      const isValidExt = ['pdf', 'doc', 'docx'].includes(ext);
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isValidExt) {
        setResumeError('Only PDF, DOC, and DOCX files are allowed!');
        setResumeFile(null);
        e.target.value = null; // Clear file input
        return;
      }
      if (!isLt5M) {
        setResumeError('File size exceeds 5MB limit.');
        setResumeFile(null);
        e.target.value = null; // Clear file input
        return;
      }

      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job) return;

    if (!resumeFile) {
      setResumeError('Resume file is required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('jobId', job._id);
      submitData.append('jobTitle', job.title);
      submitData.append('fullName', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('location', formData.location);
      submitData.append('linkedin', formData.linkedin);
      submitData.append('portfolio', formData.portfolio);
      submitData.append('coverLetter', formData.coverLetter);
      submitData.append('resume', resumeFile);

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/applications`, {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        let errorMessage = 'Failed to submit application.';
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = `Server error (${response.status}): ${response.statusText || 'Unable to process request'}`;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Error submitting job application:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading job details...</div>;

  if (error && !job) {
    return (
      <div className="container error-container" style={{ padding: '6rem 20px', textAlign: 'center' }}>
        <h2>Error loading job opening</h2>
        <p style={{ margin: '1rem 0 2rem', color: '#666' }}>{error}</p>
        <button onClick={() => navigate('/careers')} className="btn-primary">
          Back to Careers
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="application-success-page">
        <div className="container">
          <motion.div 
            className="success-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Application Submitted Successfully</h2>
            <p>
              Thank you for applying for the <strong>{job.title}</strong> position at TDC.USA. 
              Our recruitment team will review your application and contact you via email or phone if your profile matches our requirements.
            </p>
            <div className="success-actions">
              <button onClick={() => navigate('/careers')} className="btn-primary">
                Back to Careers
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-application-page">
      <div className="container">
        <motion.div 
          className="breadcrumb"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/careers">Careers</Link> &gt; <Link to={`/careers/${slug}`}>{job.title}</Link> &gt; <span>Apply</span>
        </motion.div>

        <motion.div 
          className="application-form-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="form-header">
            <h2>Submit Application</h2>
            <p className="job-details-subtitle">
              Role: <strong>{job.title}</strong> | Department: {job.department} | Location: {job.location}
            </p>
          </div>

          {error && <div className="form-error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="application-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. john.doe@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. +1 (555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location (City, State) *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Austin, TX"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn Profile URL</label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="portfolio">Portfolio URL</label>
                <input
                  type="url"
                  id="portfolio"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://myportfolio.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="resume">Resume Upload * (PDF, DOC, DOCX - Max 5MB)</label>
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
                style={{ display: 'block', marginTop: '0.25rem' }}
              />
              {resumeFile && (
                <div className="selected-file-name" style={{ marginTop: '0.5rem', color: '#16a34a', fontWeight: '600' }}>
                  Selected: {resumeFile.name}
                </div>
              )}
              {resumeError && (
                <div className="form-error-text" style={{ marginTop: '0.5rem', color: '#dc2626', fontSize: '0.85rem', fontWeight: '500' }}>
                  {resumeError}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="coverLetter">Cover Letter / Personal Note</label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows="6"
                value={formData.coverLetter}
                onChange={handleChange}
                placeholder="Tell us why you are interested in this position and what makes you a great fit..."
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-primary form-submit-btn" 
                disabled={submitting}
              >
                {submitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
              <Link to={`/careers/${slug}`} className="btn-secondary cancel-link">
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default JobApplicationForm;
