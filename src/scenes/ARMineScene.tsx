import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createStudioGround, setupStudioLighting } from './threeUtils';

interface ARMineSceneProps {
  interactive?: boolean;
}

export const ARMineScene: React.FC<ARMineSceneProps> = ({ interactive = true }) => {
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
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0d14, 0.05);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(3.8, 3.2, 4.6);
    camera.lookAt(0, 0.2, 0);

    setupStudioLighting(scene);
    createStudioGround(scene, 5.0, 5.0, -0.75, 2.4);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- MATERIALS ---
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x1a202c,
      roughness: 0.9,
      metalness: 0.1
    });
    const steelRibMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Industrial safety amber/orange steel
      roughness: 0.35,
      metalness: 0.8
    });
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.3,
      metalness: 0.9
    });
    const arGridMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });

    // --- 1. INDUSTRIAL MINE SHAFT SEGMENT ---
    // Ground rock floor
    const floorGeo = new THREE.BoxGeometry(2.8, 0.15, 3.2);
    const floor = new THREE.Mesh(floorGeo, rockMat);
    floor.position.y = -0.7;
    rootGroup.add(floor);

    // Mining rail tracks along Z axis
    for (let r = -1; r <= 1; r += 2) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 3.0), railMat);
      rail.position.set(r * 0.45, -0.6, 0);
      rootGroup.add(rail);
    }
    // Wooden cross ties (sleepers)
    for (let s = -4; s <= 4; s++) {
      const tie = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 0.12), new THREE.MeshStandardMaterial({ color: 0x27201c, roughness: 0.8 }));
      tie.position.set(0, -0.61, s * 0.35);
      rootGroup.add(tie);
    }

    // Heavy Industrial Arch Steel Support Ribs (3 arch frames)
    for (let a = -1; a <= 1; a++) {
      const archGroup = new THREE.Group();
      archGroup.position.z = a * 0.95;

      // Left column
      const leftCol = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 0.1), steelRibMat);
      leftCol.position.set(-1.15, 0.1, 0);
      archGroup.add(leftCol);

      // Right column
      const rightCol = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 0.1), steelRibMat);
      rightCol.position.set(1.15, 0.1, 0);
      archGroup.add(rightCol);

      // Top crossbeam
      const topBeam = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.12, 0.1), steelRibMat);
      topBeam.position.set(0, 0.8, 0);
      archGroup.add(topBeam);

      rootGroup.add(archGroup);
    }

    // --- 2. AR SPATIAL SURFACE TRACKING PLANE & RETICLES ---
    // Detected AR ground plane mesh
    const arPlaneGeo = new THREE.PlaneGeometry(1.8, 2.2, 8, 10);
    const arPlane = new THREE.Mesh(arPlaneGeo, arGridMat);
    arPlane.rotation.x = -Math.PI / 2;
    arPlane.position.y = -0.58;
    rootGroup.add(arPlane);

    // 3D Spatial Anchor Coordinate Frame Gizmo at Origin
    const anchorGroup = new THREE.Group();
    anchorGroup.position.set(0, -0.55, 0);
    rootGroup.add(anchorGroup);

    // X Axis (Red)
    const xArrow = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    xArrow.rotation.z = -Math.PI / 2;
    xArrow.position.x = 0.2;
    anchorGroup.add(xArrow);

    // Y Axis (Green)
    const yArrow = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    yArrow.position.y = 0.2;
    anchorGroup.add(yArrow);

    // Z Axis (Blue)
    const zArrow = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
    zArrow.rotation.x = Math.PI / 2;
    zArrow.position.z = 0.2;
    anchorGroup.add(zArrow);

    // Holographic 1:1 Scale Virtual Asset Placement Box
    const assetBoxGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const assetBoxMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
    const assetBox = new THREE.Mesh(assetBoxGeo, assetBoxMat);
    assetBox.position.set(0, -0.15, 0);
    rootGroup.add(assetBox);

    // SLAM Feature Tracking Point Markers (Scattered floating points)
    const ptsGeo = new THREE.BufferGeometry();
    const ptCoords: number[] = [];
    for (let p = 0; p < 24; p++) {
      ptCoords.push((Math.random() - 0.5) * 2.2);
      ptCoords.push(-0.55 + Math.random() * 0.9);
      ptCoords.push((Math.random() - 0.5) * 2.4);
    }
    ptsGeo.setAttribute('position', new THREE.Float32BufferAttribute(ptCoords, 3));
    const ptsMat = new THREE.PointsMaterial({ color: 0xfacc15, size: 0.05 });
    const pointsMesh = new THREE.Points(ptsGeo, ptsMat);
    rootGroup.add(pointsMesh);

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

      // Pulse AR plane opacity and position
      arGridMat.opacity = 0.45 + Math.sin(elapsed * 3) * 0.2;

      // Bob & rotate 1:1 scale virtual asset placement box
      assetBox.rotation.y = elapsed * 0.5;
      assetBox.position.y = -0.15 + Math.sin(elapsed * 2) * 0.05;

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
      floorGeo.dispose();
      arPlaneGeo.dispose();
      assetBoxGeo.dispose();
      ptsGeo.dispose();
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
        <span>ARCORE SLAM PLANE DETECTION // SPATIAL ANCHOR: 1:1 SCALE LOCKED</span>
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
        <div>UNITY 6 + AR FOUNDATION 6.X</div>
        <div style={{ color: 'var(--color-warning)' }}>PROCEDURAL TUNNEL MESH // 24 SLAM PTS</div>
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
        AR-MINE // SPATIAL COMPUTING
      </div>
    </div>
  );
};
