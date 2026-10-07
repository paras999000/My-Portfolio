import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createStudioGround, setupStudioLighting } from './threeUtils';

interface VoiceRouteSceneProps {
  interactive?: boolean;
}

export const VoiceRouteScene: React.FC<VoiceRouteSceneProps> = ({ interactive = true }) => {
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
    scene.fog = new THREE.FogExp2(0x0a0d14, 0.04);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(3.6, 3.4, 4.4);
    camera.lookAt(0, 0.1, 0);

    setupStudioLighting(scene);
    createStudioGround(scene, 5.0, 5.0, -0.65, 2.2);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- MATERIALS ---
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x181e28,
      roughness: 0.8,
      metalness: 0.2
    });
    const nodeDefaultMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.3,
      metalness: 0.6
    });
    const optimalNodeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.2,
      metalness: 0.8
    });
    const targetNodeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.8
    });

    // --- 1. 3D ISOMETRIC CITY STREET NETWORK ---
    // Ground road grid
    const roadGridGeo = new THREE.BoxGeometry(2.8, 0.06, 2.8);
    const roadGrid = new THREE.Mesh(roadGridGeo, roadMat);
    roadGrid.position.y = -0.55;
    rootGroup.add(roadGrid);

    // Elevated highway overpass
    const highwayGeo = new THREE.BoxGeometry(2.8, 0.08, 0.4);
    const highway = new THREE.Mesh(highwayGeo, new THREE.MeshStandardMaterial({ color: 0x222a38, roughness: 0.6 }));
    highway.position.set(0, -0.25, 0);
    highway.rotation.y = Math.PI / 4;
    rootGroup.add(highway);

    // Highway support pillars
    for (let p = -1; p <= 1; p += 2) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 12), roadMat);
      pillar.position.set(p * 0.7, -0.4, p * 0.7);
      rootGroup.add(pillar);
    }

    // --- 2. GRAPH WAYPOINT NODES ---
    const waypoints: { pos: THREE.Vector3; isPath: boolean; mesh?: THREE.Mesh }[] = [
      { pos: new THREE.Vector3(-1.1, -0.48, -1.0), isPath: true },  // 0: Start (Voice Input)
      { pos: new THREE.Vector3(-0.4, -0.48, -0.8), isPath: true },  // 1: Path 1
      { pos: new THREE.Vector3(-0.8, -0.48, 0.0), isPath: false },
      { pos: new THREE.Vector3(0.0, -0.18, 0.0), isPath: true },    // 2: Highway Overpass
      { pos: new THREE.Vector3(0.7, -0.48, -0.6), isPath: false },
      { pos: new THREE.Vector3(0.6, -0.48, 0.2), isPath: true },    // 3: Path 3
      { pos: new THREE.Vector3(-0.3, -0.48, 0.9), isPath: false },
      { pos: new THREE.Vector3(1.1, -0.48, 1.0), isPath: true }     // 4: Destination Node
    ];

    waypoints.forEach((wp, idx) => {
      const isDest = idx === waypoints.length - 1;
      const isStart = idx === 0;
      const mat = isDest ? targetNodeMat : (wp.isPath ? optimalNodeMat : nodeDefaultMat);
      const sz = isDest || isStart ? 0.09 : (wp.isPath ? 0.07 : 0.05);
      const node = new THREE.Mesh(new THREE.CylinderGeometry(sz, sz, 0.12, 16), mat);
      node.position.copy(wp.pos);
      rootGroup.add(node);
      wp.mesh = node;
    });

    // Network connection road segments
    const pathSegments = [
      [0, 1], [1, 2], [2, 3], [3, 4] // Optimal path
    ];
    const otherSegments = [
      [0, 2], [1, 4], [2, 6], [3, 6], [4, 7]
    ];

    // Render other edges (dim gray)
    const dimEdgeMat = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.4 });
    otherSegments.forEach(([from, to]) => {
      const pts = [waypoints[from].pos, waypoints[to].pos];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      rootGroup.add(new THREE.Line(geo, dimEdgeMat));
    });

    // Render optimal A* route (luminous green)
    const pathLineMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 });
    pathSegments.forEach(([from, to]) => {
      const pts = [waypoints[from].pos, waypoints[to].pos];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      rootGroup.add(new THREE.Line(geo, pathLineMat));
    });

    // --- 3. SPEECH WAVEFORM RECOGNITION TRANSDUCER (FLOATING OVER START NODE) ---
    const voiceGroup = new THREE.Group();
    voiceGroup.position.set(-1.1, 0.35, -1.0);
    rootGroup.add(voiceGroup);

    // Concentric acoustic speech waveform rings
    const speechRings: THREE.Mesh[] = [];
    const speechMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    for (let s = 0; s < 3; s++) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.08 + s * 0.06, 0.09 + s * 0.06, 24), speechMat);
      ring.rotation.x = Math.PI / 2;
      voiceGroup.add(ring);
      speechRings.push(ring);
    }

    // --- 4. TRAVELLING A* HEURISTIC PATH PULSE ---
    const runnerGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const runnerMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const runner = new THREE.Mesh(runnerGeo, runnerMat);
    rootGroup.add(runner);

    // Animation & Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let animId: number;

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

    const optimalWaypoints = [
      waypoints[0].pos,
      waypoints[1].pos,
      waypoints[3].pos, // overpass
      waypoints[5].pos,
      waypoints[7].pos  // destination
    ];

    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const elapsed = (performance.now() - startTime) / 1000;

      // Mouse Parallax
      rootGroup.rotation.y += (mouseX * 0.3 - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (mouseY * 0.15 - rootGroup.rotation.x) * 0.05;

      // Pulse speech waveform rings
      speechRings.forEach((r, idx) => {
        const sc = 1 + Math.sin(elapsed * 5 + idx * 1.5) * 0.35;
        r.scale.set(sc, sc, sc);
      });

      // Animate A* search traversal along the 4 segments
      const totalSegs = optimalWaypoints.length - 1;
      const progress = (elapsed * 0.6) % totalSegs;
      const segIndex = Math.floor(progress);
      const segT = progress - segIndex;
      const pA = optimalWaypoints[segIndex];
      const pB = optimalWaypoints[segIndex + 1];

      runner.position.lerpVectors(pA, pB, segT);
      runner.position.y += 0.08; // slightly above road

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
      roadGridGeo.dispose();
      highwayGeo.dispose();
      runnerGeo.dispose();
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
        <span>A* SEARCH: OPTIMAL f(n) = g(n) + h(n) // TRAFFIC IMPEDANCE: 1.4x</span>
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
        <div>VOICE INGESTION: 16kHz PCM WAV</div>
        <div style={{ color: 'var(--color-success)' }}>HEURISTIC COST: 14.2ms // 0 SUBOPTIMAL</div>
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
        MULTIMODAL AI // HEURISTIC NAVIGATOR
      </div>
    </div>
  );
};
