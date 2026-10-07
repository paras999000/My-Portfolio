import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createStudioGround, setupStudioLighting } from './threeUtils';

interface MediTraceSceneProps {
  interactive?: boolean;
}

export const MediTraceScene: React.FC<MediTraceSceneProps> = ({ interactive = true }) => {
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
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.04);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(3.2, 2.5, 4.2);
    camera.lookAt(0, 0.25, 0);

    setupStudioLighting(scene);
    createStudioGround(scene, 5.0, 5.0, -0.9, 2.2);

    const podGroup = new THREE.Group();
    scene.add(podGroup);

    // --- MATERIALS ---
    const medicalAlloy = new THREE.MeshStandardMaterial({
      color: 0x2b384e,
      roughness: 0.2,
      metalness: 0.85
    });
    const insulatedComposite = new THREE.MeshStandardMaterial({
      color: 0x0f1520,
      roughness: 0.7,
      metalness: 0.2
    });
    const cryogenicGlass = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      transmission: 0.7,
      thickness: 0.5
    });

    // --- 1. CRYOGENIC PHARMACEUTICAL TRANSPORT VESSEL ---
    // Outer insulated barrel
    const barrelGeo = new THREE.CylinderGeometry(0.9, 0.95, 1.4, 32);
    const barrelMesh = new THREE.Mesh(barrelGeo, insulatedComposite);
    barrelMesh.position.y = 0.1;
    podGroup.add(barrelMesh);

    // Top & Bottom Machined Alloy Sealing Flanges
    const flangeTop = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.12, 32), medicalAlloy);
    flangeTop.position.y = 0.82;
    podGroup.add(flangeTop);

    const flangeBottom = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.14, 32), medicalAlloy);
    flangeBottom.position.y = -0.62;
    podGroup.add(flangeBottom);

    // Center Cryogenic Viewing Window (showing internal biological vials)
    const windowMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.55, 32, 1, true), cryogenicGlass);
    windowMesh.position.y = 0.1;
    podGroup.add(windowMesh);

    // Internal vaccine/biologic ampoules (3 miniature vials)
    const ampouleMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.85 });
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const vial = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16), ampouleMat);
      vial.position.set(Math.cos(angle) * 0.35, 0.1, Math.sin(angle) * 0.35);
      podGroup.add(vial);
    }

    // Top Digital Telemetry Cap (IoT Gateway + GPS Antenna)
    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 0.2, 32), medicalAlloy);
    topCap.position.y = 0.98;
    podGroup.add(topCap);

    // GPS Status Transceiver
    const antStem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), medicalAlloy);
    antStem.position.y = 1.25;
    podGroup.add(antStem);
    const antDome = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    antDome.position.y = 1.42;
    podGroup.add(antDome);

    // --- 2. MULTI-ZONE THERMAL TELEMETRY & DIGITAL TWIN RINGS ---
    // Floating Digital Twin Halo (temperature threshold indicator)
    const haloGeo = new THREE.TorusGeometry(1.35, 0.015, 12, 48);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.8 });
    const haloRing = new THREE.Mesh(haloGeo, haloMat);
    haloRing.rotation.x = Math.PI / 2;
    haloRing.position.y = 0.1;
    podGroup.add(haloRing);

    // Dynamic Merkle Provenance Orbital Ring
    const merkleGeo = new THREE.TorusGeometry(1.58, 0.01, 12, 64);
    const merkleMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.6 });
    const merkleRing = new THREE.Mesh(merkleGeo, merkleMat);
    merkleRing.rotation.x = Math.PI / 3;
    merkleRing.rotation.y = Math.PI / 6;
    podGroup.add(merkleRing);

    // 4 Blockchain Block Markers orbiting the vessel
    const blockGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const blockMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const blocks: THREE.Mesh[] = [];
    for (let b = 0; b < 4; b++) {
      const block = new THREE.Mesh(blockGeo, blockMat);
      podGroup.add(block);
      blocks.push(block);
    }

    // Animation variables
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

      // Gentle interactive tilt
      podGroup.rotation.y += (mouseX * 0.3 - podGroup.rotation.y) * 0.05;
      podGroup.rotation.x += (mouseY * 0.15 - podGroup.rotation.x) * 0.05;

      // Pulse thermal halo
      const scale = 1 + Math.sin(elapsed * 2.5) * 0.03;
      haloRing.scale.set(scale, scale, scale);

      // Rotate Merkle orbit
      merkleRing.rotation.z = elapsed * 0.4;

      // Position orbiting blockchain block verification markers
      blocks.forEach((blk, idx) => {
        const ang = elapsed * 0.6 + (idx / 4) * Math.PI * 2;
        blk.position.set(
          Math.cos(ang) * 1.58,
          Math.sin(ang) * 0.4 + 0.1,
          Math.sin(ang) * 1.58
        );
        blk.rotation.y = elapsed * 1.5;
      });

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
      barrelGeo.dispose();
      haloGeo.dispose();
      merkleGeo.dispose();
      blockGeo.dispose();
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
        <span>COLD-CHAIN: -20.4°C [NOMINAL] // SMART CONTRACT QUARANTINE: READY</span>
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
        <div>SHA-256 MERKLE PROVENANCE</div>
        <div style={{ color: 'var(--color-success)' }}>GPS & THERMAL TELEMATICS ACTIVE</div>
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
        DIGITAL TWIN NODE // 21 CFR PART 11
      </div>
    </div>
  );
};
