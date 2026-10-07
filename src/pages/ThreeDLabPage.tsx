import React, { useState } from 'react';
import { Container } from '../components/Container';
import { CadViewerScene } from '../scenes/CadViewerScene';
import { CadModelCard } from '../components/CadModelCard';
import { cadModelsData, type CadModelItem } from '../data/cadModelsData';

type FilterCategory = 'ALL' | 'ENCLOSURES' | 'MECHANICAL' | 'ROBOTICS';

export const ThreeDLabPage: React.FC = () => {
  const [selectedModelIndex, setSelectedModelIndex] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('ALL');

  const activeModel = cadModelsData[selectedModelIndex] || cadModelsData[0];

  // Minimal and clean category filtering
  const filteredModels = cadModelsData.filter((model) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'ENCLOSURES') {
      return (
        model.category.toLowerCase().includes('enclosure') ||
        model.category.toLowerCase().includes('cover') ||
        model.name.toLowerCase().includes('shell')
      );
    }
    if (activeCategory === 'MECHANICAL') {
      return (
        model.category.toLowerCase().includes('grip') ||
        model.category.toLowerCase().includes('coupling') ||
        model.category.toLowerCase().includes('retention') ||
        model.name.toLowerCase().includes('handle')
      );
    }
    if (activeCategory === 'ROBOTICS') {
      return (
        model.category.toLowerCase().includes('robotics') ||
        model.id.includes('rover') ||
        model.name.toLowerCase().includes('rover')
      );
    }
    return true;
  });

  const handleSelectModel = (model: CadModelItem) => {
    const originalIndex = cadModelsData.findIndex((m) => m.id === model.id);
    if (originalIndex !== -1) {
      setSelectedModelIndex(originalIndex);
    }
    // Smoothly scroll up into the 3D inspection studio
    const inspectorElem = document.getElementById('cad-inspector');
    if (inspectorElem) {
      inspectorElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
            <span>3D LAB // DIGITAL CAD WORKSHOP</span>
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

        {/* ============================================================
            1. CAD INSPECTION WORKSPACE (Prominent Detailed 3D Inspector)
            ============================================================ */}
        <section 
          id="cad-inspector"
          style={{
            scrollMarginTop: '110px',
            marginBottom: 'var(--space-4xl)'
          }}
        >
          {/* Active Inspection Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '10px 16px',
              backgroundColor: 'rgba(8, 9, 13, 0.85)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '3px',
              marginBottom: 'var(--space-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="tech-status-dot" />
              <span className="tech-coord" style={{ color: 'var(--text-accent)', fontSize: '0.74rem' }}>
                ACTIVE INSPECTION // {activeModel.cadCode}
              </span>
              <span style={{ color: 'var(--border-medium)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {activeModel.name.toUpperCase()}
              </span>
            </div>

            <a
              href="#model-library"
              className="tech-badge"
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              BROWSE ALL MODELS ↓
            </a>
          </div>

          {/* 3D Lab Workspace Layout: Left 3D Viewport, Right Technical Panel */}
          <div 
            className="cad-studio-layout"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.35fr 0.85fr',
              gap: 'var(--space-2xl)'
            }}
          >
            {/* Left Column: Interactive 3D Viewport */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <CadViewerScene
                model={activeModel}
                height="540px"
                showControls={true}
              />

              {/* Sub-viewport Telemetry Readout */}
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
            </div>

            {/* Right Column: Technical Information Panel */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                borderRadius: '4px',
                padding: 'var(--space-xl)',
                gap: 'var(--space-lg)'
              }}
            >
              {/* 1. MODEL INFORMATION */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="tech-coord" style={{ color: 'var(--text-accent)' }}>
                    MODEL INFORMATION // {activeModel.cadCode}
                  </span>
                  <span className="tech-status-dot" />
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {activeModel.name}
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {activeModel.description}
                </p>
              </div>

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

              {/* 2. ENGINEERING NOTES & DFA HIGHLIGHTS */}
              {activeModel.features && activeModel.features.length > 0 && (
                <div>
                  <span className="tech-coord" style={{ color: 'var(--text-accent)', marginBottom: '8px', display: 'block' }}>
                    ENGINEERING NOTES & DFA HIGHLIGHTS
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
                          marginBottom: '4px'
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
        </section>

        {/* ============================================================
            2. MODEL LIBRARY (Full Responsive Grid of 3D Model Cards)
            ============================================================ */}
        <section 
          id="model-library"
          style={{
            scrollMarginTop: '100px',
            marginBottom: 'var(--space-4xl)'
          }}
        >
          {/* Section Header */}
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <div className="section-pretitle" style={{ marginBottom: '6px' }}>
              <span className="section-number">CATALOG //</span>
              <span className="tech-label">INTERACTIVE 3D CAD LIBRARY</span>
            </div>

            <div 
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <h2 
                  style={{
                    fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    marginBottom: '4px'
                  }}
                >
                  MY 3D MODELS
                </h2>
                <p 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.06em'
                  }}
                >
                  CAD DESIGNS / PRODUCT SYSTEMS / ENGINEERING COMPONENTS
                </p>
              </div>

              {/* Minimal Category Filter Tabs */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(8, 9, 13, 0.7)',
                  padding: '4px',
                  borderRadius: '3px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {(['ALL', 'ENCLOSURES', 'MECHANICAL', 'ROBOTICS'] as FilterCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.08em',
                      padding: '6px 12px',
                      borderRadius: '2px',
                      backgroundColor: activeCategory === cat ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
                      border: activeCategory === cat ? '1px solid var(--border-accent-strong)' : '1px solid transparent',
                      color: activeCategory === cat ? 'var(--text-accent)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="section-divider" style={{ marginTop: 'var(--space-md)' }} />
          </div>

          {/* Responsive Model Library Grid */}
          <div className="model-library-grid">
            {filteredModels.map((model) => {
              const originalIndex = cadModelsData.findIndex((m) => m.id === model.id);
              const isSelected = originalIndex === selectedModelIndex;

              return (
                <CadModelCard
                  key={model.id}
                  model={model}
                  index={originalIndex !== -1 ? originalIndex : 0}
                  isSelected={isSelected}
                  onSelect={handleSelectModel}
                />
              );
            })}
          </div>
        </section>

        {/* ============================================================
            3. CAD → HARDWARE STORY TIMELINE
            ============================================================ */}
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

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Container>

      <style>{`
        /* Responsive CAD Studio Layout */
        @media (max-width: 992px) {
          .cad-studio-layout {
            grid-template-columns: 1fr !important;
            gap: var(--space-xl) !important;
          }
        }

        /* Responsive Model Library Grid */
        .model-library-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-xl);
        }

        @media (min-width: 1400px) {
          .model-library-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: var(--space-xl);
          }
        }

        @media (max-width: 1100px) {
          .model-library-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: var(--space-lg) !important;
          }
        }

        @media (max-width: 640px) {
          .model-library-grid {
            grid-template-columns: 1fr !important;
            gap: var(--space-md) !important;
          }
        }
      `}</style>
    </main>
  );
};
