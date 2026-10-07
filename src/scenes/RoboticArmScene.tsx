import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createStudioGround, setupStudioLighting, safeCreateRenderer, safeDisposeRenderer } from './threeUtils';

interface RoboticArmSceneProps {
  interactive?: boolean;
}

export const RoboticArmScene: React.FC<RoboticArmSceneProps> = ({ interactive = true }) => {
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
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(3.8, 3.2, 5.2);
    camera.lookAt(0, 0.85, 0);

    setupStudioLighting(scene);
    createStudioGround(scene, 5.2, 5.2, 0, 1.9);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- REALISTIC INDUSTRIAL PBR MATERIALS ---
    // CNC Milled 6061-T6 Aircraft Aluminum with bright satin sheen
    const alumMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.22,
      metalness: 0.72
    });

    // Anodized Structural Actuator & Motor Enclosures
    const motorMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.35,
      metalness: 0.45
    });

    // Hex Fastener Bolts & Shafts (Bright Nickel/Stainless Steel)
    const fastenerMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.18,
      metalness: 0.95
    });

    // Precision Gold Brass Bushings
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.22,
      metalness: 0.92
    });

    // High-Traction Nitrile Rubber Gripper Pads
    const rubberMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.92,
      metalness: 0.05
    });

    // Flexible Spiral Conduit / Cabling Loom
    const cableMat = new THREE.MeshStandardMaterial({
      color: 0x090b0e,
      roughness: 0.65,
      metalness: 0.3
    });

    // Joint Telemetry Status LEDs (Electric Blue)
    const jointLedMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.65,
      roughness: 0.2
    });

    // Helper: Add hex bolt fasteners around circular flange
    const addBoltCircle = (target: THREE.Group, radius: number, y: number, count: number = 6) => {
      const boltGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.025, 6);
      for (let b = 0; b < count; b++) {
        const ang = (b / count) * Math.PI * 2;
        const bolt = new THREE.Mesh(boltGeo, fastenerMat);
        bolt.position.set(Math.cos(ang) * radius, y, Math.sin(ang) * radius);
        target.add(bolt);
      }
    };

    // --- 1. BASE MOUNTING FLANGE PEDESTAL ---
    const baseGroup = new THREE.Group();
    rootGroup.add(baseGroup);

    const baseFlangeGeo = new THREE.CylinderGeometry(0.76, 0.84, 0.16, 36);
    const baseFlange = new THREE.Mesh(baseFlangeGeo, alumMat);
    baseFlange.position.y = 0.08;
    baseGroup.add(baseFlange);

    // Counter-sunk hex mounting bolts around base
    addBoltCircle(baseGroup, 0.74, 0.165, 8);

    // Degree calibration ring on base
    const calRingGeo = new THREE.RingGeometry(0.75, 0.82, 36);
    calRingGeo.rotateX(-Math.PI / 2);
    const calRing = new THREE.Mesh(calRingGeo, new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4
    }));
    calRing.position.y = 0.165;
    baseGroup.add(calRing);

    // --- 2. JOINT 1 (BASE TURNTABLE AZIMUTH) ---
    const j1Group = new THREE.Group();
    j1Group.position.y = 0.16;
    rootGroup.add(j1Group);

    // Turntable bearing casing
    const j1Casing = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.50, 0.28, 28), motorMat);
    j1Casing.position.y = 0.14;
    j1Group.add(j1Casing);

    // Joint 1 Telemetry Ring
    const j1Ring = new THREE.Mesh(new THREE.TorusGeometry(0.49, 0.018, 16, 32), jointLedMat);
    j1Ring.position.y = 0.26;
    j1Ring.rotateX(Math.PI / 2);
    j1Group.add(j1Ring);

    // Cable Gland on Joint 1 base
    const j1CableGland = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08, 8), fastenerMat);
    j1CableGland.position.set(-0.35, 0.14, -0.32);
    j1CableGland.rotateZ(Math.PI / 3);
    j1Group.add(j1CableGland);

    // --- 3. JOINT 2 (SHOULDER PIVOT) ---
    const j2Group = new THREE.Group();
    j2Group.position.set(0, 0.32, 0);
    j1Group.add(j2Group);

    // Transverse shoulder motor cylinder with cooling ribs
    const j2Motor = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.54, 24), motorMat);
    j2Motor.rotateZ(Math.PI / 2);
    j2Group.add(j2Motor);

    // End caps with fastener bolts
    const j2CapL = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.03, 24), alumMat);
    j2CapL.rotateZ(Math.PI / 2);
    j2CapL.position.x = -0.27;
    j2Group.add(j2CapL);

    const j2CapR = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.03, 24), alumMat);
    j2CapR.rotateZ(Math.PI / 2);
    j2CapR.position.x = 0.27;
    j2Group.add(j2CapR);

    // Brass pivot bushings
    const j2Bushing = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.58, 16), brassMat);
    j2Bushing.rotateZ(Math.PI / 2);
    j2Group.add(j2Bushing);

    // Lower Arm Link (Dual CNC milled plates with pocket cutouts)
    const link1Geo = new THREE.BoxGeometry(0.16, 1.25, 0.24);
    const link1 = new THREE.Mesh(link1Geo, alumMat);
    link1.position.y = 0.625;
    j2Group.add(link1);

    // Weight reduction pocket cutout visual inserts
    for (let p = 0; p < 3; p++) {
      const pocket = new THREE.Mesh(
        new THREE.BoxGeometry(0.17, 0.22, 0.14),
        new THREE.MeshStandardMaterial({ color: 0x1a202c, roughness: 0.7 })
      );
      pocket.position.set(0, 0.35 + p * 0.3, 0);
      j2Group.add(pocket);
    }

    // Cable bracket guides on Link 1
    const clip1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.06), fastenerMat);
    clip1.position.set(0.09, 0.625, 0.13);
    j2Group.add(clip1);

    // --- 4. JOINT 3 (ELBOW PIVOT) ---
    const j3Group = new THREE.Group();
    j3Group.position.set(0, 1.25, 0);
    j2Group.add(j3Group);

    const j3Motor = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.46, 24), motorMat);
    j3Motor.rotateZ(Math.PI / 2);
    j3Group.add(j3Motor);

    const j3Ring = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.015, 16, 32), jointLedMat);
    j3Ring.rotateY(Math.PI / 2);
    j3Group.add(j3Ring);

    // Forearm Link with chamfers
    const link2Geo = new THREE.BoxGeometry(0.14, 1.05, 0.18);
    const link2 = new THREE.Mesh(link2Geo, alumMat);
    link2.position.y = 0.525;
    j3Group.add(link2);

    // Forearm pocket inserts
    for (let p = 0; p < 2; p++) {
      const pocket2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.26, 0.10),
        new THREE.MeshStandardMaterial({ color: 0x1a202c, roughness: 0.7 })
      );
      pocket2.position.set(0, 0.38 + p * 0.35, 0);
      j3Group.add(pocket2);
    }

    // --- 5. JOINT 4 & 5 (WRIST PITCH & INDUSTRIAL GRIPPER) ---
    const j4Group = new THREE.Group();
    j4Group.position.set(0, 1.05, 0);
    j3Group.add(j4Group);

    // Spherical wrist pivot actuator
    const wristPivot = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), motorMat);
    j4Group.add(wristPivot);

    // Gripper Base Mount Flange with hex screws
    const gripperMount = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.08, 0.18), alumMat);
    gripperMount.position.y = 0.12;
    j4Group.add(gripperMount);
    addBoltCircle(j4Group, 0.09, 0.165, 4);

    // Linear guide rail bar across gripper
    const guideRail = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 8), fastenerMat);
    guideRail.rotateZ(Math.PI / 2);
    guideRail.position.y = 0.18;
    j4Group.add(guideRail);

    // Center precision drive lead screw
    const leadScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.24, 8), brassMat);
    leadScrew.rotateZ(Math.PI / 2);
    leadScrew.position.y = 0.22;
    j4Group.add(leadScrew);

    // Optical limit sensor LED on gripper
    const optLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x34d399 })
    );
    optLed.position.set(0, 0.16, 0.10);
    j4Group.add(optLed);

    // Dual Parallel Jaw Gripper Fingers with Rubber Tip Pads
    const fingerGeo = new THREE.BoxGeometry(0.045, 0.30, 0.08);

    const fingerLeft = new THREE.Mesh(fingerGeo, alumMat);
    fingerLeft.position.set(-0.08, 0.29, 0);
    j4Group.add(fingerLeft);

    const tipLeft = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.09, 0.082), rubberMat);
    tipLeft.position.y = 0.11;
    fingerLeft.add(tipLeft);

    const fingerRight = new THREE.Mesh(fingerGeo, alumMat);
    fingerRight.position.set(0.08, 0.29, 0);
    j4Group.add(fingerRight);

    const tipRight = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.09, 0.082), rubberMat);
    tipRight.position.y = 0.11;
    fingerRight.add(tipRight);

    // --- 6. FLEXIBLE INDUSTRIAL WIRING CONDUIT HARNESS ---
    // A 3D tube geometry spline flexing along the arm linkages
    const cableSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, 0.18, -0.32),
      new THREE.Vector3(-0.25, 0.40, -0.20),
      new THREE.Vector3(-0.12, 0.85, 0.14),
      new THREE.Vector3(-0.10, 1.45, 0.12),
      new THREE.Vector3(-0.08, 2.10, 0.10),
      new THREE.Vector3(0.0, 2.35, 0.05)
    ]);
    const cableGeo = new THREE.TubeGeometry(cableSpline, 36, 0.022, 8, false);
    const cableMesh = new THREE.Mesh(cableGeo, cableMat);
    rootGroup.add(cableMesh);

    // --- 7. TRAJECTORY TOOL PATH ARC (Industrial Pick & Place Cycle) ---
    const trajectoryPts = [
      new THREE.Vector3(0.3, 1.5, 0.7),
      new THREE.Vector3(0.7, 1.8, 0.4),
      new THREE.Vector3(0.9, 1.3, -0.3),
      new THREE.Vector3(0.6, 0.7, -0.6)
    ];
    const trajCurve = new THREE.CatmullRomCurve3(trajectoryPts);
    const trajGeo = new THREE.BufferGeometry().setFromPoints(trajCurve.getPoints(60));
    const trajLine = new THREE.Line(trajGeo, new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.08,
      gapSize: 0.06,
      transparent: true,
      opacity: 0.5
    }));
    trajLine.computeLineDistances();
    scene.add(trajLine);

    // Target object for pick-and-place simulation (Precision machined hex workpiece)
    const workpiece = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.12, 6),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.25 })
    );
    workpiece.position.set(0.6, 0.06, -0.6);
    scene.add(workpiece);

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

      const t = (performance.now() - startTime) * 0.001 * 0.7; // Controlled deliberate industrial velocity

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Realistic Kinematics Trajectory respecting joint constraints:
      // Base Azimuth: -25° to +25°
      j1Group.rotation.y = Math.sin(t * 0.85) * 0.44;
      // Shoulder: -18° to +22°
      j2Group.rotation.z = -0.28 + Math.sin(t * 0.85 + 0.3) * 0.22;
      // Elbow: +35° to +75°
      j3Group.rotation.z = 0.62 + Math.cos(t * 0.85) * 0.34;
      // Wrist pitch: -20° to +15°
      j4Group.rotation.z = -0.32 + Math.sin(t * 0.85 - 0.4) * 0.20;

      // Gripper synchronized pick-and-place cycle
      const pinch = 0.065 + Math.sin(t * 1.7) * 0.028;
      fingerLeft.position.x = -pinch;
      fingerRight.position.x = pinch;

      // Turntable drift & mouse tilt
      rootGroup.rotation.y = mouse.x * 0.25;

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

      {/* Engineering Overlay Telemetry */}
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
        <span>SIMULATION: 5-DoF KINEMATICS // CLOSED-LOOP ENCODERS</span>
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
        <div>REPEATABILITY: ±0.05MM // S-CURVE DAMPED</div>
        <div style={{ color: 'var(--text-accent)' }}>CNC 6061-T6 + CORELESS SERVOS + CABLE LOOM</div>
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
        PAYLOAD: 1.2KG NOMINAL // OPTICAL LIMIT SENSORS
      </div>
    </div>
  );
};
