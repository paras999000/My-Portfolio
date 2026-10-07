import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onConnectClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onConnectClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'WORK', path: '/work' },
    { label: '3D LAB', path: '/3d-lab' },
    { label: 'ABOUT', path: '/about' },
    { label: 'RESUME', path: '/resume' },
  ];

  return (
    <header 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        transition: 'all var(--transition-medium)',
        backgroundColor: scrolled ? 'rgba(8, 9, 13, 0.92)' : 'rgba(8, 9, 13, 0.6)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid var(--border-medium)' : '1px solid var(--border-subtle)',
        paddingTop: scrolled ? '12px' : '18px',
        paddingBottom: scrolled ? '12px' : '18px',
      }}
    >
      <div 
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand / Logo */}
        <Link 
          to="/" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none'
          }}
        >
          <div 
            style={{
              width: '10px',
              height: '10px',
              border: '1.5px solid var(--accent-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(45deg)'
            }}
          >
            <div style={{ width: '4px', height: '4px', backgroundColor: 'var(--accent-blue)' }} />
          </div>
          <span 
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.92rem',
              letterSpacing: '0.14em',
              color: 'var(--text-primary)'
            }}
          >
            HIMANSHU <span style={{ color: 'var(--text-accent)' }}>/</span> MK
          </span>
          <span 
            className="tech-coord"
            style={{
              display: 'none',
              marginLeft: '8px',
              fontSize: '0.65rem'
            }}
          >
            [LAB-01]
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem'
          }}
          className="desktop-nav"
        >
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.12em',
                  fontWeight: 500,
                  color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                  position: 'relative',
                  padding: '4px 0',
                  transition: 'color var(--transition-fast)'
                }}
              >
                {item.label}
                {isActive && (
                  <span 
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '1.5px',
                      backgroundColor: 'var(--accent-blue)',
                      borderRadius: '1px'
                    }} 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => {
              if (onConnectClick) {
                onConnectClick();
              } else {
                const ctaElem = document.getElementById('contact-section');
                if (ctaElem) {
                  ctaElem.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/about#contact';
                }
              }
            }}
            className="btn btn-secondary desktop-cta"
            style={{
              padding: '0.45rem 0.95rem',
              fontSize: '0.74rem'
            }}
          >
            <span>LET&apos;S CONNECT</span>
            <span className="btn-arrow">→</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
            style={{
              display: 'none',
              padding: '6px',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '22px' }}>
              <span style={{ height: '2px', backgroundColor: 'var(--text-primary)', width: '100%' }} />
              <span style={{ height: '2px', backgroundColor: 'var(--text-accent)', width: '75%' }} />
              <span style={{ height: '2px', backgroundColor: 'var(--text-primary)', width: '100%' }} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-medium)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            zIndex: 99
          }}
        >
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                letterSpacing: '0.12em',
                color: location.pathname === item.path ? 'var(--text-accent)' : 'var(--text-primary)',
                padding: '6px 0'
              }}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onConnectClick) onConnectClick();
              else {
                const ctaElem = document.getElementById('contact-section');
                if (ctaElem) ctaElem.scrollIntoView({ behavior: 'smooth' });
                else window.location.href = '/about#contact';
              }
            }}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            LET&apos;S CONNECT →
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 820px) {
          .desktop-nav, .desktop-cta {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
