import React, { useState } from 'react';
import { Container } from '../components/Container';
import { CadViewerScene } from '../scenes/CadViewerScene';
import { cadModelsData } from '../data/cadModelsData';

export const ThreeDLabPage: React.FC = () => {
  const [selectedModelIndex, setSelectedModelIndex] = useState<number>(0);
  const activeModel = cadModelsData[selectedModelIndex];

  return (
    <main style={{ paddingTop: 'calc(var(--header-height) + 2rem)', paddingBottom: 'var(--space-4xl)' }}>
      <Container>
        {/* 3D Lab Workshop Hero Header */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--text-accent)',
              letterSpacing: '0.14em',
              marginBottom: 'var(--space-xs)'
            }}
          >
            <span className="tech-status-dot" />
            <span>3D LAB // DIGITAL WORKSHOP</span>
          </div>

          <h1 
            style={{
              fontSize: 'clamp(2.4rem, 4.6vw, 3.8rem)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              marginBottom: 'var(--space-sm)'
            }}
          >
            DESIGNED IN CAD.<br />
            BUILT FOR THE REAL WORLD.
          </h1>

          <p 
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              maxWidth: '820px',
              lineHeight: 1.6
            }}
          >
            A collection of physical systems, product enclosures and mechanical designs developed through CAD, electronics integration and real-world fabrication.
          </p>

          <div className="section-divider" style={{ marginTop: 'var(--space-lg)' }} />
        </div>

        {/* 3D LAB MAIN WORKSPACE (Desktop: Left 3D Viewport, Right Technical Panel) */}
        <div 
          className="cad-studio-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.35fr 0.85fr',
            gap: 'var(--space-2xl)',
            marginBottom: 'var(--space-3xl)'
          }}
        >
          {/* Left Column: Interactive 3D Viewport */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <CadViewerScene
              model={activeModel}
              height="540px"
              showControls={true}
            />

            {/* Sub-viewport Telemetry & Navigation */}
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-muted)'
              }}
            >
              <span>ENGINEERING PROTOCOL: 3-AXIS ORBIT // TOUCH ZOOM COMPLIANT</span>
              <span className="tech-coord" style={{ color: 'var(--text-accent)' }}>
                LOADED: {activeModel.name.toUpperCase()}
              </span>
            </div>

            {/* Model Selector Pill Tabs */}
            <div 
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
                marginTop: '4px'
              }}
            >
              {cadModelsData.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModelIndex(idx)}
                  className="tech-badge"
                  style={{
                    backgroundColor: selectedModelIndex === idx ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: selectedModelIndex === idx ? 'var(--border-accent-strong)' : 'var(--border-subtle)',
                    color: selectedModelIndex === idx ? 'var(--text-accent)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '8px 14px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', marginRight: '6px' }}>0{idx + 1}</span>
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Technical Information Panel (Only shows available metadata) */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: '4px',
              padding: 'var(--space-xl)',
              gap: 'var(--space-md)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="tech-coord" style={{ color: 'var(--text-accent)' }}>
                  {activeModel.cadCode}
                </span>
                <span className="tech-status-dot" />
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {activeModel.name}
              </h2>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {activeModel.description}
            </p>

            {/* Factual Technical Specifications Table */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '3px',
                padding: '14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem'
              }}
            >
              {activeModel.name && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span className="tech-coord">MODEL:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{activeModel.name}</span>
                </div>
              )}

              {activeModel.category && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span className="tech-coord">CATEGORY:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{activeModel.category}</span>
                </div>
              )}

              {activeModel.designedIn && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span className="tech-coord">DESIGNED IN:</span>
                  <span style={{ color: 'var(--text-accent)' }}>{activeModel.designedIn}</span>
                </div>
              )}

              {activeModel.manufacturing && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span className="tech-coord">MANUFACTURING:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{activeModel.manufacturing}</span>
                </div>
              )}

              {activeModel.material && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span className="tech-coord">MATERIAL:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{activeModel.material}</span>
                </div>
              )}

              {activeModel.dimensions && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span className="tech-coord">DIMENSIONS:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{activeModel.dimensions}</span>
                </div>
              )}

              {activeModel.electronics && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span className="tech-coord">ELECTRONICS INTEGRATION:</span>
                  <span style={{ color: 'var(--text-accent)' }}>{activeModel.electronics}</span>
                </div>
              )}

              {activeModel.status && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="tech-coord">STATUS:</span>
                  <span style={{ color: 'var(--status-active)' }}>{activeModel.status}</span>
                </div>
              )}
            </div>

            {/* Design for Assembly (DFA) Highlights */}
            {activeModel.features && activeModel.features.length > 0 && (
              <div>
                <span className="tech-coord" style={{ color: 'var(--text-accent)', marginBottom: '6px', display: 'block' }}>
                  DESIGN FOR ASSEMBLY (DFA) HIGHLIGHTS
                </span>
                <ul style={{ paddingLeft: '16px', margin: 0 }}>
                  {activeModel.features.map((feat, fIdx) => (
                    <li 
                      key={fIdx}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.55,
                        marginBottom: '3px'
                      }}
                    >
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* CAD → HARDWARE STORY TIMELINE */}
        <section 
          style={{
            marginTop: 'var(--space-3xl)',
            padding: 'var(--space-2xl)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px'
          }}
        >
          <div className="section-pretitle" style={{ marginBottom: 'var(--space-md)' }}>
            <span className="section-number">FABRICATION LOG //</span>
            <span className="tech-label">CAD → HARDWARE PIPELINE</span>
          </div>

          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            FROM 3D DIGITAL SOLIDS TO PHYSICAL HARDWARE.
          </h3>
          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: '780px' }}>
            &ldquo;I don&apos;t only design screens. I design physical systems.&rdquo; Every component follows a rigorous pipeline from parametric spline mathematics to heat-set threading and live electronics integration.
          </p>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-lg)'
            }}
          >
            {activeModel.hardwareStory.map((st) => (
              <div 
                key={st.step}
                className="tech-bracket"
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-accent)', fontWeight: 700 }}>
                    STAGE {st.step}
                  </span>
                  <span className="tech-coord">VERIFIED</span>
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {st.title}
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Container>

      <style>{`
        @media (max-width: 960px) {
          .cad-studio-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
};
