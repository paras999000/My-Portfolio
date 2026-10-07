import React, { useState } from 'react';
import type { CadModelItem } from '../data/cadModelsData';
import { CadThumbnailPreview } from '../scenes/CadThumbnailPreview';

interface CadModelCardProps {
  model: CadModelItem;
  index: number;
  isSelected?: boolean;
  onSelect: (model: CadModelItem, index: number) => void;
}

export const CadModelCard: React.FC<CadModelCardProps> = ({
  model,
  index,
  isSelected = false,
  onSelect
}) => {
  const [hovered, setHovered] = useState(false);

  const displayIndex = index < 9 ? `0${index + 1}` : `${index + 1}`;

  return (
    <article
      className="cad-model-card tech-bracket"
      onClick={() => onSelect(model, index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: hovered ? '#11151f' : '#0d1118',
        border: isSelected 
          ? '1px solid var(--border-accent-strong)' 
          : hovered 
            ? '1px solid var(--border-accent)' 
            : '1px solid var(--border-subtle)',
        borderRadius: '3px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 200ms ease, border-color 200ms ease, background-color 200ms ease, box-shadow 200ms ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered 
          ? '0 14px 30px -10px rgba(0, 0, 0, 0.75), 0 0 20px -8px rgba(56, 189, 248, 0.25)' 
          : isSelected
            ? '0 0 16px -6px rgba(56, 189, 248, 0.3)'
            : 'none',
        position: 'relative'
      }}
    >
      {/* Top Header Strip: Index & CAD Code */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px 6px 14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: isSelected ? 'var(--text-accent)' : 'var(--text-secondary)'
            }}
          >
            {displayIndex}
          </span>
          <span style={{ color: 'var(--border-subtle)', fontSize: '0.75rem' }}>//</span>
          <span
            className="tech-coord"
            style={{
              color: hovered ? 'var(--text-accent)' : 'var(--text-dim)',
              fontSize: '0.65rem'
            }}
          >
            {model.cadCode}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isSelected && (
            <span
              className="tech-badge"
              style={{
                fontSize: '0.6rem',
                padding: '1px 6px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--text-accent)'
              }}
            >
              ACTIVE
            </span>
          )}
          <span
            className="tech-status-dot"
            style={{
              backgroundColor: isSelected ? 'var(--status-active)' : 'var(--border-medium)',
              animation: isSelected ? 'pulseDot 2.4s infinite ease-in-out' : 'none'
            }}
          />
        </div>
      </div>

      {/* Center: Real 3D Model Viewport Preview */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '210px',
          backgroundColor: '#0a0d14',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          overflow: 'hidden'
        }}
      >
        <CadThumbnailPreview
          model={model}
          isHovered={hovered}
          height="210px"
        />

        {/* Viewport Reticle Ticks */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'var(--text-dim)',
            pointerEvents: 'none'
          }}
        >
          STL / 3D SOLID
        </div>
      </div>

      {/* Bottom Metadata & CTA */}
      <div
        style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.96rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              marginBottom: '3px',
              lineHeight: 1.25
            }}
          >
            {model.name}
          </h3>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: hovered ? 'var(--text-accent)' : 'var(--text-secondary)'
            }}
          >
            <span>CAD</span>
            <span style={{ color: 'var(--border-medium)' }}>/</span>
            <span>{model.category.toUpperCase()}</span>
          </div>
        </div>

        {/* Dimensions & Material Specification */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            padding: '6px 8px',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            borderRadius: '2px',
            border: '1px solid rgba(255, 255, 255, 0.03)'
          }}
        >
          <span>DIMENSIONS:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            {model.dimensions}
          </span>
        </div>

        {/* CTA Button */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: hovered ? 'var(--text-accent)' : 'var(--text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color var(--transition-fast)'
            }}
          >
            <span>VIEW MODEL</span>
            <span
              style={{
                transform: hovered ? 'translateX(4px)' : 'translateX(0)',
                transition: 'transform var(--transition-fast)'
              }}
            >
              →
            </span>
          </span>

          <span
            className="tech-coord"
            style={{
              fontSize: '0.62rem',
              opacity: hovered ? 1 : 0.6
            }}
          >
            {model.material.split('/')[0].trim()}
          </span>
        </div>
      </div>
    </article>
  );
};
