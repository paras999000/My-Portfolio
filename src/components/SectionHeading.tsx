import React from 'react';

interface SectionHeadingProps {
  number?: string;
  pretitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  number,
  pretitle,
  title,
  description,
  align = 'left',
  className = ''
}) => {
  return (
    <div 
      className={`section-heading-container ${className}`}
      style={{
        textAlign: align,
        alignItems: align === 'center' ? 'center' : 'flex-start',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="section-pretitle">
        {number && <span className="section-number">{number}</span>}
        {pretitle && (
          <span className="tech-label" style={{ fontSize: '0.75rem' }}>
            {pretitle}
          </span>
        )}
      </div>

      <h2 className="section-title">
        {title}
      </h2>

      {description && (
        <p className="section-desc">
          {description}
        </p>
      )}

      <div className="section-divider" />
    </div>
  );
};
