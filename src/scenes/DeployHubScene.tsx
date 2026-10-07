import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createStudioGround, setupStudioLighting } from './threeUtils';

interface DeployHubSceneProps {
  interactive?: boolean;
}

export const DeployHubScene: React.FC<DeployHubSceneProps> = ({ interactive = true }) => {
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
    scene.fog = new THREE.FogExp2(0x0a0d14, 0.045);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(3.4, 2.8, 4.4);
    camera.lookAt(0, 0.25, 0);

    setupStudioLighting(scene);
    createStudioGround(scene, 5.0, 5.0, -0.75, 2.2);

    const hostGroup = new THREE.Group();
    scene.add(hostGroup);

    // --- MATERIALS ---
    const serverMetal = new THREE.MeshStandardMaterial({
      color: 0x222733,
      roughness: 0.35,
      metalness: 0.8
    });
    const podBaseMat = new THREE.MeshStandardMaterial({
      color: 0x121722,
      roughness: 0.5,
      metalness: 0.4
    });
    const dockerBlueMat = new THREE.MeshBasicMaterial({
      color: 0x2496ed,
      wireframe: true
    });
    const liveGreenMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });

    // --- 1. HOST SERVER CHASSIS (1U BLADE WITH GRILLES & PORTS) ---
    const bladeGeo = new THREE.BoxGeometry(2.6, 0.4, 1.8);
    const bladeMesh = new THREE.Mesh(bladeGeo, serverMetal);
    bladeMesh.position.y = -0.4;
    hostGroup.add(bladeMesh);

    // Front intake mesh texture pattern
    for (let i = 0; i < 18; i++) {
      const vent = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.22, 0.02),
        new THREE.MeshBasicMaterial({ color: 0x090c12 })
      );
      vent.position.set(-1.0 + i * 0.11, -0.4, 0.91);
      hostGroup.add(vent);
    }

    // Dual RJ45 Gigabit Ethernet Ports
    for (let p = 0; p < 2; p++) {
      const eth = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.1, 0.04),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
      );
      eth.position.set(1.05 + p * 0.16, -0.4, 0.91);
      hostGroup.add(eth);
    }

    // --- 2. FLOATING DOCKER CONTAINER PODS (:3001, :3002, :3003) ---
    const pods: { mesh: THREE.Group; baseY: number; phase: number }[] = [];
    const podPositions = [
      { x: -0.85, z: 0.1, label: ':3001 API' },
      { x: 0.0, z: -0.2, label: ':3002 APP' },
      { x: 0.85, z: 0.2, label: ':3003 NAS' }
    ];

    podPositions.forEach((pos, idx) => {
      const podGroup = new THREE.Group();
      podGroup.position.set(pos.x, 0.45, pos.z);

      // Solid container body
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), podBaseMat);
      podGroup.add(cube);

      // Wireframe overlay container cage
      const cage = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.58, 0.58), dockerBlueMat);
      podGroup.add(cage);

      // Container Health Status Dot
      const statusDot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), liveGreenMat);
      statusDot.position.set(0.22, 0.22, 0.3);
      podGroup.add(statusDot);

      // Sockets pipe connecting from host to container
      const pipeGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.8, 12);
      const pipeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.7 });
      const pipe = new THREE.Mesh(pipeGeo, pipeMat);
      pipe.position.set(0, -0.5, 0);
      podGroup.add(pipe);

      hostGroup.add(podGroup);
      pods.push({ mesh: podGroup, baseY: 0.45, phase: idx * 1.5 });
    });

    // Socket Data Pulse Spheres traveling up the pipes
    const pulseCount = 6;
    const pulseGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const pulses: THREE.Mesh[] = [];

    for (let i = 0; i < pulseCount; i++) {
      const p = new THREE.Mesh(pulseGeo, pulseMat);
      hostGroup.add(p);
      pulses.push(p);
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

      // Parallax rotation
      hostGroup.rotation.y += (mouseX * 0.3 - hostGroup.rotation.y) * 0.05;
      hostGroup.rotation.x += (mouseY * 0.15 - hostGroup.rotation.x) * 0.05;

      // Bob floating container pods
      pods.forEach((p) => {
        p.mesh.position.y = p.baseY + Math.sin(elapsed * 2 + p.phase) * 0.05;
        p.mesh.rotation.y = Math.sin(elapsed * 0.8 + p.phase) * 0.1;
      });

      // Animate socket data pulses from host (-0.4) to containers (0.45)
      pulses.forEach((pulse, idx) => {
        const podIndex = idx % 3;
        const targetPod = pods[podIndex];
        const t = (elapsed * 0.8 + idx / pulseCount) % 1;
        pulse.position.x = targetPod.mesh.position.x;
        pulse.position.z = targetPod.mesh.position.z;
        pulse.position.y = THREE.MathUtils.lerp(-0.35, targetPod.mesh.position.y, t);
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
      bladeGeo.dispose();
      pulseGeo.dispose();
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
        <span>DOCKER SOCKET: /var/run/docker.sock // PORT MATRIX: :3001 - :3999 ACTIVE</span>
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
        <div>SELF-HOSTED UBUNTU DAEMON</div>
        <div style={{ color: 'var(--color-success)' }}>SANDBOXED NAS /srv/storage // BETTER-SQLITE3</div>
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
        CONTAINER RUNTIME // ZERO-DOWNTIME ENGINE
      </div>
    </div>
  );
};
