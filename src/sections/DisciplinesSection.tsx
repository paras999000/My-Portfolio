import React from 'react';
import { Container } from '../components/Container';
import { SectionHeading } from '../components/SectionHeading';
import { disciplinesData } from '../data/disciplinesData';

export const DisciplinesSection: React.FC = () => {
  return (
    <section 
      id="disciplines-section"
      style={{
        position: 'relative',
        paddingTop: 'var(--space-4xl)',
        paddingBottom: 'var(--space-4xl)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <Container>
        <SectionHeading
          number="03 //"
          pretitle="CORE CAPABILITIES"
          title="ENGINEERING DISCIPLINES."
          description="A multi-disciplinary stack engineered for bridging physical circuitry, embedded firmware, mathematical kinetics, and full-stack cloud pipelines."
        />

        <div 
          className="disciplines-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-lg)',
            marginTop: 'var(--space-xl)'
          }}
        >
          {disciplinesData.map((disc) => (
            <div 
              key={disc.id}
              className="tech-bracket"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '3px',
                padding: 'var(--space-xl) var(--space-lg)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color var(--transition-fast), transform var(--transition-fast)'
              }}
            >
              {/* Discipline Code */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-sm)'
                }}
              >
                <span className="tech-coord" style={{ color: 'var(--text-accent)' }}>
                  {disc.code}
                </span>
                <span className="tech-status-dot idle" />
              </div>

              {/* Title */}
              <h3 
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                  marginBottom: 'var(--space-sm)'
                }}
              >
                {disc.name}
              </h3>

              {/* Description */}
              <p 
                style={{
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                  marginBottom: 'var(--space-lg)',
                  flexGrow: 1
                }}
              >
                {disc.description}
              </p>

              {/* Technical Skill Tags (NO percentage bars!) */}
              <div 
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}
              >
                {disc.skills.map((skill) => (
                  <span 
                    key={skill.name}
                    className="tech-badge"
                    style={{
                      fontSize: '0.72rem',
                      padding: '4px 8px'
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>

      <style>{`
        @media (max-width: 1024px) {
          .disciplines-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .disciplines-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
