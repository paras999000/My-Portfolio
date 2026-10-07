import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Container } from '../components/Container';
import { ProjectVisual } from '../components/ProjectVisual';
import { projectsData } from '../data/projectsData';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const projectIndex = projectsData.findIndex((p) => p.id === projectId);
  if (projectIndex === -1) {
    return <Navigate to="/work" replace />;
  }

  const project = projectsData[projectIndex];
  const nextProject = projectsData[(projectIndex + 1) % projectsData.length];
  const prevProject = projectsData[(projectIndex - 1 + projectsData.length) % projectsData.length];
  const { caseStudy } = project;

  return (
    <article style={{ paddingTop: 'calc(var(--header-height) + 2rem)', paddingBottom: 'var(--space-4xl)' }}>
      {/* Top Breadcrumb & Metadata Navigation */}
      <Container>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: 'var(--space-xl)',
            paddingBottom: 'var(--space-md)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/work" className="btn-ghost" style={{ padding: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ← BACK TO SYSTEMS
            </Link>
            <span style={{ color: 'var(--border-medium)' }}>/</span>
            <span className="tech-coord" style={{ color: 'var(--text-accent)' }}>
              SYS-{project.id.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to={`/work/${prevProject.id}`} className="tech-badge" style={{ fontSize: '0.7rem' }}>
              PREV: {prevProject.title}
            </Link>
            <Link to={`/work/${nextProject.id}`} className="tech-badge" style={{ fontSize: '0.7rem' }}>
              NEXT: {nextProject.title} →
            </Link>
          </div>
        </div>

        {/* 01 — PROJECT OVERVIEW Header */}
        <section id="sec-01" style={{ marginBottom: 'var(--space-2xl)', scrollMarginTop: '100px' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--text-accent)',
              letterSpacing: '0.12em',
              marginBottom: 'var(--space-xs)'
            }}
          >
            <span className="tech-status-dot" />
            01 // PROJECT OVERVIEW · {project.category}
          </div>

          <h1 
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              marginBottom: 'var(--space-sm)'
            }}
          >
            {project.title}
          </h1>

          <p 
            style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              maxWidth: '850px',
              marginBottom: 'var(--space-lg)',
              lineHeight: 1.5
            }}
          >
            {project.subtitle}
          </p>

          <p style={{ fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: '900px', marginBottom: 'var(--space-lg)' }}>
            {caseStudy.overview}
          </p>

          {/* Quick Technology Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {project.technologies.map((tech) => (
              <span key={tech} className="tech-badge">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Large Project-Specific 3D Scene */}
        <div 
          className="tech-bracket"
          style={{
            position: 'relative',
            width: '100%',
            height: '480px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: '4px',
            marginBottom: 'var(--space-3xl)',
            overflow: 'hidden'
          }}
        >
          <ProjectVisual projectId={project.id} interactive={true} />
          
          <div 
            style={{
              position: 'absolute',
              top: '16px',
              left: '18px',
              pointerEvents: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 5
            }}
          >
            <span className="tech-status-dot" />
            <span>INTERACTIVE REAL-TIME 3D SIMULATION // {project.title}</span>
          </div>
        </div>

        {/* 12 STRUCTURED SECTIONS */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: 'var(--space-3xl)',
            position: 'relative'
          }}
          className="case-study-layout"
        >
          {/* Left Sticky Table of Contents */}
          <aside 
            style={{
              position: 'sticky',
              top: 'calc(var(--header-height) + 2rem)',
              height: 'fit-content',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
            className="case-study-sidebar"
          >
            <span className="tech-coord" style={{ color: 'var(--text-accent)', marginBottom: '4px' }}>
              INDEXED SECTIONS
            </span>
            {[
              { id: 'sec-01', label: '01 — OVERVIEW' },
              { id: 'sec-02', label: '02 — THE PROBLEM' },
              { id: 'sec-03', label: '03 — SYSTEM CONCEPT' },
              { id: 'sec-04', label: '04 — ARCHITECTURE' },
              { id: 'sec-05', label: '05 — HARDWARE' },
              { id: 'sec-06', label: '06 — SOFTWARE' },
              { id: 'sec-07', label: '07 — IMPLEMENTATION' },
              { id: 'sec-08', label: '08 — CHALLENGES' },
              { id: 'sec-09', label: '09 — RESULT' },
              { id: 'sec-10', label: '10 — TECH STACK' },
              { id: 'sec-11', label: '11 — PROJECT LINKS' },
              { id: 'sec-12', label: '12 — NEXT SYSTEM' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '4px 0',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {item.label}
              </a>
            ))}
          </aside>

          {/* Right Detailed Case Study Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3xl)' }}>
            {/* 02 — THE PROBLEM */}
            <section id="sec-02" style={{ scrollMarginTop: '100px' }}>
              <div className="section-pretitle">
                <span className="section-number">02 //</span>
                <span className="tech-label">ENGINEERING CONTEXT</span>
              </div>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 'var(--space-md)' }}>
                THE PROBLEM
              </h2>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                {caseStudy.problem}
              </p>
            </section>

            {/* 03 — SYSTEM CONCEPT */}
            <section id="sec-03" style={{ scrollMarginTop: '100px' }}>
              <div className="section-pretitle">
                <span className="section-number">03 //</span>
                <span className="tech-label">CORE LOGIC PIPELINE</span>
              </div>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 'var(--space-md)' }}>
                SYSTEM CONCEPT
              </h2>

              <p style={{ fontSize: '0.98rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                {caseStudy.concept}
              </p>

              {/* Visual Architecture Flow: INPUT → PROCESSING → DECISION → ACTION → OUTPUT */}
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: '3px',
                  padding: 'var(--space-lg)'
                }}
              >
                <div className="tech-coord" style={{ color: 'var(--text-accent)', marginBottom: '4px' }}>
                  INFORMATION FLOW ARCHITECTURE
                </div>
                {caseStudy.conceptFlow ? (
                  caseStudy.conceptFlow.map((cf) => (
                    <div 
                      key={cf.step}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '14px',
                        padding: '10px 14px',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px'
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-accent)', fontWeight: 700, minWidth: '80px' }}>
                        {cf.label}
                      </span>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        {cf.detail}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                    INPUT → PROCESSING → DECISION → ACTION → OUTPUT
                  </div>
                )}
              </div>
            </section>

            {/* 04 — SYSTEM ARCHITECTURE */}
            <section id="sec-04" style={{ scrollMarginTop: '100px' }}>
              <div className="section-pretitle">
                <span className="section-number">04 //</span>
                <span className="tech-label">TECHNICAL DIAGRAM & SUBSYSTEMS</span>
              </div>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 'var(--space-md)' }}>
                SYSTEM ARCHITECTURE
              </h2>

              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  margin: 'var(--space-lg) 0'
                }}
              >
                {caseStudy.architecture.subsystems ? (
                  caseStudy.architecture.subsystems.map((sub, idx) => (
                    <div 
                      key={idx}
                      className="tech-bracket"
                      style={{
                        padding: '14px 18px',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-accent)', fontWeight: 700 }}>
                          {sub.layer}
                        </span>
                        <span className="tech-coord">{sub.technologies}</span>
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        {sub.role}
                      </div>
                    </div>
                  ))
                ) : (
                  caseStudy.architecture.pipeline.map((step, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '12px 16px',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px'
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-accent)', fontWeight: 700 }}>
                        [STAGE 0{idx + 1}]
                      </span>
                      <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {step}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <p style={{ fontSize: '0.96rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                {caseStudy.architecture.details}
              </p>
            </section>

            {/* 05 — HARDWARE */}
            <section id="sec-05" style={{ scrollMarginTop: '100px' }}>
              <div className="section-pretitle">
                <span className="section-number">05 //</span>
                <span className="tech-label">PHYSICAL COMPONENTS & ICs</span>
              </div>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 'var(--space-md)' }}>
                HARDWARE SPECIFICATIONS
              </h2>

              <div 
                style={{
                  width: '100%',
                  overflowX: 'auto',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px'
                }}
              >
                <table 
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem'
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-medium)' }}>
                      <th style={{ padding: '12px 16px', color: 'var(--text-accent)' }}>COMPONENT / IC</th>
                      <th style={{ padding: '12px 16px', color: 'var(--text-accent)' }}>SUBSYSTEM ROLE</th>
                      <th style={{ padding: '12px 16px', color: 'var(--text-accent)' }}>TECHNICAL SPEC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseStudy.hardware.map((hw, idx) => (
                      <tr 
                        key={idx}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          backgroundColor: idx % 2 === 0 ? 'var(--bg-card)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>{hw.component}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{hw.role}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{hw.spec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 06 — SOFTWARE */}
            <section id="sec-06" style={{ scrollMarginTop: '100px' }}>
              <div className="section-pretitle">
                <span className="section-number">06 //</span>
                <span className="tech-label">FIRMWARE & RUNTIMES</span>
              </div>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 'var(--space-md)' }}>
                SOFTWARE ARCHITECTURE
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {caseStudy.software.map((sw, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '14px 18px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '2px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--text-accent)', fontWeight: 600 }}>
                        {sw.stack}
                      </span>
                      <span className="tech-coord">{sw.category}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {sw.details}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 07 — IMPLEMENTATION */}
            <section id="sec-07" style={{ scrollMarginTop: '100px' }}>
              <div className="section-pretitle">
                <span className="section-number">07 //</span>
                <span className="tech-label">PHYSICAL DEPLOYMENT & WORKFLOW</span>
              </div>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 'var(--space-md)' }}>
                IMPLEMENTATION WORKFLOW
              </h2>

              <p style={{ fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                {caseStudy.implementation}
              </p>

              {/* Workflow Steps: DESIGN → BUILD → INTEGRATE → TEST → DEPLOY */}
              {caseStudy.implementationWorkflow && (
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '10px'
                  }}
                >
                  {caseStudy.implementationWorkflow.map((st) => (
                    <div 
                      key={st.phase}
                      className="tech-bracket"
                      style={{
                        padding: '12px',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px'
                      }}
                    >
                      <div className="tech-coord" style={{ color: 'var(--text-accent)', marginBottom: '2px' }}>
                        {st.phase} // {st.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                        {st.action}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 08 — ENGINEERING CHALLENGES */}
            <section id="sec-08" style={{ scrollMarginTop: '100px' }}>
              <div className="section-pretitle">
                <span className="section-number">08 //</span>
                <span className="tech-label">DEBUGGING & RESILIENCE</span>
              </div>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 'var(--space-md)' }}>
                ENGINEERING CHALLENGES
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {caseStudy.challenges.map((ch, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '16px',
                      backgroundColor: 'rgba(251, 191, 36, 0.025)',
                      border: '1px solid rgba(251, 191, 36, 0.25)',
                      borderRadius: '3px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--status-warning)', fontWeight: 600 }}>
                        [CHALLENGE 0{idx + 1}] {ch.title}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '8px' }}>
                      <strong>Context:</strong> {ch.context}
                    </p>

                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, borderLeft: '2px solid var(--status-active)', paddingLeft: '10px' }}>
                      <span style={{ color: 'var(--status-active)', fontWeight: 600 }}>Engineering Mitigation: </span>
                      {ch.mitigation}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 09 — RESULT */}
            <section id="sec-09" style={{ scrollMarginTop: '100px' }}>
              <div className="section-pretitle">
                <span className="section-number">09 //</span>
                <span className="tech-label">METRICS & VALIDATION</span>
              </div>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 'var(--space-md)' }}>
                RESULT & BENCHMARKS
              </h2>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                {caseStudy.result.summary}
              </p>

              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px'
                }}
              >
                {caseStudy.result.metrics.map((m, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '2px'
                    }}
                  >
                    <div className="tech-coord">{m.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-accent)', marginTop: '4px' }}>
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 10 — TECHNICAL STACK */}
            <section id="sec-10" style={{ scrollMarginTop: '100px' }}>
              <div className="section-pretitle">
                <span className="section-number">10 //</span>
                <span className="tech-label">DEPLOYED TOOLCHAIN</span>
              </div>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 'var(--space-md)' }}>
                TECHNICAL STACK
              </h2>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.technologies.map((t) => (
                  <span key={t} className="tech-badge" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                    {t}
                  </span>
                ))}
              </div>
            </section>

            {/* 11 — PROJECT LINKS */}
            <section id="sec-11" style={{ scrollMarginTop: '100px' }}>
              <div className="section-pretitle">
                <span className="section-number">11 //</span>
                <span className="tech-label">ACCESS & REPOSITORIES</span>
              </div>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 'var(--space-md)' }}>
                PROJECT LINKS
              </h2>

              <div 
                className="tech-bracket"
                style={{
                  padding: 'var(--space-xl)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 'var(--space-md)'
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-accent)', marginBottom: '4px' }}>
                    SOURCE REPOSITORY & SCHEMATICS
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                    Firmware binaries, wiring pinouts, and models for {project.title}.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  {project.github && (
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <span>VIEW ON GITHUB</span>
                      <span className="btn-arrow">↗</span>
                    </a>
                  )}
                  {project.demo && (
                    <a 
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      <span>LIVE DEMO</span>
                      <span className="btn-arrow">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* 12 — NEXT PROJECT */}
            <section id="sec-12" style={{ scrollMarginTop: '100px' }}>
              <div className="section-pretitle">
                <span className="section-number">12 //</span>
                <span className="tech-label">SYSTEM TRANSITION</span>
              </div>

              <Link 
                to={`/work/${nextProject.id}`}
                className="tech-bracket"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-2xl)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  transition: 'border-color var(--transition-medium), transform var(--transition-medium)'
                }}
              >
                <div>
                  <div className="tech-coord" style={{ color: 'var(--text-accent)', marginBottom: '4px' }}>
                    NEXT CASE STUDY →
                  </div>
                  <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    {nextProject.title}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {nextProject.subtitle}
                  </div>
                </div>

                <div className="btn btn-primary" style={{ padding: '0.8rem 1.6rem' }}>
                  <span>INSPECT SYSTEM</span>
                  <span className="btn-arrow">→</span>
                </div>
              </Link>
            </section>
          </div>
        </div>
      </Container>

      <style>{`
        @media (max-width: 900px) {
          .case-study-layout {
            grid-template-columns: 1fr !important;
          }
          .case-study-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </article>
  );
};
