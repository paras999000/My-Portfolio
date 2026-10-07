import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProjectItem } from '../data/projectsData';
import { ProjectVisual } from './ProjectVisual';

interface SecondaryProjectCardProps {
  project: ProjectItem;
  index: number;
}

export const SecondaryProjectCard: React.FC<SecondaryProjectCardProps> = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="secondary-project-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-card)',
        border: hovered ? '1px solid var(--border-accent)' : '1px solid var(--border-subtle)',
        borderRadius: '3px',
        overflow: 'hidden',
        boxShadow: hovered 
          ? '0 16px 36px -12px rgba(0, 0, 0, 0.75), 0 0 20px -5px var(--accent-glow)' 
          : 'none',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all var(--transition-medium)',
        position: 'relative'
      }}
    >
      {/* 3D Visual Viewport */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          height: '260px',
          background: 'radial-gradient(circle at center, rgba(19, 23, 34, 0.95), var(--bg-surface))',
          borderBottom: '1px solid var(--border-subtle)',
          overflow: 'hidden'
        }}
      >
        <ProjectVisual projectId={project.id} interactive={true} />

        {/* Index badge */}
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            left: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'var(--text-dim)',
            pointerEvents: 'none',
            zIndex: 5
          }}
        >
          SYS-0{index + 1} // 3D SCENE
        </div>

        {/* Priority Badge */}
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            right: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'var(--text-accent)',
            background: 'rgba(8, 10, 15, 0.85)',
            padding: '2px 6px',
            border: '1px solid var(--border-subtle)',
            borderRadius: '2px',
            pointerEvents: 'none',
            zIndex: 5
          }}
        >
          PRIORITY #{project.priority}
        </div>
      </div>

      {/* Card Body */}
      <div 
        style={{
          padding: 'var(--space-lg)',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}
      >
        {/* Category */}
        <div 
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: 'var(--space-xs)'
          }}
        >
          <span className="tech-status-dot" />
          <span>{project.category}</span>
        </div>

        {/* Title */}
        <h3 
          style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            margin: '0 0 4px 0',
            color: 'var(--text-primary)'
          }}
        >
          <Link 
            to={`/work/${project.id}`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {project.title}
          </Link>
        </h3>

        {/* Subtitle */}
        <div 
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.86rem',
            color: 'var(--text-muted)',
            marginBottom: 'var(--space-sm)',
            lineHeight: 1.4
          }}
        >
          {project.subtitle}
        </div>

        {/* Description */}
        <p 
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: 'var(--space-md)',
            flex: 1
          }}
        >
          {project.description}
        </p>

        {/* Telemetry Strip (Key Metrics) */}
        {project.metrics && project.metrics.length > 0 && (
          <div 
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              padding: '6px 10px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
              marginBottom: 'var(--space-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem'
            }}
          >
            {project.metrics.slice(0, 2).map((m, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{m.label}:</span>
                <span style={{ color: 'var(--text-accent)', fontWeight: 600 }}>{m.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Technology Badges */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: 'var(--space-lg)'
          }}
        >
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="tech-badge" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="tech-coord" style={{ alignSelf: 'center', fontSize: '0.65rem' }}>
              +{project.technologies.length - 4} MORE
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: 'auto'
          }}
        >
          <Link
            to={`/work/${project.id}`}
            className="btn btn-primary"
            style={{
              padding: '0.55rem 1rem',
              fontSize: '0.74rem',
              flex: 1
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
                padding: '0.55rem 0.9rem',
                fontSize: '0.74rem'
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
