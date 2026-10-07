import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createStudioGround, setupStudioLighting } from './threeUtils';

interface SecurityAuditSceneProps {
  interactive?: boolean;
}

export const SecurityAuditScene: React.FC<SecurityAuditSceneProps> = ({ interactive = true }) => {
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

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(3.4, 2.6, 4.4);
    camera.lookAt(0, 0.2, 0);

    setupStudioLighting(scene);
    createStudioGround(scene, 5.0, 5.0, -0.75, 2.2);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- MATERIALS ---
    const rackMetal = new THREE.MeshStandardMaterial({
      color: 0x181c24,
      roughness: 0.35,
      metalness: 0.85
    });
    const bayFaceMat = new THREE.MeshStandardMaterial({
      color: 0x0f131a,
      roughness: 0.65,
      metalness: 0.3
    });
    const ledgerGold = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.95
    });
    const cyanPulseMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true
    });
    const emeraldSecureMat = new THREE.MeshBasicMaterial({
      color: 0x10b981
    });

    // --- 1. SERVER RACK ENCLOSURE (1U / 2U HARDWARE VAULT) ---
    const rackBox = new THREE.BoxGeometry(2.4, 1.2, 1.6);
    const rackMesh = new THREE.Mesh(rackBox, rackMetal);
    rackMesh.position.y = -0.15;
    rootGroup.add(rackMesh);

    // Front drive caddies (8 hot-swap SAS drive trays)
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 4; c++) {
        const caddy = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.06), bayFaceMat);
        caddy.position.set(-0.85 + c * 0.57, 0.1 - r * 0.5, 0.82);
        rootGroup.add(caddy);

        // Drive handle latch
        const latch = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.25, 0.04),
          new THREE.MeshStandardMaterial({ color: 0x333b4d, metalness: 0.8, roughness: 0.3 })
        );
        latch.position.set(-0.95 + c * 0.57, 0.1 - r * 0.5, 0.86);
        rootGroup.add(latch);

        // Activity LED per tray
        const led = new THREE.Mesh(
          new THREE.CylinderGeometry(0.015, 0.015, 0.02, 8),
          (r + c) % 2 === 0 ? emeraldSecureMat : new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        led.rotation.x = Math.PI / 2;
        led.position.set(-0.72 + c * 0.57, 0.22 - r * 0.5, 0.85);
        rootGroup.add(led);
      }
    }

    // --- 2. HOLOGRAPHIC PIPELINE STAGES (EVENT -> LOGGER -> AUDIT RECORD -> DATABASE) ---
    // Stage 1: INGESTION CONDUIT (Left side)
    const conduitGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16);
    const conduitMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.2, metalness: 0.8 });
    const conduit = new THREE.Mesh(conduitGeo, conduitMat);
    conduit.rotation.z = Math.PI / 2;
    conduit.position.set(-1.4, 0.65, 0.2);
    rootGroup.add(conduit);

    // Stage 2: CRYPTOGRAPHIC AUDIT ENGINE (Center Floating Hologram)
    const coreEngineGeo = new THREE.OctahedronGeometry(0.38, 1);
    const coreEngineMesh = new THREE.Mesh(coreEngineGeo, cyanPulseMat);
    coreEngineMesh.position.set(0, 0.8, 0);
    rootGroup.add(coreEngineMesh);

    // Inner WORM SHA-256 Sealed Cube
    const innerCubeGeo = new THREE.BoxGeometry(0.24, 0.24, 0.24);
    const innerCube = new THREE.Mesh(innerCubeGeo, ledgerGold);
    innerCube.position.set(0, 0.8, 0);
    rootGroup.add(innerCube);

    // Rotating Cryptographic Hash Orbit Rings
    const ringGeo1 = new THREE.TorusGeometry(0.55, 0.012, 12, 48);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.position.set(0, 0.8, 0);
    ring1.rotation.x = Math.PI / 3;
    rootGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(0.68, 0.012, 12, 48);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.6 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.position.set(0, 0.8, 0);
    ring2.rotation.y = Math.PI / 4;
    rootGroup.add(ring2);

    // --- 3. TRAVELLING EVENT PACKETS (EVENT -> LOGGER -> AUDIT RECORD -> DATABASE) ---
    const packetCount = 8;
    const packetGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const packets: THREE.Mesh[] = [];

    for (let i = 0; i < packetCount; i++) {
      const p = new THREE.Mesh(packetGeo, packetMat);
      rootGroup.add(p);
      packets.push(p);
    }

    // Pipeline Data Traces on Rack Top
    const busGeo = new THREE.PlaneGeometry(1.8, 0.04);
    const busMat = new THREE.MeshBasicMaterial({ color: 0x1e293b, side: THREE.DoubleSide });
    for (let b = 0; b < 3; b++) {
      const bus = new THREE.Mesh(busGeo, busMat);
      bus.rotation.x = -Math.PI / 2;
      bus.position.set(0, 0.46, -0.4 + b * 0.4);
      rootGroup.add(bus);
    }

    // Animation & Mouse Interaction State
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
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

      // Smooth camera tilt
      targetRotY = mouseX * 0.25;
      targetRotX = mouseY * 0.15;
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.05;

      // Rotate core cryptographic engine
      coreEngineMesh.rotation.y = elapsed * 0.8;
      coreEngineMesh.rotation.x = elapsed * 0.4;
      innerCube.rotation.y = -elapsed * 0.5;
      innerCube.rotation.z = elapsed * 0.3;

      ring1.rotation.z = elapsed * 0.6;
      ring2.rotation.x = -elapsed * 0.5;

      // Animate event data packets through pipeline:
      // Stage: -1.8 (EVENT) -> -0.6 (LOGGER) -> 0.0 (AUDIT CORE) -> +0.8 (DATABASE)
      packets.forEach((p, idx) => {
        const offset = (elapsed * 0.7 + idx / packetCount) % 1;
        // Path from (-1.8, 0.65, 0.2) to (0, 0.8, 0) to (1.2, 0.4, -0.4)
        if (offset < 0.5) {
          // Event to Core
          const t = offset / 0.5;
          p.position.x = THREE.MathUtils.lerp(-1.8, 0, t);
          p.position.y = THREE.MathUtils.lerp(0.65, 0.8, t);
          p.position.z = THREE.MathUtils.lerp(0.2, 0, t);
          (p.material as THREE.MeshBasicMaterial).color.setHex(0x38bdf8);
        } else {
          // Core to Database Commit (Cryptographically Sealed)
          const t = (offset - 0.5) / 0.5;
          p.position.x = THREE.MathUtils.lerp(0, 1.2, t);
          p.position.y = THREE.MathUtils.lerp(0.8, 0.35, t);
          p.position.z = THREE.MathUtils.lerp(0, -0.4, t);
          (p.material as THREE.MeshBasicMaterial).color.setHex(0x10b981);
        }
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
      // Dispose geometries & materials
      rackBox.dispose();
      conduitGeo.dispose();
      coreEngineGeo.dispose();
      innerCubeGeo.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      packetGeo.dispose();
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
        <span>FLOW: EVENT → SECURITY LOGGER → AUDIT RECORD → DATABASE</span>
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
        <div>ISO/IEC 27037:2012 COMPLIANT</div>
        <div style={{ color: 'var(--color-success)' }}>WORM IMMUTABLE LEDGER // SHA-256 SEALED</div>
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
        DFIR CRYPTOGRAPHIC VAULT // NODE ACTIVE
      </div>
    </div>
  );
};
