import React from 'react';
import './SkeletonLoader.css';

export const SkeletonCard = ({ type = 'project' }) => {
  if (type === 'project' || type === 'blog') {
    return (
      <div className="skeleton-card">
        <div className="skeleton-image shimmer"></div>
        <div className="skeleton-content">
          <div className="skeleton-badge shimmer"></div>
          <div className="skeleton-title shimmer"></div>
          <div className="skeleton-text shimmer"></div>
          <div className="skeleton-text short shimmer"></div>
          <div className="skeleton-tags">
            <div className="skeleton-tag shimmer"></div>
            <div className="skeleton-tag shimmer"></div>
            <div className="skeleton-tag shimmer"></div>
          </div>
          <div className="skeleton-footer">
            <div className="skeleton-footer-left shimmer"></div>
            <div className="skeleton-footer-right shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'testimonial') {
    return (
      <div className="skeleton-testimonial">
        <div className="skeleton-avatar shimmer"></div>
        <div className="skeleton-rating shimmer"></div>
        <div className="skeleton-text shimmer"></div>
        <div className="skeleton-text short shimmer"></div>
        <div className="skeleton-meta">
          <div className="skeleton-title shimmer"></div>
          <div className="skeleton-text short shimmer"></div>
        </div>
      </div>
    );
  }

  if (type === 'career') {
    return (
      <div className="skeleton-career">
        <div className="skeleton-career-header">
          <div className="skeleton-title shimmer"></div>
          <div className="skeleton-badge shimmer"></div>
        </div>
        <div className="skeleton-career-meta">
          <div className="skeleton-tag shimmer"></div>
          <div className="skeleton-tag shimmer"></div>
        </div>
        <div className="skeleton-text shimmer"></div>
        <div className="skeleton-text short shimmer"></div>
      </div>
    );
  }

  return null;
};

export const SkeletonGrid = ({ type = 'project', count = 3 }) => {
  return (
    <div className={`skeleton-grid skeleton-grid-${type}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} type={type} />
      ))}
    </div>
  );
};
