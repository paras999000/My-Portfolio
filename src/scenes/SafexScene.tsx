import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createStudioGround, setupStudioLighting } from './threeUtils';

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
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(4.8, 4.0, 5.8);
    camera.lookAt(0, 0.2, 0);

    setupStudioLighting(scene);
    createStudioGround(scene, 5.5, 5.5, -1.6, 2.2);

    const mineGroup = new THREE.Group();
    scene.add(mineGroup);

    // --- 1. SUBTERRANEAN ROCK STRATA CUTAWAY BLOCKS ---
    // Multi-tiered geological layers with tactile rock appearance
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x181c24,
      roughness: 0.9,
      metalness: 0.1
    });

    // 3 Subterranean Tiers: Level 0 (Surface Portal), Level -1 (-120m), Level -2 (-280m)
    const tiers = [
      { y: 0.9, depth: "SURFACE // 0.0M", w: 3.8, d: 2.8 },
      { y: -0.1, depth: "SUB-TIER 01 // -120M", w: 4.2, d: 3.2 },
      { y: -1.1, depth: "SUB-TIER 02 // -280M", w: 4.6, d: 3.6 }
    ];

    tiers.forEach((tier) => {
      // Geological floor plate
      const floorGeo = new THREE.BoxGeometry(tier.w, 0.08, tier.d);
      const floorMesh = new THREE.Mesh(floorGeo, rockMat);
      floorMesh.position.y = tier.y;
      mineGroup.add(floorMesh);

      // Floor boundary wireframe edge
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(floorGeo),
        new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.45 })
      );
      edges.position.y = tier.y;
      mineGroup.add(edges);
    });

    // --- 2. VERTICAL ELEVATOR SHAFT & STRUCTURAL ARCHES ---
    // Mine Hoist Headframe & Vertical Shaft
    const shaftPillarsGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8);
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x3b4252,
      roughness: 0.4,
      metalness: 0.8
    });

    [-0.3, 0.3].forEach((ox) => {
      [-0.3, 0.3].forEach((oz) => {
        const pillar = new THREE.Mesh(shaftPillarsGeo, steelMat);
        pillar.position.set(-1.4 + ox, -0.1, -0.6 + oz);
        mineGroup.add(pillar);
      });
    });

    // Elevator Cage Frame inside shaft
    const cageGeo = new THREE.BoxGeometry(0.55, 0.65, 0.55);
    const cageWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(cageGeo),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
    );
    cageWire.position.set(-1.4, -0.1, -0.6);
    mineGroup.add(cageWire);

    // Tunnel Arch Timber / Steel Reinforcements
    const archMat = new THREE.MeshStandardMaterial({ color: 0x2e3440, roughness: 0.6, metalness: 0.5 });
    const archPositions = [
      { x: -0.6, y: -0.1, z: 0.4 },
      { x: 0.2, y: -0.1, z: 0.4 },
      { x: 1.0, y: -0.1, z: 0.4 },
      { x: -0.4, y: -1.1, z: 0.0 },
      { x: 0.4, y: -1.1, z: 0.0 },
      { x: 1.2, y: -1.1, z: 0.0 }
    ];

    archPositions.forEach((pos) => {
      const archMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.7), archMat);
      archMesh.position.set(pos.x, pos.y + 0.28, pos.z);
      mineGroup.add(archMesh);
    });

    // Subterranean Tunnel Lanterns (Warm utility lighting along corridors)
    const lanternPositions = [
      [-0.6, 0.2, 0.4],
      [1.0, 0.2, 0.4],
      [0.4, -0.8, 0.0]
    ];
    lanternPositions.forEach(([lx, ly, lz]) => {
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfde047 })
      );
      bulb.position.set(lx, ly, lz);
      mineGroup.add(bulb);

      const lanternLight = new THREE.PointLight(0xfde047, 0.8, 2.5);
      lanternLight.position.set(lx, ly, lz);
      mineGroup.add(lanternLight);
    });

    // --- 3. HAZARD ZONE (Simulated Methane / Collapse Zone) ---
    const hazardGroup = new THREE.Group();
    hazardGroup.position.set(1.5, -1.05, 0.0);
    mineGroup.add(hazardGroup);

    // Hazard Area Warning Radius Decal
    const hazardDiscGeo = new THREE.RingGeometry(0.05, 0.55, 32);
    hazardDiscGeo.rotateX(-Math.PI / 2);
    const hazardDiscMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const hazardDisc = new THREE.Mesh(hazardDiscGeo, hazardDiscMat);
    hazardGroup.add(hazardDisc);

    // Hazard Industrial Beacon Strobe
    const strobeBeaconGeo = new THREE.OctahedronGeometry(0.12, 0);
    const strobeBeaconMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xef4444,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const strobeBeacon = new THREE.Mesh(strobeBeaconGeo, strobeBeaconMat);
    strobeBeacon.position.y = 0.25;
    hazardGroup.add(strobeBeacon);

    // --- 4. SAFE EVACUATION ESCORT ROUTE (Animate Corridors) ---
    // Smooth 3D spline traversing from hazard boundary at -280m -> Shaft -> Level -1 -> Surface refuge
    const escapeWaypoints = [
      new THREE.Vector3(0.9, -1.05, 0.0),
      new THREE.Vector3(0.0, -1.05, 0.0),
      new THREE.Vector3(-1.0, -1.05, -0.2),
      new THREE.Vector3(-1.4, -0.8, -0.6), // Shaft Ascent
      new THREE.Vector3(-1.4, -0.05, -0.6), // Shaft Mid Tier
      new THREE.Vector3(-0.8, -0.05, 0.2),
      new THREE.Vector3(0.4, -0.05, 0.4),
      new THREE.Vector3(1.2, 0.45, 0.2),   // Surface Incline
      new THREE.Vector3(1.4, 0.95, -0.4)   // Surface Safe Refuge Portal
    ];

    const escapeCurve = new THREE.CatmullRomCurve3(escapeWaypoints);
    const escapePts = escapeCurve.getPoints(120);
    const escapeGeo = new THREE.BufferGeometry().setFromPoints(escapePts);
    const escapeMat = new THREE.LineBasicMaterial({
      color: 0x34d399,
      linewidth: 2,
      transparent: true,
      opacity: 0.88
    });
    const escapeLine = new THREE.Line(escapeGeo, escapeMat);
    mineGroup.add(escapeLine);

    // Directional flow markers along evacuation route
    const flowMarkerGeo = new THREE.ConeGeometry(0.04, 0.1, 8);
    flowMarkerGeo.rotateX(Math.PI / 2);
    const flowMarkerMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const flowMarkers: THREE.Mesh[] = [];
    for (let f = 0; f < 5; f++) {
      const fm = new THREE.Mesh(flowMarkerGeo, flowMarkerMat);
      mineGroup.add(fm);
      flowMarkers.push(fm);
    }

    // --- 5. MINER TELEMETRY MARKER ---
    const minerGroup = new THREE.Group();
    mineGroup.add(minerGroup);

    const minerMarkerMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.6,
        roughness: 0.2
      })
    );
    minerGroup.add(minerMarkerMesh);

    // Miner Radar Ring
    const minerRadarGeo = new THREE.RingGeometry(0.12, 0.24, 24);
    minerRadarGeo.rotateX(-Math.PI / 2);
    const minerRadarMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const minerRadar = new THREE.Mesh(minerRadarGeo, minerRadarMat);
    minerGroup.add(minerRadar);

    // Surface Refuge Safe Anchor Point
    const refugePortalGeo = new THREE.BoxGeometry(0.3, 0.4, 0.3);
    const refugePortalMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.4,
      roughness: 0.3
    });
    const refugePortal = new THREE.Mesh(refugePortalGeo, refugePortalMat);
    refugePortal.position.copy(escapeWaypoints[escapeWaypoints.length - 1]);
    mineGroup.add(refugePortal);

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
      if (!isVisible) return;

      const t = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Miner progression along escape curve
      const minerProg = (t * 0.09) % 1;
      const minerPos = escapeCurve.getPointAt(minerProg);
      minerGroup.position.copy(minerPos);

      // Radar pulse
      const radarScale = 1 + Math.sin(t * 4.0) * 0.35;
      minerRadar.scale.set(radarScale, radarScale, 1);

      // Hazard strobe rotation & warning pulse
      strobeBeacon.rotation.y = t * 2.0;
      const hazPulse = 1 + Math.sin(t * 3.5) * 0.2;
      hazardDisc.scale.set(hazPulse, hazPulse, 1);

      // Flow direction markers along green evacuation route
      flowMarkers.forEach((fm, idx) => {
        const p = ((t * 0.15 + idx * 0.2) % 1);
        const pt = escapeCurve.getPointAt(p);
        const tangent = escapeCurve.getTangentAt(p);
        fm.position.copy(pt);
        fm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      });

      // Simulation turntable drift + mouse tilt
      mineGroup.rotation.y = t * 0.06 + mouse.x * 0.3;
      mineGroup.rotation.x = mouse.y * 0.15;

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
          color: 'var(--status-active)',
          background: 'rgba(8, 9, 13, 0.85)',
          padding: '4px 10px',
          borderRadius: '2px',
          border: '1px solid var(--border-subtle)',
          pointerEvents: 'none'
        }}
      >
        SIMULATION: HAZARD → RESPONSE → SAFE ROUTE → EVACUATION
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
