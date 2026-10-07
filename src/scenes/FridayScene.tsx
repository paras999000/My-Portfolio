import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createStudioGround, setupStudioLighting } from './threeUtils';

interface FridaySceneProps {
  interactive?: boolean;
}

export const FridayScene: React.FC<FridaySceneProps> = ({ interactive = true }) => {
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
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(2.8, 2.5, 4.6);
    camera.lookAt(0, 0.35, 0);

    // Studio Lighting & Contact Shadow Ground
    setupStudioLighting(scene);
    createStudioGround(scene, 5, 5, 0, 1.8);

    const rootGroup = new THREE.Group();
    rootGroup.position.y = 0.05;
    scene.add(rootGroup);

    // --- 1. PHYSICAL HARDWARE ENCLOSURE ---
    // Machined aluminium lower base ring
    const baseRingGeo = new THREE.CylinderGeometry(1.2, 1.25, 0.18, 32);
    const alumMaterial = new THREE.MeshStandardMaterial({
      color: 0x2b3342,
      roughness: 0.28,
      metalness: 0.88
    });
    const baseRing = new THREE.Mesh(baseRingGeo, alumMaterial);
    baseRing.position.y = 0.09;
    rootGroup.add(baseRing);

    // Dark matte polymer cylindrical main chassis
    const bodyGeo = new THREE.CylinderGeometry(1.12, 1.15, 0.65, 32);
    const polymerMaterial = new THREE.MeshStandardMaterial({
      color: 0x11141c,
      roughness: 0.55,
      metalness: 0.15
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, polymerMaterial);
    bodyMesh.position.y = 0.45;
    rootGroup.add(bodyMesh);

    // Heatsink ventilation slots around circumference
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const finGeo = new THREE.BoxGeometry(0.04, 0.35, 0.12);
      const finMat = new THREE.MeshStandardMaterial({ color: 0x090b10, roughness: 0.7 });
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(Math.cos(angle) * 1.14, 0.45, Math.sin(angle) * 1.14);
      fin.rotation.y = -angle;
      rootGroup.add(fin);
    }

    // Chamfered top bezel (brushed metallic ring)
    const bezelGeo = new THREE.CylinderGeometry(1.05, 1.12, 0.12, 32);
    const bezelMesh = new THREE.Mesh(bezelGeo, alumMaterial);
    bezelMesh.position.y = 0.82;
    rootGroup.add(bezelMesh);

    // Top smoked acrylic / glass inspection lens
    const glassGeo = new THREE.CylinderGeometry(0.98, 0.98, 0.04, 32);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x08101a,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.85,
      transparent: true,
      opacity: 0.75,
      ior: 1.5
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
    glassMesh.position.y = 0.88;
    rootGroup.add(glassMesh);

    // --- 2. INTERNAL ELECTRONICS REVEAL (Under Glass) ---
    // Sub-surface PCB substrate
    const pcbGeo = new THREE.CylinderGeometry(0.94, 0.94, 0.02, 32);
    const pcbMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a1c12, // High-grade dark emerald PCB
      roughness: 0.4,
      metalness: 0.3
    });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMaterial);
    pcbMesh.position.y = 0.83;
    rootGroup.add(pcbMesh);

    // Central AI Core Package (ESP32-S3 Vector Processor Package)
    const mcuGeo = new THREE.BoxGeometry(0.42, 0.04, 0.42);
    const mcuMaterial = new THREE.MeshStandardMaterial({
      color: 0x181e28,
      roughness: 0.25,
      metalness: 0.8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2
    });
    const mcuMesh = new THREE.Mesh(mcuGeo, mcuMaterial);
    mcuMesh.position.y = 0.86;
    rootGroup.add(mcuMesh);

    // Gold Silicon Heat-Spreader Core Inlay
    const dieGeo = new THREE.BoxGeometry(0.24, 0.02, 0.24);
    const dieMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Gold inlay
      roughness: 0.15,
      metalness: 0.95
    });
    const dieMesh = new THREE.Mesh(dieGeo, dieMat);
    dieMesh.position.y = 0.885;
    rootGroup.add(dieMesh);

    // Acoustic Microphone Port (Center MEMS Ingestion)
    const micPortGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 16);
    const micPortMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const micPort = new THREE.Mesh(micPortGeo, micPortMat);
    micPort.position.y = 0.90;
    rootGroup.add(micPort);

    // --- 3. FLOATING ACOUSTIC SOUNDWAVE SPECTRUM ---
    // Concentric pulsating audio rings expanding from the microphone aperture
    const waveRings: THREE.Line[] = [];
    for (let r = 0; r < 3; r++) {
      const ringPts: THREE.Vector3[] = [];
      const segs = 48;
      for (let s = 0; s <= segs; s++) {
        const rad = (s / segs) * Math.PI * 2;
        ringPts.push(new THREE.Vector3(Math.cos(rad) * (0.35 + r * 0.25), 0, Math.sin(rad) * (0.35 + r * 0.25)));
      }
      const rGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
      const rMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.6 - r * 0.15
      });
      const waveLine = new THREE.Line(rGeo, rMat);
      waveLine.position.y = 0.92;
      rootGroup.add(waveLine);
      waveRings.push(waveLine);
    }

    // --- 4. SATELLITE MCP & TOOL ACTION NODES ---
    // Representing: VOICE → PROCESS → MCP → ACTION
    const nodes = [
      { label: "VOICE_IN", angle: 0, rad: 1.85, color: 0x38bdf8 },
      { label: "AI_REASON", angle: Math.PI * 0.5, rad: 1.85, color: 0x22d3ee },
      { label: "MCP_TOOLS", angle: Math.PI, rad: 1.85, color: 0x38bdf8 },
      { label: "ACTUATE", angle: Math.PI * 1.5, rad: 1.85, color: 0x34d399 }
    ];

    const nodeGroup = new THREE.Group();
    nodeGroup.position.y = 0.6;
    rootGroup.add(nodeGroup);

    const nodeMeshes: THREE.Mesh[] = [];
    nodes.forEach((n) => {
      const nGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const nMat = new THREE.MeshStandardMaterial({
        color: n.color,
        roughness: 0.2,
        metalness: 0.8,
        emissive: n.color,
        emissiveIntensity: 0.35
      });
      const m = new THREE.Mesh(nGeo, nMat);
      m.position.set(Math.cos(n.angle) * n.rad, 0, Math.sin(n.angle) * n.rad);
      nodeGroup.add(m);
      nodeMeshes.push(m);

      // Subtle conduit line connecting to base
      const linePts = [new THREE.Vector3(0, 0, 0), m.position];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
      const lineMat = new THREE.LineDashedMaterial({
        color: n.color,
        dashSize: 0.08,
        gapSize: 0.08,
        transparent: true,
        opacity: 0.4
      });
      const cLine = new THREE.Line(lineGeo, lineMat);
      cLine.computeLineDistances();
      nodeGroup.add(cLine);
    });

    // Sub-surface pulse packet
    const packetGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const packet = new THREE.Mesh(packetGeo, packetMat);
    nodeGroup.add(packet);

    // Mouse Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    // IntersectionObserver for performance (only animate when visible)
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (nw === 0 || nh === 0) return;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return; // Save GPU/CPU when offscreen!

      const t = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Realistic subtle turntable orientation
      rootGroup.rotation.y = t * 0.12 + mouse.x * 0.35;
      rootGroup.rotation.x = mouse.y * 0.15;

      // Acoustic wave pulse expansion
      waveRings.forEach((r, idx) => {
        const scale = 1 + ((t * 0.8 + idx * 0.33) % 1) * 0.6;
        r.scale.set(scale, 1, scale);
      });

      // Data pulse packet traveling across pipeline: VOICE → AI → MCP → ACTION
      const cycle = (t * 0.5) % 1;
      const targetIdx = Math.floor(cycle * nodeMeshes.length);
      const nextIdx = (targetIdx + 1) % nodeMeshes.length;
      const stepProgress = (cycle * nodeMeshes.length) % 1;

      packet.position.lerpVectors(nodeMeshes[targetIdx].position, nodeMeshes[nextIdx].position, stepProgress);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      resizeObserver.disconnect();
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      <div 
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--text-accent)',
          background: 'rgba(8, 9, 13, 0.85)',
          padding: '4px 10px',
          borderRadius: '2px',
          border: '1px solid var(--border-subtle)',
          pointerEvents: 'none'
        }}
      >
        PIPELINE: VOICE → PROCESS → MCP → ACTION
      </div>

      <div 
        style={{
          position: 'absolute',
          top: '12px',
          right: '14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          pointerEvents: 'none'
        }}
      >
        ESP32-S3 CORE // MACHINED ALLOY + ACRYLIC
      </div>
    </div>
  );
};
