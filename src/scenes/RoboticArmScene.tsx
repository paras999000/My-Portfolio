import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createStudioGround, setupStudioLighting } from './threeUtils';

interface RoboticArmSceneProps {
  interactive?: boolean;
}

export const RoboticArmScene: React.FC<RoboticArmSceneProps> = ({ interactive = true }) => {
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
    camera.position.set(3.8, 3.2, 5.2);
    camera.lookAt(0, 0.8, 0);

    setupStudioLighting(scene);
    createStudioGround(scene, 5, 5, 0, 1.9);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- REALISTIC MECHANICAL PROTOTYPE MATERIALS ---
    // Brushed aircraft aluminum links
    const alumMat = new THREE.MeshStandardMaterial({
      color: 0x3a4454,
      roughness: 0.28,
      metalness: 0.85
    });

    // Dark anodized structural brackets & motor casing
    const motorMat = new THREE.MeshStandardMaterial({
      color: 0x141820,
      roughness: 0.45,
      metalness: 0.75
    });

    // Gold brass pivot bushings
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.95
    });

    // High-visibility joint indicator rings (electric blue LED rings)
    const jointLedMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });

    // --- 1. BASE MOUNTING PEDESTAL ---
    const baseFlangeGeo = new THREE.CylinderGeometry(0.75, 0.82, 0.16, 32);
    const baseFlange = new THREE.Mesh(baseFlangeGeo, alumMat);
    baseFlange.position.y = 0.08;
    rootGroup.add(baseFlange);

    // Base calibration tick ring
    const calRingGeo = new THREE.RingGeometry(0.76, 0.82, 32);
    calRingGeo.rotateX(-Math.PI / 2);
    const calRing = new THREE.Mesh(calRingGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 }));
    calRing.position.y = 0.165;
    rootGroup.add(calRing);

    // --- 2. JOINT 1 (BASE TURNTABLE AZIMUTH) ---
    const j1Group = new THREE.Group();
    j1Group.position.y = 0.16;
    rootGroup.add(j1Group);

    const j1MotorHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.28, 24), motorMat);
    j1MotorHousing.position.y = 0.14;
    j1Group.add(j1MotorHousing);

    // Joint 1 Status Ring
    const j1Ring = new THREE.Mesh(new THREE.TorusGeometry(0.49, 0.02, 16, 32), jointLedMat);
    j1Ring.position.y = 0.26;
    j1Ring.rotateX(Math.PI / 2);
    j1Group.add(j1Ring);

    // --- 3. JOINT 2 (SHOULDER PIVOT) ---
    const j2Group = new THREE.Group();
    j2Group.position.set(0, 0.32, 0);
    j1Group.add(j2Group);

    // Transverse motor cylinder at shoulder
    const j2Motor = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.52, 24), motorMat);
    j2Motor.rotateZ(Math.PI / 2);
    j2Group.add(j2Motor);

    const j2Bushing = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.54, 16), brassMat);
    j2Bushing.rotateZ(Math.PI / 2);
    j2Group.add(j2Bushing);

    // Lower Arm Link (Dual parallel plates with pocket cutouts)
    const link1Geo = new THREE.BoxGeometry(0.16, 1.25, 0.24);
    const link1 = new THREE.Mesh(link1Geo, alumMat);
    link1.position.y = 0.625;
    j2Group.add(link1);

    // --- 4. JOINT 3 (ELBOW PIVOT) ---
    const j3Group = new THREE.Group();
    j3Group.position.set(0, 1.25, 0);
    j2Group.add(j3Group);

    const j3Motor = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.44, 24), motorMat);
    j3Motor.rotateZ(Math.PI / 2);
    j3Group.add(j3Motor);

    const j3Ring = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.015, 16, 32), jointLedMat);
    j3Ring.rotateY(Math.PI / 2);
    j3Group.add(j3Ring);

    // Forearm Link
    const link2Geo = new THREE.BoxGeometry(0.14, 1.05, 0.18);
    const link2 = new THREE.Mesh(link2Geo, alumMat);
    link2.position.y = 0.525;
    j3Group.add(link2);

    // --- 5. JOINT 4 & 5 (WRIST PITCH & END-EFFECTOR GRIPPER) ---
    const j4Group = new THREE.Group();
    j4Group.position.set(0, 1.05, 0);
    j3Group.add(j4Group);

    const wristPivot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), motorMat);
    j4Group.add(wristPivot);

    // Gripper Base Plate
    const gripperMount = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.16), alumMat);
    gripperMount.position.y = 0.12;
    j4Group.add(gripperMount);

    // Dual Parallel Jaw Gripper Fingers with Rubber Tip Pads
    const fingerGeo = new THREE.BoxGeometry(0.04, 0.28, 0.08);
    const rubberTipMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.95 });

    const fingerLeft = new THREE.Mesh(fingerGeo, alumMat);
    fingerLeft.position.set(-0.08, 0.26, 0);
    j4Group.add(fingerLeft);

    const tipLeft = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.08, 0.082), rubberTipMat);
    tipLeft.position.y = 0.10;
    fingerLeft.add(tipLeft);

    const fingerRight = new THREE.Mesh(fingerGeo, alumMat);
    fingerRight.position.set(0.08, 0.26, 0);
    j4Group.add(fingerRight);

    const tipRight = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.08, 0.082), rubberTipMat);
    tipRight.position.y = 0.10;
    fingerRight.add(tipRight);

    // --- 6. SUBTLE TRAJECTORY ARC RIBBON ---
    const trajectoryPts = [
      new THREE.Vector3(0.3, 1.5, 0.7),
      new THREE.Vector3(0.7, 1.8, 0.4),
      new THREE.Vector3(0.9, 1.3, -0.3),
      new THREE.Vector3(0.6, 0.7, -0.6)
    ];
    const trajCurve = new THREE.CatmullRomCurve3(trajectoryPts);
    const trajGeo = new THREE.BufferGeometry().setFromPoints(trajCurve.getPoints(50));
    const trajLine = new THREE.Line(trajGeo, new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.08,
      gapSize: 0.06,
      transparent: true,
      opacity: 0.45
    }));
    trajLine.computeLineDistances();
    scene.add(trajLine);

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

      const t = clock.getElapsedTime() * 0.65; // Deliberate engineering prototype motion

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Realistic Kinematics Trajectory: Multi-axis coordinated cycle
      j1Group.rotation.y = Math.sin(t * 0.9) * 0.48;
      j2Group.rotation.z = -0.32 + Math.sin(t * 0.9 + 0.3) * 0.24;
      j3Group.rotation.z = 0.65 + Math.cos(t * 0.9) * 0.38;
      j4Group.rotation.z = -0.35 + Math.sin(t * 0.9 - 0.4) * 0.22;

      // Gripper synchronized cycle
      const pinch = 0.065 + Math.sin(t * 1.8) * 0.03;
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
        KINEMATICS: 5-DoF ARTICULATION // ±0.8MM REPEATABILITY
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
        ALUMINUM 6061-T6 + CORELESS SERVOS
      </div>
    </div>
  );
};
