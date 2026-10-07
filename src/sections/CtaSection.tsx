import React, { useState } from 'react';
import { Container } from '../components/Container';

export const CtaSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');

  const email = "himanshumakhe1234@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !senderEmail || !message) return;

    // Construct Mailto URI with prefilled packet payload
    const subject = encodeURIComponent(`[PORTFOLIO DISPATCH] System Inquiry from ${name}`);
    const body = encodeURIComponent(
      `SENDER: ${name}\nEMAIL: ${senderEmail}\n\nTRANSMISSION PAYLOAD:\n${message}\n\n---\nDispatched via Himanshu Makhe Laboratory Portfolio`
    );
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    // Copy formatted message as backup
    try {
      navigator.clipboard.writeText(`From: ${name} (${senderEmail})\n\n${message}`);
    } catch {
      // ignore
    }

    // Launch mail client
    window.location.href = mailtoUrl;

    setFormSent(true);
    setTimeout(() => {
      setName('');
      setSenderEmail('');
      setMessage('');
    }, 1000);
  };

  const handleToggleForm = () => {
    const nextState = !showContactForm;
    setShowContactForm(nextState);
    if (nextState) {
      setTimeout(() => {
        const input = document.getElementById('contact-sender-id');
        if (input) input.focus();
      }, 100);
    }
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
            OPEN FOR HARDWARE &amp; SOFTWARE COLLABORATION
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
              onClick={handleToggleForm}
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.6rem' }}
            >
              <span>{showContactForm ? 'CLOSE TERMINAL' : 'GET IN TOUCH'}</span>
              <span className="btn-arrow">{showContactForm ? '✕' : '→'}</span>
            </button>
          </div>

          {/* Direct Email Quick Copy & Launch */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)'
            }}
          >
            <span>DIRECT DISPATCH:</span>
            <a
              href={`mailto:${email}`}
              className="tech-badge"
              style={{
                textDecoration: 'none',
                color: 'var(--text-accent)',
                backgroundColor: 'rgba(56, 189, 248, 0.08)',
                padding: '4px 10px',
                borderRadius: '3px',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                transition: 'all 0.2s ease'
              }}
              title="Click to open default email client"
            >
              {email} ↗
            </a>

            <button
              onClick={handleCopyEmail}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: copied ? 'var(--status-active)' : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                padding: '4px 8px',
                borderRadius: '3px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Copy to clipboard"
            >
              {copied ? '✓ COPIED' : 'COPY'}
            </button>
          </div>

          {/* Interactive Contact Form Terminal */}
          {showContactForm && (
            <div 
              style={{
                width: '100%',
                maxWidth: '580px',
                marginTop: 'var(--space-2xl)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-accent)',
                borderRadius: '4px',
                padding: 'var(--space-xl)',
                textAlign: 'left',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
                animation: 'fadeIn 0.25s ease-out'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-md)',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="tech-status-dot" />
                  <span className="tech-coord" style={{ color: 'var(--text-accent)', fontSize: '0.75rem' }}>
                    DIRECT TRANSMISSION TERMINAL // SECURE DISPATCH
                  </span>
                </div>
                <button
                  onClick={() => setShowContactForm(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>

              {formSent ? (
                <div 
                  style={{
                    padding: 'var(--space-xl) var(--space-md)',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{ color: 'var(--status-active)', fontSize: '1.2rem', fontWeight: 700 }}>
                    ✓ TRANSMISSION INITIATED
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '420px', lineHeight: 1.6 }}>
                    Your default email client has been summoned with pre-formatted transmission headers to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    [Packet payload also copied to your clipboard]
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <a
                      href={`mailto:${email}`}
                      className="btn btn-primary"
                      style={{ fontSize: '0.78rem', padding: '0.5rem 1rem' }}
                    >
                      OPEN MAIL CLIENT AGAIN ↗
                    </a>
                    <button
                      onClick={() => setFormSent(false)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '0.5rem 1rem' }}
                    >
                      SEND ANOTHER PACKET
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label 
                      htmlFor="contact-sender-id"
                      style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '5px' }}
                    >
                      SENDER IDENTITY / NAME:
                    </label>
                    <input 
                      id="contact-sender-id"
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Alex Vance / Tech Recruiter"
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '3px',
                        padding: '10px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.84rem',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="contact-dispatch-email"
                      style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '5px' }}
                    >
                      RETURN EMAIL ADDRESS:
                    </label>
                    <input 
                      id="contact-dispatch-email"
                      required
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="e.g. alex@vance-labs.com"
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '3px',
                        padding: '10px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.84rem',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="contact-payload-message"
                      style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '5px' }}
                    >
                      TRANSMISSION PAYLOAD / MESSAGE:
                    </label>
                    <textarea 
                      id="contact-payload-message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your hardware project, embedded AI collaboration, robotics initiative, or inquiry..."
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '3px',
                        padding: '10px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.84rem',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '6px', padding: '0.85rem' }}
                  >
                    <span>DISPATCH PACKET TO {email}</span>
                    <span className="btn-arrow">→</span>
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
