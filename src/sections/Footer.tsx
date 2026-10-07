import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/Container';

export const Footer: React.FC = () => {
  return (
    <footer 
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-primary)',
        paddingTop: 'var(--space-2xl)',
        paddingBottom: 'var(--space-2xl)',
        borderTop: '1px solid var(--border-subtle)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.74rem',
        color: 'var(--text-muted)'
      }}
    >
      <Container>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-md)'
          }}
        >
          {/* Brand & System Code */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              HIMANSHU MAKHE
            </span>
            <span style={{ color: 'var(--border-medium)' }}>/</span>
            <span className="tech-coord">HARDWARE × SOFTWARE LAB</span>
          </div>

          {/* Quick Route Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <Link to="/work" style={{ color: 'var(--text-secondary)' }}>WORK</Link>
            <Link to="/3d-lab" style={{ color: 'var(--text-secondary)' }}>3D LAB</Link>
            <Link to="/about" style={{ color: 'var(--text-secondary)' }}>ABOUT</Link>
            <Link to="/resume" style={{ color: 'var(--text-secondary)' }}>RESUME</Link>
          </div>

          {/* Telemetry Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="tech-status-dot" />
            <span className="tech-coord">STATUS: PRODUCTION STABLE</span>
          </div>
        </div>

        <div 
          style={{
            marginTop: 'var(--space-lg)',
            paddingTop: 'var(--space-md)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '0.68rem',
            color: 'var(--text-dim)'
          }}
        >
          <span>BUILD: REV 1.0.4-PROD // THREE.JS WEBGL RENDERER</span>
          <span>© {new Date().getFullYear()} HIMANSHU MAKHE. ALL RIGHTS RESERVED.</span>
        </div>
      </Container>
    </footer>
  );
};
