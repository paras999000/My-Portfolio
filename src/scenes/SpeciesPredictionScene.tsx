import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createStudioGround, setupStudioLighting } from './threeUtils';

interface SpeciesPredictionSceneProps {
  interactive?: boolean;
}

export const SpeciesPredictionScene: React.FC<SpeciesPredictionSceneProps> = ({ interactive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      return;
    }

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 380;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c1017, 0.04);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(3.4, 2.8, 4.4);
    camera.lookAt(0, 0.3, 0);

    setupStudioLighting(scene);
    createStudioGround(scene, 5.0, 5.0, -0.75, 2.2);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- MATERIALS (SCIENTIFIC ECOLOGICAL AESTHETICS - NOT CYBERPUNK) ---
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x1a2634,
      roughness: 0.8,
      metalness: 0.1
    });
    const gridLineMat = new THREE.LineBasicMaterial({
      color: 0x334e68,
      transparent: true,
      opacity: 0.4
    });
    const habitatClusterMat = new THREE.MeshStandardMaterial({
      color: 0x10b981, // Restorative botanical green
      roughness: 0.4,
      metalness: 0.2
    });
    const riskClusterMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber ecological concern
      roughness: 0.4,
      metalness: 0.2
    });

    // --- 1. SCIENTIFIC BIOSPHERE / GEOGRAPHIC TOPOLOGY GLOBE ---
    const globeGeo = new THREE.SphereGeometry(1.2, 32, 24);
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.position.y = 0.35;
    rootGroup.add(globe);

    // Geographic Latitude & Longitude Wireframe Rings
    const wireGeo = new THREE.WireframeGeometry(globeGeo);
    const wireframe = new THREE.LineSegments(wireGeo, gridLineMat);
    wireframe.position.y = 0.35;
    rootGroup.add(wireframe);

    // Scientific Equatorial Coordinate Ring
    const eqRingGeo = new THREE.RingGeometry(1.35, 1.38, 48);
    const eqRingMat = new THREE.MeshBasicMaterial({ color: 0x486581, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const eqRing = new THREE.Mesh(eqRingGeo, eqRingMat);
    eqRing.rotation.x = Math.PI / 2;
    eqRing.position.y = 0.35;
    rootGroup.add(eqRing);

    // --- 2. SPECIES HABITAT DENSITY CLUSTER MARKERS (DATA LAYER) ---
    const clusterCoords = [
      { lat: 0.4, lon: 0.6, risk: false },
      { lat: 0.2, lon: 1.1, risk: true },
      { lat: -0.3, lon: 0.8, risk: false },
      { lat: 0.6, lon: -0.4, risk: false },
      { lat: -0.5, lon: -0.7, risk: true },
      { lat: 0.1, lon: -1.2, risk: false },
      { lat: -0.2, lon: 2.1, risk: true },
      { lat: 0.7, lon: 1.8, risk: false }
    ];

    const clusters: THREE.Mesh[] = [];
    clusterCoords.forEach((c) => {
      const r = 1.22;
      const x = r * Math.cos(c.lat) * Math.sin(c.lon);
      const y = 0.35 + r * Math.sin(c.lat);
      const z = r * Math.cos(c.lat) * Math.cos(c.lon);

      const marker = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.04, 0.14, 8),
        c.risk ? riskClusterMat : habitatClusterMat
      );
      marker.position.set(x, y, z);
      // Orient normal to globe surface
      marker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(x, y - 0.35, z).normalize());
      rootGroup.add(marker);
      clusters.push(marker);
    });

    // --- 3. POPULATION TRAJECTORY PREDICTION CURVE (MODEL -> PREDICTION) ---
    // A 3D trajectory curve showing regression trend
    const curvePoints = [
      new THREE.Vector3(-1.4, -0.3, 0.8),   // Historical baseline
      new THREE.Vector3(-0.9, -0.05, 0.9),  // Field observation
      new THREE.Vector3(-0.3, 0.25, 0.95),  // Current census
      new THREE.Vector3(0.4, 0.6, 0.9),     // Machine learning prediction
      new THREE.Vector3(1.1, 0.95, 0.7)     // Recommended recovery target
    ];
    const trendCurve = new THREE.CatmullRomCurve3(curvePoints);
    const trendGeo = new THREE.TubeGeometry(trendCurve, 32, 0.02, 8, false);
    const trendMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
      metalness: 0.5
    });
    const trendTube = new THREE.Mesh(trendGeo, trendMat);
    rootGroup.add(trendTube);

    // Prediction Waypoint Spheres on the curve
    curvePoints.forEach((pt, idx) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 12, 12),
        idx >= 3 ? riskClusterMat : habitatClusterMat
      );
      sphere.position.copy(pt);
      rootGroup.add(sphere);
    });

    // --- 4. CONSERVATION RECOMMENDATION BOUNDARY CONE (RECOMMENDATION) ---
    // Targeted sanctuary protected zone
    const recZoneGeo = new THREE.ConeGeometry(0.4, 0.6, 16, 1, true);
    const recZoneMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const recZone = new THREE.Mesh(recZoneGeo, recZoneMat);
    recZone.position.set(1.1, 0.95, 0.7);
    recZone.rotation.x = Math.PI / 4;
    rootGroup.add(recZone);

    // Animation & Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let animId: number;
    const startTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    // Performance: Pause render loop when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const elapsed = (performance.now() - startTime) / 1000;

      // Mouse Parallax
      rootGroup.rotation.y += (mouseX * 0.3 - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (mouseY * 0.15 - rootGroup.rotation.x) * 0.05;

      // Gentle planetary axial rotation for scientific visualization
      globe.rotation.y = elapsed * 0.15;
      wireframe.rotation.y = elapsed * 0.15;

      // Pulse recommendation zone
      recZone.rotation.y = elapsed * 0.4;
      const zoneScale = 1 + Math.sin(elapsed * 2) * 0.08;
      recZone.scale.set(zoneScale, zoneScale, zoneScale);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 480;
      const h = container.clientHeight || 380;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      globeGeo.dispose();
      eqRingGeo.dispose();
      trendGeo.dispose();
      recZoneGeo.dispose();
    };
  }, [interactive]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      {/* Engineering HUD Telemetry */}
      <div 
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--text-accent)',
          background: 'rgba(8, 9, 13, 0.88)',
          padding: '4px 10px',
          borderRadius: '2px',
          border: '1px solid var(--border-subtle)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span className="tech-status-dot" />
        <span>FLOW: SPECIES DATA → MODEL → PREDICTION → RECOMMENDATION</span>
      </div>

      <div 
        style={{
          position: 'absolute',
          top: '12px',
          right: '14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          background: 'rgba(8, 9, 13, 0.75)',
          padding: '3px 8px',
          border: '1px solid var(--border-subtle)',
          borderRadius: '2px',
          pointerEvents: 'none',
          textAlign: 'right'
        }}
      >
        <div>IUCN RED LIST CENSUS DATA</div>
        <div style={{ color: 'var(--color-success)' }}>SUPABASE POSTGRESQL // RECOVERY VECTORS</div>
      </div>

      <div 
        style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-dim)',
          pointerEvents: 'none'
        }}
      >
        ECOPREDICT AI // CONSERVATION INTELLIGENCE
      </div>
    </div>
  );
};
