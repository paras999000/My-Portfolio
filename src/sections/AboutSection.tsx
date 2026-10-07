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

        <div 
          className="about-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-3xl)',
            marginTop: 'var(--space-xl)'
          }}
        >
          {/* Engineering Positioning */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
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

          {/* Leadership Engineering Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-accent)',
                letterSpacing: '0.1em',
                marginBottom: 'var(--space-sm)'
              }}
            >
              // LEADERSHIP & LAB OPERATIONS
            </div>

            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-lg)',
                position: 'relative',
                paddingLeft: '20px',
                borderLeft: '1px solid var(--border-medium)'
              }}
            >
              {leadershipData.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    position: 'relative',
                    paddingBottom: 'var(--space-md)'
                  }}
                >
                  {/* Timeline Node Point */}
                  <div 
                    style={{
                      position: 'absolute',
                      left: '-26px',
                      top: '4px',
                      width: '11px',
                      height: '11px',
                      borderRadius: '50%',
                      backgroundColor: item.status === 'ACTIVE' ? 'var(--status-active)' : 'var(--bg-surface)',
                      border: '2px solid var(--border-accent)',
                      boxShadow: item.status === 'ACTIVE' ? '0 0 10px var(--status-active)' : 'none'
                    }} 
                  />

                  {/* Header */}
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '4px',
                      marginBottom: '4px'
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
                      marginBottom: '6px'
                    }}
                  >
                    {item.role}
                  </h4>

                  <p 
                    style={{
                      fontSize: '0.86rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '8px'
                    }}
                  >
                    {item.description}
                  </p>

                  <ul style={{ paddingLeft: '16px', margin: 0 }}>
                    {item.highlights.map((hl, hIdx) => (
                      <li 
                        key={hIdx}
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.5,
                          marginBottom: '3px'
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
        </div>
      </Container>

      <style>{`
        @media (max-width: 960px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: var(--space-2xl) !important;
          }
        }
      `}</style>
    </section>
  );
};
