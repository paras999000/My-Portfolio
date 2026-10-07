import React from 'react';

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
  type?: 'button' | 'submit' | 'reset';
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
  arrow = false,
  type = 'button'
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
    <button type={type} className={btnClasses} style={style} onClick={onClick}>
      {content}
    </button>
  );
};
