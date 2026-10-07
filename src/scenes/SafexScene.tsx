import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createStudioGround, setupStudioLighting, safeCreateRenderer, safeDisposeRenderer } from './threeUtils';

interface SafexSceneProps {
  interactive?: boolean;
}

export const SafexScene: React.FC<SafexSceneProps> = ({ interactive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = safeCreateRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    if (!renderer) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 380;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Atmospheric subterranean depth cueing
    scene.fog = new THREE.FogExp2(0x0a0d14, 0.075);

    // Industrial simulation camera (42mm equivalent perspective)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(4.6, 3.8, 5.6);
    camera.lookAt(0, 0.1, 0);

    setupStudioLighting(scene);
    createStudioGround(scene, 6.0, 6.0, -1.6, 2.4);

    const mineGroup = new THREE.Group();
    scene.add(mineGroup);

    // --- 1. SUBTERRANEAN ROCK STRATA & CUTAWAY FLOORS ---
    // Deep basalt & shale rock material with high roughness
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.85,
      metalness: 0.15
    });

    const strataMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.75,
      metalness: 0.2
    });

    // 3 Cutaway Geological Tiers
    const tiers = [
      { y: 0.9, w: 3.8, d: 2.8, depthLabel: "SURFACE PORTAL // 0.0M" },
      { y: -0.1, w: 4.2, d: 3.2, depthLabel: "DRIFT LEVEL 01 // -120M" },
      { y: -1.1, w: 4.6, d: 3.6, depthLabel: "STOPE LEVEL 02 // -280M" }
    ];

    tiers.forEach((tier) => {
      // Main rock plate
      const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(tier.w, 0.09, tier.d), rockMat);
      floorMesh.position.y = tier.y;
      mineGroup.add(floorMesh);

      // Chiseled strata edge border
      const edgeMesh = new THREE.Mesh(new THREE.BoxGeometry(tier.w + 0.04, 0.03, tier.d + 0.04), strataMat);
      edgeMesh.position.y = tier.y + 0.05;
      mineGroup.add(edgeMesh);

      // Technical boundary wireframe edge
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(tier.w, 0.09, tier.d)),
        new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 })
      );
      edges.position.y = tier.y;
      mineGroup.add(edges);
    });

    // --- 2. UNDERGROUND MINE RAILS (Narrow-Gauge Cart Track) ---
    // Dual steel rails running along Drift Level 01 and Stope Level 02
    const steelRailMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.25,
      metalness: 0.85
    });

    const timberTieMat = new THREE.MeshStandardMaterial({
      color: 0x6b4423, // Weathered mine timber sleeper
      roughness: 0.9,
      metalness: 0.05
    });

    // Rails along Level 02 (-280m stope drift)
    const railLength = 3.2;
    const railGauge = 0.28;
    const zRail = 0.4;
    const yRail = -1.05;

    // Parallel rails
    [-railGauge / 2, railGauge / 2].forEach((oz) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(railLength, 0.025, 0.02),
        steelRailMat
      );
      rail.position.set(0.1, yRail + 0.03, zRail + oz);
      mineGroup.add(rail);
    });

    // Wooden Cross Sleepers / Ties every 0.22m
    const tieCount = 14;
    for (let i = 0; i < tieCount; i++) {
      const tx = -1.4 + (i / (tieCount - 1)) * railLength;
      const tie = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.02, railGauge + 0.12),
        timberTieMat
      );
      tie.position.set(tx, yRail + 0.015, zRail);
      mineGroup.add(tie);
    }

    // --- 3. STRUCTURAL TIMBER & SAFETY-ORANGE STEEL MINE ARCHES ---
    const archMat = new THREE.MeshStandardMaterial({
      color: 0xf97316, // Safety OSHA industrial orange
      roughness: 0.35,
      metalness: 0.45
    });

    const archPositions = [
      { x: -1.0, y: -0.1, z: 0.4 },
      { x: -0.2, y: -0.1, z: 0.4 },
      { x: 0.6, y: -0.1, z: 0.4 },
      { x: 1.4, y: -0.1, z: 0.4 },
      { x: -0.8, y: -1.1, z: 0.4 },
      { x: 0.0, y: -1.1, z: 0.4 },
      { x: 0.8, y: -1.1, z: 0.4 },
      { x: 1.6, y: -1.1, z: 0.4 }
    ];

    archPositions.forEach((pos) => {
      const archGroup = new THREE.Group();
      archGroup.position.set(pos.x, pos.y + 0.05, pos.z);

      // Left upright column
      const colL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.62, 0.05), archMat);
      colL.position.set(0, 0.31, -0.32);
      archGroup.add(colL);

      // Right upright column
      const colR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.62, 0.05), archMat);
      colR.position.set(0, 0.31, 0.32);
      archGroup.add(colR);

      // Overhead crosstie collar beam
      const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.72), archMat);
      crossBeam.position.set(0, 0.62, 0);
      archGroup.add(crossBeam);

      mineGroup.add(archGroup);
    });

    // --- 4. HOIST HEADFRAME & VERTICAL CAGE SHAFT ---
    const shaftMat = new THREE.MeshStandardMaterial({
      color: 0x3b4252,
      roughness: 0.4,
      metalness: 0.8
    });

    // 4 Heavy corner shaft steel columns
    [-0.32, 0.32].forEach((ox) => {
      [-0.32, 0.32].forEach((oz) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.5, 8), shaftMat);
        pillar.position.set(-1.45 + ox, -0.1, -0.7 + oz);
        mineGroup.add(pillar);
      });
    });

    // Hoist Steel Cable Line down the shaft
    const cableGeo = new THREE.CylinderGeometry(0.008, 0.008, 2.4, 6);
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 });
    const cable = new THREE.Mesh(cableGeo, cableMat);
    cable.position.set(-1.45, -0.1, -0.7);
    mineGroup.add(cable);

    // Elevator Cage Frame inside shaft
    const cageGeo = new THREE.BoxGeometry(0.55, 0.65, 0.55);
    const cageWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(cageGeo),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 })
    );
    cageWire.position.set(-1.45, -0.1, -0.7);
    mineGroup.add(cageWire);

    // --- 5. INDUSTRIAL SUBTERRANEAN LIGHTING ---
    // Warm halogen bulkhead cage luminaires along the tunnel
    const lanternPositions = [
      [-1.0, 0.35, 0.65],
      [0.6, 0.35, 0.65],
      [-0.8, -0.65, 0.65],
      [0.8, -0.65, 0.65]
    ];

    lanternPositions.forEach(([lx, ly, lz]) => {
      // Luminaire cage body
      const fixture = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.08, 8),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85 })
      );
      fixture.position.set(lx, ly, lz);
      mineGroup.add(fixture);

      // Bulb
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.032, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfde047 })
      );
      bulb.position.set(lx, ly - 0.03, lz);
      mineGroup.add(bulb);

      // Warm industrial light cast
      const lanternLight = new THREE.PointLight(0xfde047, 0.65, 2.2);
      lanternLight.position.set(lx, ly - 0.04, lz);
      mineGroup.add(lanternLight);
    });

    // --- 6. HAZARD ZONE (Methane Pocket / Unstable Ceiling Zone) ---
    const hazardGroup = new THREE.Group();
    hazardGroup.position.set(1.5, -1.05, 0.4);
    mineGroup.add(hazardGroup);

    // Hazard Area Warning Radius Decal
    const hazardDiscGeo = new THREE.RingGeometry(0.08, 0.65, 32);
    hazardDiscGeo.rotateX(-Math.PI / 2);
    const hazardDiscMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const hazardDisc = new THREE.Mesh(hazardDiscGeo, hazardDiscMat);
    hazardGroup.add(hazardDisc);

    // Industrial Intrinsically Safe Flashing Beacon
    const strobeBeaconGeo = new THREE.OctahedronGeometry(0.11, 0);
    const strobeBeaconMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xef4444,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const strobeBeacon = new THREE.Mesh(strobeBeaconGeo, strobeBeaconMat);
    strobeBeacon.position.y = 0.25;
    hazardGroup.add(strobeBeacon);

    // Warning Light
    const hazardLight = new THREE.PointLight(0xef4444, 0.8, 2.0);
    hazardLight.position.set(0, 0.3, 0);
    hazardGroup.add(hazardLight);

    // --- 7. SAFE EVACUATION ROUTE (ARCore Spatial Corridor) ---
    // Smooth Catmull-Rom spline: Hazard boundary -> Stope -> Hoist Shaft -> Level 01 -> Surface Refuge
    const escapeWaypoints = [
      new THREE.Vector3(1.1, -1.05, 0.4),
      new THREE.Vector3(0.0, -1.05, 0.4),
      new THREE.Vector3(-1.0, -1.05, 0.1),
      new THREE.Vector3(-1.45, -0.75, -0.7), // Shaft Ascent Base
      new THREE.Vector3(-1.45, -0.05, -0.7), // Shaft Mid Landing
      new THREE.Vector3(-0.8, -0.05, 0.2),
      new THREE.Vector3(0.4, -0.05, 0.4),
      new THREE.Vector3(1.2, 0.45, 0.2),    // Surface Incline Ramp
      new THREE.Vector3(1.45, 0.95, -0.4)   // Surface Safe Refuge Portal
    ];

    const escapeCurve = new THREE.CatmullRomCurve3(escapeWaypoints);
    const escapePts = escapeCurve.getPoints(120);
    const escapeGeo = new THREE.BufferGeometry().setFromPoints(escapePts);
    const escapeMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      linewidth: 2,
      transparent: true,
      opacity: 0.92
    });
    const escapeLine = new THREE.Line(escapeGeo, escapeMat);
    mineGroup.add(escapeLine);

    // Directional green chevron flow markers along route
    const flowMarkerGeo = new THREE.ConeGeometry(0.038, 0.11, 8);
    flowMarkerGeo.rotateX(Math.PI / 2);
    const flowMarkerMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const flowMarkers: THREE.Mesh[] = [];
    for (let f = 0; f < 6; f++) {
      const fm = new THREE.Mesh(flowMarkerGeo, flowMarkerMat);
      mineGroup.add(fm);
      flowMarkers.push(fm);
    }

    // Surface Safe Refuge Chamber Anchor Box
    const refugePortalGeo = new THREE.BoxGeometry(0.35, 0.45, 0.35);
    const refugePortalMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x10b981,
      emissiveIntensity: 0.35,
      roughness: 0.3
    });
    const refugePortal = new THREE.Mesh(refugePortalGeo, refugePortalMat);
    refugePortal.position.copy(escapeWaypoints[escapeWaypoints.length - 1]);
    mineGroup.add(refugePortal);

    // --- 8. BELIEVABLE MINER FIGURE & CAP LAMP SPOTLIGHT ---
    const minerGroup = new THREE.Group();
    mineGroup.add(minerGroup);

    // Miner Body (Scale: ~1.75m scaled down to fit simulation)
    const suitMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const minerTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.12, 12), suitMat);
    minerTorso.position.y = 0.09;
    minerGroup.add(minerTorso);

    // Safety Hard Hat (Fluorescent Orange/Yellow)
    const helmetMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.3,
      metalness: 0.2
    });
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 12), helmetMat);
    helmet.position.y = 0.17;
    minerGroup.add(helmet);

    // Cap Lamp Headlight Beam (Physical SpotLight projecting along path)
    const capLamp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.02, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    capLamp.rotation.x = Math.PI / 2;
    capLamp.position.set(0, 0.17, 0.045);
    minerGroup.add(capLamp);

    // Forward cap lamp light beam
    const headlampLight = new THREE.SpotLight(0xfffaed, 1.2, 2.5, Math.PI / 5, 0.5, 1);
    headlampLight.position.set(0, 0.17, 0.05);
    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(0, 0.05, 0.8);
    minerGroup.add(spotTarget);
    headlampLight.target = spotTarget;
    minerGroup.add(headlampLight);

    // Miner Telemetry Positioning Radar Disc
    const minerRadarGeo = new THREE.RingGeometry(0.08, 0.18, 24);
    minerRadarGeo.rotateX(-Math.PI / 2);
    const minerRadarMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide
    });
    const minerRadar = new THREE.Mesh(minerRadarGeo, minerRadarMat);
    minerRadar.position.y = 0.01;
    minerGroup.add(minerRadar);

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
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = (performance.now() - startTime) * 0.001;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Miner traverses along the escape curve
      const minerProg = (t * 0.08) % 1;
      const minerPos = escapeCurve.getPointAt(minerProg);
      const minerTangent = escapeCurve.getTangentAt(minerProg);
      minerGroup.position.copy(minerPos);
      minerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), minerTangent);

      // Radar pulse
      const radarScale = 1 + Math.sin(t * 4.0) * 0.35;
      minerRadar.scale.set(radarScale, radarScale, 1);

      // Hazard strobe rotation & warning pulse
      strobeBeacon.rotation.y = t * 2.5;
      const hazPulse = 1 + Math.sin(t * 4.0) * 0.25;
      hazardDisc.scale.set(hazPulse, hazPulse, 1);
      hazardLight.intensity = 0.5 + Math.sin(t * 6.0) * 0.5;

      // Flow direction markers along green evacuation route
      flowMarkers.forEach((fm, idx) => {
        const p = ((t * 0.14 + idx * 0.16) % 1);
        const pt = escapeCurve.getPointAt(p);
        const tangent = escapeCurve.getTangentAt(p);
        fm.position.copy(pt);
        fm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      });

      // Simulation turntable drift + mouse tilt
      mineGroup.rotation.y = t * 0.05 + mouse.x * 0.28;
      mineGroup.rotation.x = mouse.y * 0.12;

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
      safeDisposeRenderer(renderer, container);
    };
  }, [interactive]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      {/* Engineering HUD Simulation Overlays */}
      <div 
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--status-active)',
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
        <span className="tech-status-dot" style={{ backgroundColor: 'var(--status-active)' }} />
        <span>SIMULATION: 3D GIS MINE SAFETY // EVACUATION CORRIDOR ACTIVE</span>
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
        <div>DEPTH: -280.4M // STOPE 02</div>
        <div style={{ color: 'var(--text-accent)' }}>CH4: 0.02% [NOMINAL] · O2: 20.9%</div>
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
        CAM: SIM-PROJ 42MM // 6-DoF ARCore
      </div>
    </div>
  );
};
