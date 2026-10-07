import React from 'react';
import { Container } from '../components/Container';
import { SectionHeading } from '../components/SectionHeading';
import { projectsData } from '../data/projectsData';
import { leadershipData } from '../data/leadershipData';
import { disciplinesData } from '../data/disciplinesData';

export const ResumePage: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <main style={{ paddingTop: 'calc(var(--header-height) + 2rem)', paddingBottom: 'var(--space-4xl)' }}>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: 'var(--space-2xl)' }}>
          <SectionHeading
            number="DOC // 04"
            pretitle="ENGINEERING SPECIFICATION SHEET"
            title="TECHNICAL RESUME & DOSSIER."
            description="Verified record of hardware prototyping, low-level firmware engineering, real-time spatial computing, and technical community leadership."
          />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handlePrint}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.3rem', fontSize: '0.78rem' }}
            >
              <span>PRINT / SAVE PDF</span>
              <span className="btn-arrow">↓</span>
            </button>
            <a 
              href="mailto:himanshumakhe11@gmail.com"
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1.3rem', fontSize: '0.78rem' }}
            >
              <span>CONTACT DISPATCH</span>
              <span className="btn-arrow">↗</span>
            </a>
          </div>
        </div>

        {/* Technical Resume Document Body */}
        <div 
          className="resume-doc tech-bracket"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: '4px',
            padding: 'var(--space-3xl) var(--space-2xl)',
            position: 'relative'
          }}
        >
          {/* Header Metadata */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '16px',
              paddingBottom: 'var(--space-xl)',
              borderBottom: '1px solid var(--border-medium)',
              marginBottom: 'var(--space-2xl)'
            }}
          >
            <div>
              <div 
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--text-accent)',
                  letterSpacing: '0.14em',
                  marginBottom: '4px'
                }}
              >
                // CANDIDATE SPECIFICATION
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '4px' }}>
                HIMANSHU MAKHE
              </h1>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Hardware & Software Systems Engineer · Computer Science Student
              </div>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>EMAIL: himanshumakhe11@gmail.com</div>
              <div>GITHUB: github.com/HimanshuMakhe</div>
              <div>LINKEDIN: linkedin.com/in/himanshu-makhe</div>
              <div>LOCATION: India // Workstation Node 01</div>
            </div>
          </div>

          {/* 1. Core Engineering Summary */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-accent)', letterSpacing: '0.1em', marginBottom: '8px' }}>
              01 // SUMMARY & MISSION
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Computer Science engineering student specializing in the convergence of physical embedded hardware and real-time algorithmic software. Experienced in designing custom PCB breakout circuits, writing deterministic firmware in C/C++ on ESP32 and RP2040 microcontrollers, streaming high-speed audio over I2S DMA, building 3D spatial simulations in Unity/ARCore, and executing parametric enclosure designs in CAD for additive manufacturing.
            </p>
          </section>

          {/* 2. Disciplines & Technical Competencies */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-accent)', letterSpacing: '0.1em', marginBottom: '12px' }}>
              02 // CORE ENGINEERING DISCIPLINES
            </h2>

            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '14px'
              }}
            >
              {disciplinesData.map((d) => (
                <div 
                  key={d.id}
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px'
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>
                    {d.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {d.skills.map((s) => s.name).join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Hardware & Software Systems Built */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-accent)', letterSpacing: '0.1em', marginBottom: '14px' }}>
              03 // KEY SYSTEMS ENGINEERED & DEPLOYED
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
              {projectsData.map((proj) => (
                <div key={proj.id} style={{ borderLeft: '2px solid var(--border-accent)', paddingLeft: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px', marginBottom: '2px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {proj.title} — {proj.subtitle}
                    </h3>
                    <span className="tech-coord">{proj.category}</span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '8px' }}>
                    {proj.caseStudy.overview}
                  </p>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <strong>Technologies:</strong> {proj.technologies.join(', ')}
                  </div>

                  {proj.metrics && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '6px' }}>
                      {proj.metrics.map((m, idx) => (
                        <span key={idx} className="tech-badge" style={{ fontSize: '0.7rem' }}>
                          {m.label}: <strong style={{ color: 'var(--text-accent)' }}>{m.value}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 4. Leadership & Engineering Community */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-accent)', letterSpacing: '0.1em', marginBottom: '12px' }}>
              04 // LEADERSHIP & ORGANIZATIONAL IMPACT
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {leadershipData.map((lead) => (
                <div key={lead.id} style={{ padding: '14px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>
                      {lead.role} — {lead.organization}
                    </span>
                    <span className="tech-coord">{lead.period}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {lead.description}
                  </p>
                  <ul style={{ paddingLeft: '16px', margin: 0 }}>
                    {lead.highlights.map((h, hIdx) => (
                      <li key={hIdx} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Education */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-accent)', letterSpacing: '0.1em', marginBottom: '12px' }}>
              05 // FORMAL EDUCATION
            </h2>
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>
                  Bachelor of Technology (B.Tech) — Computer Science & Engineering
                </span>
                <span className="tech-coord">CURRENT // UNDERGRADUATE</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Focused on Computer Networks, Embedded Systems, Operating Systems, Computer Architecture, and Algorithms.
              </p>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
};
