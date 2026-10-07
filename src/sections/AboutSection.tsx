import React from 'react';
import { Container } from '../components/Container';
import { SectionHeading } from '../components/SectionHeading';
import { leadershipData, personalBio } from '../data/leadershipData';

export const AboutSection: React.FC = () => {
  return (
    <section 
      id="about-section"
      style={{
        position: 'relative',
        paddingTop: 'var(--space-4xl)',
        paddingBottom: 'var(--space-4xl)',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(8, 9, 13, 0.6)'
      }}
    >
      <Container>
        <SectionHeading
          number="04 //"
          pretitle="SYSTEMS LOG // PROFILE"
          title="ABOUT & LEADERSHIP."
          description="Bridging algorithmic intelligence with tactile physical hardware."
        />

        {/* Editorial Layout: Photo (Left) + Engineering Bio (Right) */}
        <div className="about-editorial-grid">
          {/* LEFT: Profile Photograph */}
          <div className="about-photo-wrapper">
            <div className="about-photo-card">
              <div className="about-photo-frame">
                <img 
                  src="/profile.jpg" 
                  alt="Himanshu Makhe - Hardware & Software Systems Engineer"
                  className="about-photo-img"
                  loading="eager"
                />
              </div>

              {/* Subtle technical metadata label */}
              <div className="about-photo-label">
                <div className="photo-label-header">
                  <span className="photo-label-name">HIMANSHU MAKHE</span>
                  <span className="photo-label-status">SYSTEMS ENG</span>
                </div>
                <div className="photo-label-sub">ENGINEERING / EMBEDDED SYSTEMS</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Engineering Introduction & Bio */}
          <div className="about-bio-content">
            <div 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-accent)',
                letterSpacing: '0.1em',
                marginBottom: 'var(--space-sm)'
              }}
            >
              // ENGINEERING PROFILE
            </div>

            <h3 
              style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-md)',
                lineHeight: 1.2
              }}
            >
              A Computer Science engineering student focused on building real hardware-software systems.
            </h3>

            {personalBio.longBio.map((paragraph, idx) => (
              <p 
                key={idx}
                style={{
                  fontSize: '0.94rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.68,
                  marginBottom: 'var(--space-md)'
                }}
              >
                {paragraph}
              </p>
            ))}

            {/* Hardware & Software Synergy Matrix */}
            <div 
              style={{
                marginTop: 'var(--space-md)',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '3px'
              }}
            >
              <span className="tech-coord" style={{ color: 'var(--text-accent)' }}>
                DISCIPLINARY CONVERGENCE MATRIX
              </span>
              <div 
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginTop: '8px'
                }}
              >
                {['Embedded Systems', 'IoT', 'Software', 'AI', 'Robotics', 'PCB', '3D CAD', 'Linux'].map((item) => (
                  <span key={item} className="tech-badge" style={{ color: 'var(--text-primary)' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leadership & Lab Operations Timeline */}
        <div style={{ marginTop: 'var(--space-3xl)', paddingTop: 'var(--space-2xl)', borderTop: '1px solid var(--border-subtle)' }}>
          <div 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-accent)',
              letterSpacing: '0.1em',
              marginBottom: 'var(--space-lg)'
            }}
          >
            // LEADERSHIP & LAB OPERATIONS
          </div>

          <div 
            className="leadership-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-lg)'
            }}
          >
            {leadershipData.map((item) => (
              <div 
                key={item.id}
                className="tech-bracket"
                style={{
                  position: 'relative',
                  padding: 'var(--space-lg)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Header */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '4px',
                    marginBottom: '6px'
                  }}
                >
                  <span 
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: 'var(--text-accent)',
                      fontWeight: 600
                    }}
                  >
                    {item.organization}
                  </span>
                  <span className="tech-coord">
                    {item.period}
                  </span>
                </div>

                <h4 
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                  }}
                >
                  {item.role}
                </h4>

                <p 
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '12px'
                  }}
                >
                  {item.description}
                </p>

                <ul style={{ paddingLeft: '16px', margin: 0, marginTop: 'auto' }}>
                  {item.highlights.map((hl, hIdx) => (
                    <li 
                      key={hIdx}
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.5,
                        marginBottom: '4px'
                      }}
                    >
                      {hl}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <style>{`
        .about-editorial-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: var(--space-3xl);
          align-items: start;
          margin-top: var(--space-xl);
        }

        .about-photo-wrapper {
          position: relative;
          width: 100%;
        }

        .about-photo-card {
          position: relative;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-medium);
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.5);
          transition: border-color var(--transition-medium);
        }

        .about-photo-card:hover {
          border-color: var(--border-accent);
        }

        .about-photo-frame {
          position: relative;
          overflow: hidden;
          background-color: #0b0d13;
        }

        .about-photo-img {
          display: block;
          width: 100%;
          height: auto;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          transition: transform var(--transition-medium), filter var(--transition-medium);
          filter: brightness(0.98) contrast(1.02);
        }

        .about-photo-card:hover .about-photo-img {
          transform: scale(1.015);
          filter: brightness(1.02) contrast(1.02);
        }

        .about-photo-label {
          padding: 10px 14px;
          background-color: rgba(14, 16, 23, 0.95);
          border-top: 1px solid var(--border-subtle);
          font-family: var(--font-mono);
        }

        .photo-label-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2px;
        }

        .photo-label-name {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--text-primary);
        }

        .photo-label-status {
          font-size: 0.65rem;
          color: var(--status-active);
          letter-spacing: 0.05em;
        }

        .photo-label-sub {
          font-size: 0.65rem;
          letter-spacing: 0.06em;
          color: var(--text-accent);
        }

        @media (max-width: 1024px) {
          .about-editorial-grid {
            grid-template-columns: 340px 1fr;
            gap: var(--space-2xl);
          }
        }

        @media (max-width: 860px) {
          .about-editorial-grid {
            grid-template-columns: 1fr;
            gap: var(--space-xl);
          }
          .about-photo-wrapper {
            max-width: 380px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};
