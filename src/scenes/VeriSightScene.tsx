import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createStudioGround, setupStudioLighting } from './threeUtils';

interface VeriSightSceneProps {
  interactive?: boolean;
}

export const VeriSightScene: React.FC<VeriSightSceneProps> = ({ interactive = true }) => {
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
    scene.fog = new THREE.FogExp2(0x0a0c14, 0.045);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(3.6, 3.2, 4.4);
    camera.lookAt(0, 0.2, 0);

    setupStudioLighting(scene);
    createStudioGround(scene, 5.0, 5.0, -0.85, 2.4);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- 1. TACTICAL RADAR DISK PLATFORM ---
    const radarDiskGeo = new THREE.CylinderGeometry(1.6, 1.65, 0.15, 48);
    const radarDiskMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.4,
      metalness: 0.8
    });
    const radarDisk = new THREE.Mesh(radarDiskGeo, radarDiskMat);
    radarDisk.position.y = -0.7;
    rootGroup.add(radarDisk);

    // Concentric Range Rings
    for (let r = 1; r <= 3; r++) {
      const ringGeo = new THREE.RingGeometry(r * 0.45, r * 0.45 + 0.015, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -0.61;
      rootGroup.add(ring);
    }

    // Rotating Radar Sweep Wedge
    const sweepGeo = new THREE.CircleGeometry(1.4, 32, 0, Math.PI / 4);
    const sweepMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const sweep = new THREE.Mesh(sweepGeo, sweepMat);
    sweep.rotation.x = -Math.PI / 2;
    sweep.position.y = -0.605;
    rootGroup.add(sweep);

    // --- 2. FLOATING FRAUD ENTITY NETWORK GRAPH ---
    const nodeCoords = [
      new THREE.Vector3(0, 0.4, 0),        // Central core router
      new THREE.Vector3(-0.9, 0.6, 0.4),   // Compromised gateway
      new THREE.Vector3(0.8, 0.5, -0.5),   // Rogue SWIFT endpoint
      new THREE.Vector3(0.5, 0.9, 0.7),    // Mule account node
      new THREE.Vector3(-0.6, 0.2, -0.7),  // C2 server
      new THREE.Vector3(-1.1, 0.8, -0.2),  // Proxy node
      new THREE.Vector3(1.1, 0.3, 0.3),    // Crypto exit node
      new THREE.Vector3(0.1, 1.2, -0.3),   // Shadow ledger
      new THREE.Vector3(-0.3, 1.0, 0.9)    // Operative target
    ];

    const nodeMatNormal = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.7 });
    const nodeMatThreat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.8 });
    const nodes: THREE.Mesh[] = [];

    nodeCoords.forEach((coord, i) => {
      const isThreat = i === 1 || i === 4;
      const sz = i === 0 ? 0.12 : 0.07;
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(sz, 16, 16), isThreat ? nodeMatThreat : nodeMatNormal);
      mesh.position.copy(coord);
      rootGroup.add(mesh);
      nodes.push(mesh);
    });

    // Network Connection Lines between nodes
    const lineMat = new THREE.LineBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.5 });
    const edges = [
      [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 6], [3, 8], [4, 7], [1, 4], [2, 3]
    ];
    edges.forEach(([from, to]) => {
      const pts = [nodeCoords[from], nodeCoords[to]];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(lineGeo, lineMat);
      rootGroup.add(line);
    });

    // Biometric / Cryptographic Outer Protection Spheres
    const cageGeo = new THREE.IcosahedronGeometry(1.45, 1);
    const cageMat = new THREE.MeshBasicMaterial({ color: 0x0369a1, wireframe: true, transparent: true, opacity: 0.3 });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    cage.position.y = 0.5;
    rootGroup.add(cage);

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

      // Radar Sweep Rotation
      sweep.rotation.z = -elapsed * 1.6;

      // Rotate Outer Holographic Cage
      cage.rotation.y = elapsed * 0.15;
      cage.rotation.x = Math.sin(elapsed * 0.2) * 0.1;

      // Pulse Threat Nodes
      const pulse = 1 + Math.sin(elapsed * 4) * 0.25;
      nodes[1].scale.set(pulse, pulse, pulse);
      nodes[4].scale.set(pulse, pulse, pulse);

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
      radarDiskGeo.dispose();
      sweepGeo.dispose();
      cageGeo.dispose();
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
        <span>RADAR SWEEP // ROGUE ROUTER & SWIFT HOP CORRELATION ACTIVE</span>
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
        <div>LEVEL-5 CLEARANCE // BIOMETRIC GATE</div>
        <div style={{ color: 'var(--color-danger)' }}>2 HIGH-VELOCITY ANOMALIES FLAGGED</div>
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
        VERISIGHT NX // FORENSIC RADAR
      </div>
    </div>
  );
};
