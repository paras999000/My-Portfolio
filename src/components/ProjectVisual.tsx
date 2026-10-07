import React, { Suspense } from 'react';
import { FridayScene } from '../scenes/FridayScene';
import { SafexScene } from '../scenes/SafexScene';
import { RoboticArmScene } from '../scenes/RoboticArmScene';
import { SmartParkingScene } from '../scenes/SmartParkingScene';

interface ProjectVisualProps {
  projectId: string;
  interactive?: boolean;
}

export const ProjectVisual: React.FC<ProjectVisualProps> = ({ projectId, interactive = true }) => {
  const renderVisual = () => {
    switch (projectId) {
      case 'friday':
        return <FridayScene interactive={interactive} />;
      case 'safex':
        return <SafexScene interactive={interactive} />;
      case 'robotic-arm':
        return <RoboticArmScene interactive={interactive} />;
      case 'smart-parking':
        return <SmartParkingScene interactive={interactive} />;
      default:
        return <FridayScene interactive={interactive} />;
    }
  };

  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      <Suspense 
        fallback={
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-accent)'
            }}
          >
            <span className="tech-status-dot" />
            INITIALIZING 3D ENGINE...
          </div>
        }
      >
        {renderVisual()}
      </Suspense>
    </div>
  );
};
