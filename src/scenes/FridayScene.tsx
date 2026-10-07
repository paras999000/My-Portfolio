import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

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
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.0);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- 1. Central Compact AI Core ---
    const coreGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Core Wireframe Facet Accent
    const coreWireGeo = new THREE.WireframeGeometry(coreGeo);
    const coreWireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75
    });
    const coreWire = new THREE.LineSegments(coreWireGeo, coreWireMat);
    coreMesh.add(coreWire);

    // --- 2. Internal Gimbal Rotation Rings ---
    const ringMat1 = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });
    const ringMat2 = new THREE.LineBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.4 });

    const ring1 = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(
      new Array(64).fill(0).map((_, i) => {
        const theta = (i / 64) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(theta) * 1.15, Math.sin(theta) * 1.15, 0);
      })
    ), ringMat1);
    rootGroup.add(ring1);

    const ring2 = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(
      new Array(64).fill(0).map((_, i) => {
        const theta = (i / 64) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(theta) * 1.35, 0, Math.sin(theta) * 1.35);
      })
    ), ringMat2);
    rootGroup.add(ring2);

    // --- 3. Circular Audio Waveform Reacting Ring ---
    const waveformPointCount = 80;
    const wavePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= waveformPointCount; i++) {
      const theta = (i / waveformPointCount) * Math.PI * 2;
      wavePoints.push(new THREE.Vector3(Math.cos(theta) * 1.75, Math.sin(theta) * 1.75, 0));
    }
    const waveGeo = new THREE.BufferGeometry().setFromPoints(wavePoints);
    const waveMat = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.8
    });
    const waveLine = new THREE.Line(waveGeo, waveMat);
    rootGroup.add(waveLine);

    // --- 4. MCP Tool Connection Nodes (Satellite Orbitals) ---
    // Nodes representing VOICE IN -> AI CORE -> MCP TOOLS -> ACTION
    const nodesData = [
      { label: "VOICE_IN", angle: 0, radius: 2.3, color: 0x38bdf8 },
      { label: "AI_CORE", angle: Math.PI * 0.5, radius: 2.2, color: 0x22d3ee },
      { label: "MCP_TOOLS", angle: Math.PI, radius: 2.3, color: 0x38bdf8 },
      { label: "ACTION_BUS", angle: Math.PI * 1.5, radius: 2.2, color: 0x34d399 }
    ];

    const nodeGroup = new THREE.Group();
    rootGroup.add(nodeGroup);

    const nodeMeshes: THREE.Mesh[] = [];
    const nodeLines: THREE.Line[] = [];

    nodesData.forEach((node) => {
      const nodeGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: node.color });
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.position.set(
        Math.cos(node.angle) * node.radius,
        Math.sin(node.angle) * node.radius * 0.65,
        Math.sin(node.angle) * 0.4
      );
      nodeMeshes.push(mesh);
      nodeGroup.add(mesh);

      // Connection bus line to core
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        mesh.position
      ]);
      const lineMat = new THREE.LineDashedMaterial({
        color: node.color,
        dashSize: 0.1,
        gapSize: 0.08,
        transparent: true,
        opacity: 0.45
      });
      const line = new THREE.Line(lineGeo, lineMat);
      line.computeLineDistances();
      nodeLines.push(line);
      nodeGroup.add(line);
    });

    // --- 5. Data Pulses (Traveling Packets) ---
    const pulseCount = 4;
    const pulseGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const pulses: THREE.Mesh[] = [];
    for (let i = 0; i < pulseCount; i++) {
      const p = new THREE.Mesh(pulseGeo, pulseMat);
      rootGroup.add(p);
      pulses.push(p);
    }

    // Lighting
    const pointLight = new THREE.PointLight(0x38bdf8, 2, 10);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    // Mouse Interaction
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

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Core rotation
      coreMesh.rotation.x = t * 0.35;
      coreMesh.rotation.y = t * 0.45;

      // Internal gimbal layers
      ring1.rotation.z = t * 0.5;
      ring1.rotation.x = Math.sin(t * 0.4) * 0.3;
      ring2.rotation.y = -t * 0.4;
      ring2.rotation.x = Math.cos(t * 0.3) * 0.3;

      // Audio waveform react calculation
      const wavePos = waveGeo.attributes.position.array as Float32Array;
      for (let i = 0; i <= waveformPointCount; i++) {
        const theta = (i / waveformPointCount) * Math.PI * 2;
        const waveMod = Math.sin(theta * 6 + t * 4.0) * 0.1 + Math.sin(theta * 12 - t * 2.5) * 0.05;
        const r = 1.75 + waveMod;
        wavePos[i * 3] = Math.cos(theta) * r;
        wavePos[i * 3 + 1] = Math.sin(theta) * r;
        wavePos[i * 3 + 2] = Math.sin(theta * 3 + t * 2) * 0.15;
      }
      waveGeo.attributes.position.needsUpdate = true;

      // Orbit nodes
      nodeGroup.rotation.z = t * 0.12;

      // Data pulses traveling along pipeline: VOICE -> AI -> MCP -> ACTION
      pulses.forEach((p, idx) => {
        const progress = ((t * 0.6 + idx * 0.25) % 1);
        const targetNodeMesh = nodeMeshes[idx % nodeMeshes.length];
        p.position.lerpVectors(new THREE.Vector3(0, 0, 0), targetNodeMesh.position, progress);
        p.scale.setScalar(0.7 + Math.sin(progress * Math.PI) * 0.6);
      });

      // Interactive tilt
      rootGroup.rotation.y = mouse.x * 0.35;
      rootGroup.rotation.x = -mouse.y * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '360px' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
      
      {/* Precision Pipeline Badge Overlay */}
      <div 
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--text-accent)',
          background: 'rgba(8, 9, 13, 0.75)',
          padding: '3px 8px',
          borderRadius: '2px',
          border: '1px solid var(--border-subtle)',
          pointerEvents: 'none'
        }}
      >
        PIPELINE: VOICE → AI → MCP → ACTION
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
        ESP32-S3 // I2S DMA STREAM
      </div>
    </div>
  );
};
