import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '', style, id }) => {
  return (
    <div id={id} className={`container ${className}`} style={style}>
      {children}
    </div>
  );
};

interface TechnicalLabelProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'warning' | 'active';
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const TechnicalLabel: React.FC<TechnicalLabelProps> = ({
  children,
  variant = 'accent',
  dot = false,
  className = '',
  style
}) => {
  const getDotClass = () => {
    if (variant === 'active') return 'tech-status-dot';
    if (variant === 'warning') return 'tech-status-dot warning';
    if (variant === 'secondary') return 'tech-status-dot idle';
    return 'tech-status-dot';
  };

  return (
    <span className={`tech-label ${variant === 'secondary' ? 'tech-label-secondary' : ''} ${className}`} style={style}>
      {dot && <span className={getDotClass()} />}
      {children}
    </span>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  target?: string;
  rel?: string;
  arrow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  style,
  target,
  rel,
  arrow = false
}) => {
  const content = (
    <>
      <span>{children}</span>
      {arrow && <span className="btn-arrow">→</span>}
    </>
  );

  const btnClasses = `btn btn-${variant} ${className}`;

  if (href) {
    return (
      <a href={href} className={btnClasses} style={style} target={target} rel={rel} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button className={btnClasses} style={style} onClick={onClick}>
      {content}
    </button>
  );
};
