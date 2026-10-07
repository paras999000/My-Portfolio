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
