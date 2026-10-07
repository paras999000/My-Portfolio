import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface SafexSceneProps {
  interactive?: boolean;
}

export const SafexScene: React.FC<SafexSceneProps> = ({ interactive = true }) => {
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
    camera.position.set(4.5, 3.8, 6.2);
    camera.lookAt(0, -0.2, 0);

    const mineGroup = new THREE.Group();
    scene.add(mineGroup);

    // --- 1. Subterranean Strata & Mine Levels ---
    // 3 distinct depth levels: Level 0 (Surface Shaft), Level -1 (-120m), Level -2 (-280m)
    const levelY = [0.8, -0.2, -1.2];

    levelY.forEach((ly) => {
      const planeGrid = new THREE.GridHelper(4.5, 10, 0x1e293b, 0x0f172a);
      planeGrid.position.y = ly;
      mineGroup.add(planeGrid);
    });

    // --- 2. Tunnel Network (Wireframe & Structural Corridors) ---
    // Vertical ventilation & elevator shafts connecting levels
    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.2, 8, 1, true);
    const shaftMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const shaft1 = new THREE.Mesh(shaftGeo, shaftMat);
    shaft1.position.set(-1.2, -0.2, -0.8);
    mineGroup.add(shaft1);

    const shaft2 = new THREE.Mesh(shaftGeo, shaftMat);
    shaft2.position.set(1.4, -0.2, 0.9);
    mineGroup.add(shaft2);

    // Horizontal mine galleries (structural box tunnels)
    const tunnelBoxes = [
      { pos: [-0.5, 0.8, -0.4], size: [2.2, 0.35, 0.4] },
      { pos: [0.3, -0.2, 0.0], size: [2.8, 0.35, 0.4] },
      { pos: [-0.8, -0.2, 0.5], size: [0.4, 0.35, 1.8] },
      { pos: [0.0, -1.2, 0.4], size: [2.5, 0.35, 0.4] }
    ];

    tunnelBoxes.forEach((tb) => {
      const g = new THREE.BoxGeometry(tb.size[0], tb.size[1], tb.size[2]);
      const edges = new THREE.EdgesGeometry(g);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
        color: 0x475569,
        transparent: true,
        opacity: 0.4
      }));
      line.position.set(tb.pos[0], tb.pos[1], tb.pos[2]);
      mineGroup.add(line);
    });

    // --- 3. Hazard Area (Amber/Red Warning Pulse) ---
    const hazardGroup = new THREE.Group();
    hazardGroup.position.set(1.2, -1.2, 0.4);
    mineGroup.add(hazardGroup);

    const hazardRadiusGeo = new THREE.RingGeometry(0.1, 0.45, 16);
    hazardRadiusGeo.rotateX(-Math.PI / 2);
    const hazardRadiusMat = new THREE.MeshBasicMaterial({
      color: 0xf87171,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const hazardRing = new THREE.Mesh(hazardRadiusGeo, hazardRadiusMat);
    hazardGroup.add(hazardRing);

    const hazardBeaconGeo = new THREE.ConeGeometry(0.15, 0.3, 4);
    const hazardBeaconMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true
    });
    const hazardBeacon = new THREE.Mesh(hazardBeaconGeo, hazardBeaconMat);
    hazardBeacon.position.y = 0.2;
    hazardGroup.add(hazardBeacon);

    // --- 4. Emergency Safe Evacuation Route (Green Glowing Path) ---
    // Path starting from near hazard at Level -2 -> through shaft -> Level -1 -> surface exit
    const routeWaypoints = [
      new THREE.Vector3(0.5, -1.2, 0.4),
      new THREE.Vector3(-0.8, -1.2, 0.4),
      new THREE.Vector3(-1.2, -0.8, 0.0),
      new THREE.Vector3(-1.2, -0.2, -0.8),
      new THREE.Vector3(0.0, -0.2, -0.4),
      new THREE.Vector3(1.2, -0.2, 0.0),
      new THREE.Vector3(1.4, 0.4, 0.6),
      new THREE.Vector3(1.4, 0.8, 0.9),
      new THREE.Vector3(0.2, 0.8, 0.5) // Safe Refuge / Surface
    ];

    const routeCurve = new THREE.CatmullRomCurve3(routeWaypoints);
    const routePoints = routeCurve.getPoints(120);
    const routeGeo = new THREE.BufferGeometry().setFromPoints(routePoints);
    const routeMat = new THREE.LineBasicMaterial({
      color: 0x34d399,
      linewidth: 2,
      transparent: true,
      opacity: 0.85
    });
    const routeLine = new THREE.Line(routeGeo, routeMat);
    mineGroup.add(routeLine);

    // --- 5. Miner Marker & Escort Beacon ---
    const minerGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const minerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const minerMesh = new THREE.Mesh(minerGeo, minerMat);
    mineGroup.add(minerMesh);

    // Miner locator ring
    const minerRingGeo = new THREE.RingGeometry(0.09, 0.16, 16);
    minerRingGeo.rotateX(-Math.PI / 2);
    const minerRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const minerRing = new THREE.Mesh(minerRingGeo, minerRingMat);
    minerMesh.add(minerRing);

    // Surface Safe Evacuation Anchor / Beacon
    const exitBeaconGeo = new THREE.OctahedronGeometry(0.14, 0);
    const exitBeaconMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true
    });
    const exitBeacon = new THREE.Mesh(exitBeaconGeo, exitBeaconMat);
    exitBeacon.position.copy(routeWaypoints[routeWaypoints.length - 1]);
    mineGroup.add(exitBeacon);

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
      const t = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Miner traversal progress along evacuation route
      const minerProgress = (t * 0.12) % 1;
      const posOnRoute = routeCurve.getPointAt(minerProgress);
      minerMesh.position.copy(posOnRoute);

      // Subtle pulse on miner locator ring
      const ringScale = 1 + Math.sin(t * 5.0) * 0.3;
      minerRing.scale.set(ringScale, ringScale, 1);

      // Hazard beacon pulse & warning rotation
      hazardBeacon.rotation.y = t * 1.5;
      const hazScale = 1 + Math.sin(t * 3.5) * 0.25;
      hazardRing.scale.set(hazScale, hazScale, 1);

      // Exit beacon subtle spin
      exitBeacon.rotation.y = t * 0.8;
      exitBeacon.rotation.z = Math.sin(t * 0.5) * 0.4;

      // Slow continuous architectural turntable drift + mouse tilt
      mineGroup.rotation.y = t * 0.08 + mouse.x * 0.25;
      mineGroup.rotation.x = mouse.y * 0.15;

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

      <div 
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--status-active)',
          background: 'rgba(8, 9, 13, 0.75)',
          padding: '3px 8px',
          borderRadius: '2px',
          border: '1px solid var(--border-subtle)',
          pointerEvents: 'none'
        }}
      >
        TELEMETRY: HAZARD → RESPONSE → SAFE ROUTE → EVACUATION
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
        DEPTH: -280M // 6-DoF ARCore CORRIDOR
      </div>
    </div>
  );
};
