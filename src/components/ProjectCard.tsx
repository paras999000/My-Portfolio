import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProjectItem } from '../data/projectsData';
import { ProjectVisual } from './ProjectVisual';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  reversed?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, reversed = false }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article 
      className={`project-card ${reversed ? 'reversed' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? '1px solid var(--border-accent)' : '1px solid var(--border-subtle)',
        boxShadow: hovered 
          ? '0 16px 40px -15px rgba(0, 0, 0, 0.8), 0 0 25px -5px var(--accent-glow)' 
          : 'none',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all var(--transition-medium)'
      }}
    >
      {/* 3D Visual Column */}
      <div className="project-card-visual-wrapper tech-bracket">
        <ProjectVisual projectId={project.id} interactive={true} priority={index < 2} />
        
        {/* Subtle corner index badge */}
        <div 
          style={{
            position: 'absolute',
            top: '12px',
            left: '14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-dim)',
            pointerEvents: 'none',
            zIndex: 5
          }}
        >
          SYS-0{index + 1} // 3D RENDERING
        </div>
      </div>

      {/* Content Column */}
      <div className="project-card-content">
        <div className="project-card-header">
          <div className="project-category">
            <span className="tech-status-dot" />
            <span>{project.category}</span>
          </div>

          <h3 className="project-title">
            <Link 
              to={`/work/${project.id}`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {project.title}
            </Link>
          </h3>

          <div className="project-subtitle">
            {project.subtitle}
          </div>
        </div>

        <p className="project-desc">
          {project.description}
        </p>

        {/* Technical Metric Strip (Subtle on hover) */}
        {project.metrics && (
          <div 
            className="telemetry-strip"
            style={{
              marginBottom: 'var(--space-md)',
              opacity: hovered ? 1 : 0.85,
              borderColor: hovered ? 'var(--border-accent)' : 'var(--border-subtle)',
              transition: 'border-color var(--transition-fast)'
            }}
          >
            {project.metrics.slice(0, 2).map((m, idx) => (
              <div key={idx} className="telemetry-item">
                <span>{m.label}:</span>
                <span className="telemetry-val">{m.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Technology tags */}
        <div className="project-tech-tags">
          {project.technologies.map((tech) => (
            <span key={tech} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="project-actions">
          <Link
            to={`/work/${project.id}`}
            className="btn btn-primary"
            style={{
              padding: '0.6rem 1.2rem',
              fontSize: '0.78rem'
            }}
          >
            <span>VIEW CASE STUDY</span>
            <span className="btn-arrow">→</span>
          </Link>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{
                padding: '0.6rem 1.1rem',
                fontSize: '0.78rem'
              }}
            >
              <span>GITHUB</span>
              <span className="btn-arrow">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
