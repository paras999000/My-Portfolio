import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/Container';
import { SectionHeading } from '../components/SectionHeading';
import { CadViewerScene } from '../scenes/CadViewerScene';
import { cadModelsData } from '../data/cadModelsData';

export const ThreeDLabSection: React.FC = () => {
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const activeModel = cadModelsData[activeModelIndex];

  return (
    <section 
      id="3d-lab-preview"
      style={{
        position: 'relative',
        paddingTop: 'var(--space-4xl)',
        paddingBottom: 'var(--space-4xl)',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(10, 12, 17, 0.4)'
      }}
    >
      <Container>
        <SectionHeading
          number="02 //"
          pretitle="3D LAB PREVIEW"
          title="DESIGNED IN CAD. BUILT FOR THE REAL WORLD."
          description="A collection of my physical product designs, enclosures and mechanical systems created in CAD and prepared for real-world fabrication."
        />

        <div 
          className="cad-lab-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 'var(--space-2xl)',
            alignItems: 'center',
            marginTop: 'var(--space-xl)'
          }}
        >
          {/* Main Interactive CAD Viewer */}
          <div style={{ position: 'relative' }}>
            <CadViewerScene 
              model={activeModel}
              height="440px"
              showControls={true}
            />

            {/* Model Selector Tabs */}
            <div 
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '12px',
                overflowX: 'auto',
                paddingBottom: '4px'
              }}
            >
              {cadModelsData.slice(0, 3).map((mod, idx) => (
                <button
                  key={mod.id}
                  onClick={() => setActiveModelIndex(idx)}
                  className="tech-badge"
                  style={{
                    backgroundColor: activeModelIndex === idx ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: activeModelIndex === idx ? 'var(--border-accent-strong)' : 'var(--border-subtle)',
                    color: activeModelIndex === idx ? 'var(--text-accent)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '6px 12px'
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>0{idx + 1}</span>
                  <span>{mod.name.split(' ')[0]} {mod.name.split(' ')[1] || ''}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Model Specification Details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: 'var(--space-xs)'
              }}
            >
              <span className="tech-coord" style={{ color: 'var(--text-accent)' }}>
                {activeModel.cadCode}
              </span>
              <span style={{ color: 'var(--border-medium)' }}>//</span>
              <span className="tech-coord">{activeModel.category}</span>
            </div>

            <h3 
              style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-sm)'
              }}
            >
              {activeModel.name}
            </h3>

            <p 
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: 'var(--space-lg)'
              }}
            >
              {activeModel.description}
            </p>

            {/* Technical Specifications Grid */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: 'var(--space-xl)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '3px',
                padding: '14px'
              }}
            >
              <div>
                <span className="tech-coord">MATERIAL</span>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {activeModel.material}
                </p>
              </div>

              <div>
                <span className="tech-coord">DIMENSIONS</span>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {activeModel.dimensions}
                </p>
              </div>

              <div>
                <span className="tech-coord">INFILL & LAYER</span>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {activeModel.infill} · {activeModel.layerHeight}
                </p>
              </div>

              <div>
                <span className="tech-coord">TOLERANCES</span>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-accent)', marginTop: '2px' }}>
                  {activeModel.tolerances}
                </p>
              </div>
            </div>

            {/* CTA to Full 3D Lab */}
            <div>
              <Link 
                to="/3d-lab"
                className="btn btn-primary"
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.82rem'
                }}
              >
                <span>ENTER 3D LAB</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        @media (max-width: 960px) {
          .cad-lab-grid {
            grid-template-columns: 1fr !important;
            gap: var(--space-xl) !important;
          }
        }
      `}</style>
    </section>
  );
};
