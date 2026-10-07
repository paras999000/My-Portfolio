import React, { useState } from 'react';
import { Container } from '../components/Container';

export const CtaSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const email = "himanshumakhe11@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setShowContactForm(false);
    }, 3000);
  };

  return (
    <section 
      id="contact-section"
      style={{
        position: 'relative',
        paddingTop: 'var(--space-4xl)',
        paddingBottom: 'var(--space-4xl)',
        borderBottom: '1px solid var(--border-subtle)',
        overflow: 'hidden'
      }}
    >
      {/* Background Subtle Lab Coordinate Markings */}
      <div 
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-dim)',
          pointerEvents: 'none'
        }}
      >
        TELEMETRY_PORT: 8080 // SECURE TLS // NODE_READY
      </div>

      <Container>
        <div 
          className="tech-bracket"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: '4px',
            padding: 'var(--space-3xl) var(--space-2xl)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {/* Status Badge */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-accent)',
              letterSpacing: '0.12em',
              marginBottom: 'var(--space-md)'
            }}
          >
            <span className="tech-status-dot" />
            OPEN FOR HARDWARE & SOFTWARE COLLABORATION
          </div>

          {/* Headline */}
          <h2 
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-md)'
            }}
          >
            LET&apos;S BUILD<br />
            SOMETHING REAL.
          </h2>

          {/* Subtitle */}
          <p 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.08em',
              marginBottom: 'var(--space-2xl)'
            }}
          >
            Hardware. Software. Intelligence.
          </p>

          {/* Buttons */}
          <div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-md)',
              justifyContent: 'center',
              marginBottom: 'var(--space-xl)'
            }}
          >
            <a
              href="https://github.com/HimanshuMakhe"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.6rem' }}
            >
              <span>GITHUB</span>
              <span className="btn-arrow">↗</span>
            </a>

            <a
              href="https://linkedin.com/in/himanshu-makhe"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.6rem' }}
            >
              <span>LINKEDIN</span>
              <span className="btn-arrow">↗</span>
            </a>

            <button
              onClick={() => setShowContactForm(!showContactForm)}
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.6rem' }}
            >
              <span>{showContactForm ? 'CLOSE TERMINAL' : 'GET IN TOUCH'}</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* Direct Email Quick Copy */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)'
            }}
          >
            <span>DIRECT DISPATCH:</span>
            <button
              onClick={handleCopyEmail}
              className="tech-badge"
              style={{ cursor: 'pointer', color: 'var(--text-accent)' }}
              title="Click to copy email address"
            >
              {email}
            </button>
            {copied && (
              <span style={{ color: 'var(--status-active)', fontSize: '0.72rem' }}>
                [COPIED TO CLIPBOARD]
              </span>
            )}
          </div>

          {/* Interactive Contact Form Terminal */}
          {showContactForm && (
            <div 
              style={{
                width: '100%',
                maxWidth: '560px',
                marginTop: 'var(--space-2xl)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-accent)',
                borderRadius: '3px',
                padding: 'var(--space-xl)',
                textAlign: 'left'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-md)'
                }}
              >
                <span className="tech-coord" style={{ color: 'var(--text-accent)' }}>
                  COMMUNICATION PROTOCOL // DIRECT PACKET
                </span>
                <span className="tech-status-dot" />
              </div>

              {formSent ? (
                <div 
                  style={{
                    padding: 'var(--space-lg)',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--status-active)',
                    fontSize: '0.85rem'
                  }}
                >
                  ✓ PACKET RECEIVED. ACKNOWLEDGED BY ENGINEERING LAB.
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label 
                      htmlFor="contact-sender-id"
                      style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}
                    >
                      SENDER IDENTITY / NAME:
                    </label>
                    <input 
                      id="contact-sender-id"
                      required
                      type="text"
                      placeholder="e.g. Dr. Alex Vance"
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        padding: '8px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="contact-dispatch-email"
                      style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}
                    >
                      RETURN EMAIL ADDRESS:
                    </label>
                    <input 
                      id="contact-dispatch-email"
                      required
                      type="email"
                      placeholder="e.g. alex@vance-labs.com"
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        padding: '8px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="contact-payload-message"
                      style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}
                    >
                      TRANSMISSION PAYLOAD / MESSAGE:
                    </label>
                    <textarea 
                      id="contact-payload-message"
                      required
                      rows={4}
                      placeholder="Describe the hardware project, system architecture, or inquiry..."
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        padding: '8px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '6px' }}
                  >
                    DISPATCH PACKET →
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};
