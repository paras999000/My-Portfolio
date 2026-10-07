import React, { useState } from 'react';
import { Container } from '../components/Container';
import { SectionHeading } from '../components/SectionHeading';
import { CadViewerScene } from '../scenes/CadViewerScene';
import { cadModelsData } from '../data/cadModelsData';

export const ThreeDLabPage: React.FC = () => {
  const [selectedModelIndex, setSelectedModelIndex] = useState<number>(0);
  const activeModel = cadModelsData[selectedModelIndex];

  return (
    <main style={{ paddingTop: 'calc(var(--header-height) + 2rem)', paddingBottom: 'var(--space-4xl)' }}>
      <Container>
        <SectionHeading
          number="LAB // 02"
          pretitle="DIGITAL FABRICATION & HARDWARE ENCLOSURES"
          title="DESIGNED IN CAD. BUILT FOR THE REAL WORLD."
          description="A collection of my physical product designs, enclosures and mechanical systems created in CAD and prepared for real-world fabrication."
        />

        {/* CAD Viewer Studio Stage */}
        <div 
          className="cad-studio-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 0.8fr',
            gap: 'var(--space-2xl)',
            marginBottom: 'var(--space-3xl)'
          }}
        >
          {/* Main 3D Canvas */}
          <div style={{ position: 'relative' }}>
            <CadViewerScene
              model={activeModel}
              height="520px"
              showControls={true}
            />

            {/* Sub-label under viewer */}
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-muted)'
              }}
            >
              <span>INTERACTIVE WEBGL MESH INSPECTOR</span>
              <span>GEOMETRY: {activeModel.fileType.toUpperCase()} DATA SOURCE</span>
            </div>
          </div>

          {/* Technical Spec Sheet & Feature Matrix */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: '3px',
              padding: 'var(--space-xl)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="tech-coord" style={{ color: 'var(--text-accent)' }}>
                {activeModel.cadCode}
              </span>
              <span className="tech-badge" style={{ fontSize: '0.68rem' }}>
                {activeModel.category}
              </span>
            </div>

            <h2 style={{ fontSize: '1.7rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {activeModel.name}
            </h2>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-lg)' }}>
              {activeModel.description}
            </p>

            {/* Spec Matrix */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                padding: '14px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                marginBottom: 'var(--space-lg)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem'
              }}
            >
              <div>
                <span className="tech-coord">DIMENSIONS</span>
                <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{activeModel.dimensions}</div>
              </div>
              <div>
                <span className="tech-coord">EST. VOLUME</span>
                <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{activeModel.volume}</div>
              </div>
              <div>
                <span className="tech-coord">MATERIAL</span>
                <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{activeModel.material}</div>
              </div>
              <div>
                <span className="tech-coord">INFILL DENSITY</span>
                <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{activeModel.infill}</div>
              </div>
              <div>
                <span className="tech-coord">LAYER HEIGHT</span>
                <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{activeModel.layerHeight}</div>
              </div>
              <div>
                <span className="tech-coord">PRINT TIME</span>
                <div style={{ color: 'var(--status-active)', marginTop: '2px' }}>{activeModel.estimatedPrintTime}</div>
              </div>
            </div>

            {/* Engineering Features */}
            <div>
              <div className="tech-coord" style={{ color: 'var(--text-accent)', marginBottom: '8px' }}>
                DESIGN FOR FABRICATION (DFA) HIGHLIGHTS
              </div>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                {activeModel.features.map((feat, fIdx) => (
                  <li 
                    key={fIdx}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '4px'
                    }}
                  >
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CAD Component Catalog Cards */}
        <div>
          <div className="section-pretitle" style={{ marginBottom: 'var(--space-md)' }}>
            <span className="tech-label">CATALOGUE // 4 COMPONENTS</span>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-md)'
            }}
          >
            {cadModelsData.map((m, idx) => (
              <div 
                key={m.id}
                onClick={() => setSelectedModelIndex(idx)}
                className="tech-bracket"
                style={{
                  padding: 'var(--space-lg)',
                  backgroundColor: selectedModelIndex === idx ? 'var(--bg-surface-elevated)' : 'var(--bg-card)',
                  border: selectedModelIndex === idx ? '1px solid var(--border-accent)' : '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="tech-coord" style={{ color: selectedModelIndex === idx ? 'var(--text-accent)' : 'var(--text-muted)' }}>
                    {m.cadCode}
                  </span>
                  <span className="tech-coord">{m.dimensions}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {m.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '8px' }}>
                  {m.category} · {m.material}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="tech-badge" style={{ fontSize: '0.65rem' }}>
                    {m.tolerances}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-accent)' }}>
                    {selectedModelIndex === idx ? '● LOADED' : 'INSPECT →'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
