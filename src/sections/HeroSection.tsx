import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/Container';
import { ThreeDPaper } from '../scenes/ThreeDPaper';

interface HeroSectionProps {
  onConnectClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onConnectClick }) => {
  return (
    <section 
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'calc(var(--header-height) + 2rem)',
        paddingBottom: '4rem',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      {/* Background Subtle Lab Coordinate Markings */}
      <div 
        style={{
          position: 'absolute',
          top: '90px',
          left: '24px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-dim)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        SYS.STATE: RUNNING // WORKSTATION 01 // FREQ: 240MHz
      </div>

      <div 
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-dim)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        LAT/LONG: [28.6139° N, 77.2090° E] // TIME: UTC+05:30
      </div>

      <Container>
        <div 
          className="hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: 'var(--space-2xl)',
            alignItems: 'center'
          }}
        >
          {/* Left Column: Typography & Engineering Positioning */}
          <div style={{ display: 'flex', flexDirection: 'column', zIndex: 10 }}>
            {/* Engineer Identity Label */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: 'var(--space-md)'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.14em',
                  color: 'var(--text-accent)',
                  fontWeight: 600
                }}
              >
                <span className="tech-status-dot" />
                HIMANSHU MAKHE
              </div>
              <span style={{ color: 'var(--border-medium)' }}>//</span>
              <span className="tech-coord">SYSTEMS ENGINEER</span>
            </div>

            {/* Core Mission Headline */}
            <h1 
              style={{
                fontSize: 'clamp(2.4rem, 4.6vw, 4.2rem)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-lg)'
              }}
            >
              I BUILD SYSTEMS<br />
              THAT CONNECT<br />
              <span style={{ color: 'var(--text-accent)' }}>HARDWARE</span> WITH<br />
              <span style={{ color: 'var(--text-primary)' }}>SOFTWARE.</span>
            </h1>

            {/* Supporting Disciplines Text */}
            <p 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.04em',
                marginBottom: 'var(--space-xl)',
                borderLeft: '2px solid var(--accent-blue)',
                paddingLeft: '14px',
                lineHeight: 1.5
              }}
            >
              Embedded Systems · IoT · Robotics · AI · PCB · 3D Design
            </p>

            {/* Secondary Metadata Block */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xl)',
                marginBottom: 'var(--space-2xl)',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                maxWidth: '480px'
              }}
            >
              <div>
                <div 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)'
                  }}
                >
                  2+ YEARS
                </div>
                <div className="tech-coord">
                  HANDS-ON ENGINEERING
                </div>
              </div>

              <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--border-medium)' }} />

              <div>
                <div 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--status-active)'
                  }}
                >
                  4 MAJOR SYSTEMS
                </div>
                <div className="tech-coord">
                  HARDWARE-DEPLOYED
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 'var(--space-md)',
                marginBottom: 'var(--space-lg)'
              }}
            >
              <Link 
                to="/work" 
                className="btn btn-primary"
                style={{ padding: '0.85rem 1.6rem' }}
              >
                <span>EXPLORE MY WORK</span>
                <span className="btn-arrow">→</span>
              </Link>

              <Link 
                to="/resume" 
                className="btn btn-secondary"
                style={{ padding: '0.85rem 1.6rem' }}
              >
                <span>VIEW RESUME</span>
              </Link>
            </div>

            {/* Subtle Let's Connect */}
            <div>
              <button
                onClick={() => {
                  if (onConnectClick) onConnectClick();
                  else {
                    const ctaElem = document.getElementById('contact-section');
                    if (ctaElem) ctaElem.scrollIntoView({ behavior: 'smooth' });
                    else window.location.href = '/about#contact';
                  }
                }}
                className="btn-ghost"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  padding: 0
                }}
              >
                <span>LET&apos;S CONNECT</span>
                <span className="btn-arrow" style={{ color: 'var(--text-accent)' }}>→</span>
              </button>
            </div>
          </div>

          {/* Right Column: ThreeDPaper WebGL Engineering Artifact */}
          <div 
            className="hero-visual-wrapper tech-bracket"
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '480px',
              backgroundColor: 'rgba(14, 16, 23, 0.4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <ThreeDPaper interactive={true} />
          </div>
        </div>
      </Container>

      <style>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: var(--space-xl) !important;
          }
          .hero-visual-wrapper {
            minHeight: 380px !important;
            order: 2;
          }
        }
      `}</style>
    </section>
  );
};
