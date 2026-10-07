import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';

// Lazy-load all 12 project-specific 3D scenes for optimal performance
const FridayScene = lazy(() => import('../scenes/FridayScene').then(m => ({ default: m.FridayScene })));
const SafexScene = lazy(() => import('../scenes/SafexScene').then(m => ({ default: m.SafexScene })));
const RoboticArmScene = lazy(() => import('../scenes/RoboticArmScene').then(m => ({ default: m.RoboticArmScene })));
const SmartParkingScene = lazy(() => import('../scenes/SmartParkingScene').then(m => ({ default: m.SmartParkingScene })));
const SecurityAuditScene = lazy(() => import('../scenes/SecurityAuditScene').then(m => ({ default: m.SecurityAuditScene })));
const MediTraceScene = lazy(() => import('../scenes/MediTraceScene').then(m => ({ default: m.MediTraceScene })));
const DeployHubScene = lazy(() => import('../scenes/DeployHubScene').then(m => ({ default: m.DeployHubScene })));
const VeriSightScene = lazy(() => import('../scenes/VeriSightScene').then(m => ({ default: m.VeriSightScene })));
const CropSystemScene = lazy(() => import('../scenes/CropSystemScene').then(m => ({ default: m.CropSystemScene })));
const VoiceRouteScene = lazy(() => import('../scenes/VoiceRouteScene').then(m => ({ default: m.VoiceRouteScene })));
const ARMineScene = lazy(() => import('../scenes/ARMineScene').then(m => ({ default: m.ARMineScene })));
const SpeciesPredictionScene = lazy(() => import('../scenes/SpeciesPredictionScene').then(m => ({ default: m.SpeciesPredictionScene })));

interface ProjectVisualProps {
  projectId: string;
  interactive?: boolean;
  priority?: boolean;
}

export const ProjectVisual: React.FC<ProjectVisualProps> = ({ 
  projectId, 
  interactive = true,
  priority = false 
}) => {
  const [isVisible, setIsVisible] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  // High-Performance Dynamic WebGL Context Management:
  // Dynamically mounts 3D canvas when card enters viewport and cleanly unmounts
  // when leaving viewport. This strictly bounds concurrent WebGL contexts to <= 2-3,
  // preventing browser WebGL context exhaustion (error 0x0505) and tab crashes.
  useEffect(() => {
    if (priority) {
      setIsVisible(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        rootMargin: '20px 0px 20px 0px',
        threshold: 0.05
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

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
      case 'security-audit-vault':
        return <SecurityAuditScene interactive={interactive} />;
      case 'meditrace':
        return <MediTraceScene interactive={interactive} />;
      case 'deployhub':
        return <DeployHubScene interactive={interactive} />;
      case 'verisight-nx':
        return <VeriSightScene interactive={interactive} />;
      case 'crop-recommendation':
        return <CropSystemScene interactive={interactive} />;
      case 'voice-ai-route-finder':
        return <VoiceRouteScene interactive={interactive} />;
      case 'ar-mine':
        return <ARMineScene interactive={interactive} />;
      case 'endangered-species':
        return <SpeciesPredictionScene interactive={interactive} />;
      default:
        return <FridayScene interactive={interactive} />;
    }
  };

  return (
    <div 
      ref={containerRef}
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
      {isVisible ? (
        <Suspense 
          fallback={
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-accent)',
                letterSpacing: '0.08em'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="tech-status-dot" />
                <span>MOUNTING 3D PIPELINE...</span>
              </div>
            </div>
          }
        >
          {renderVisual()}
        </Suspense>
      ) : (
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.70rem',
            color: 'var(--text-dim)',
            letterSpacing: '0.08em',
            padding: '24px',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="tech-status-dot idle" />
            <span>3D PIPELINE STANDBY</span>
          </div>
          <span style={{ fontSize: '0.62rem', color: 'rgba(148, 163, 184, 0.5)' }}>
            SCROLL INTO VIEW TO ENGAGE REAL-TIME RENDERER
          </span>
        </div>
      )}
    </div>
  );
};
