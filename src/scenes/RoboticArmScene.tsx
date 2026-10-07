import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

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
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(4.0, 3.2, 5.5);
    camera.lookAt(0, 0.6, 0);

    // Engineering Turntable Floor & Measurement Grid
    const floorGrid = new THREE.GridHelper(5, 12, 0x1e293b, 0x0f172a);
    floorGrid.position.y = -0.01;
    scene.add(floorGrid);

    // Concentric Calibration Rings
    [0.8, 1.5, 2.2].forEach((radius) => {
      const ringGeo = new THREE.RingGeometry(radius, radius + 0.015, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x334155,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      });
      scene.add(new THREE.Mesh(ringGeo, ringMat));
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- Materials for Engineering Prototype ---
    const metalDarkMat = new THREE.MeshStandardMaterial({
      color: 0x1a202c,
      roughness: 0.3,
      metalness: 0.8
    });
    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25
    });
    const linkWireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4
    });

    // Helper function to create wireframe outline for a mesh
    const addWireOutline = (mesh: THREE.Mesh, geometry: THREE.BufferGeometry) => {
      const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), linkWireMat);
      mesh.add(wire);
    };

    // --- 1. Base Pedestal (Joint 0: Base Rotation) ---
    const basePillarGeo = new THREE.CylinderGeometry(0.55, 0.65, 0.25, 24);
    const basePillar = new THREE.Mesh(basePillarGeo, metalDarkMat);
    basePillar.position.y = 0.125;
    rootGroup.add(basePillar);
    addWireOutline(basePillar, basePillarGeo);

    // Joint 1: Turntable Swivel
    const j1Group = new THREE.Group();
    j1Group.position.y = 0.25;
    rootGroup.add(j1Group);

    const j1BearingGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
    const j1Bearing = new THREE.Mesh(j1BearingGeo, jointMat);
    j1Bearing.position.y = 0.1;
    j1Group.add(j1Bearing);

    // Joint 2: Shoulder Pivot
    const j2Group = new THREE.Group();
    j2Group.position.set(0, 0.25, 0);
    j1Group.add(j2Group);

    const j2PivotGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
    j2PivotGeo.rotateZ(Math.PI / 2);
    const j2Pivot = new THREE.Mesh(j2PivotGeo, jointMat);
    j2Group.add(j2Pivot);

    // Link 1: Upper Arm Link (Length: 1.3)
    const link1Geo = new THREE.BoxGeometry(0.18, 1.3, 0.18);
    const link1 = new THREE.Mesh(link1Geo, metalDarkMat);
    link1.position.y = 0.65;
    j2Group.add(link1);
    addWireOutline(link1, link1Geo);

    // Joint 3: Elbow Pivot
    const j3Group = new THREE.Group();
    j3Group.position.set(0, 1.3, 0);
    j2Group.add(j3Group);

    const j3PivotGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.35, 16);
    j3PivotGeo.rotateZ(Math.PI / 2);
    const j3Pivot = new THREE.Mesh(j3PivotGeo, jointMat);
    j3Group.add(j3Pivot);

    // Link 2: Forearm Link (Length: 1.1)
    const link2Geo = new THREE.BoxGeometry(0.15, 1.1, 0.15);
    const link2 = new THREE.Mesh(link2Geo, metalDarkMat);
    link2.position.y = 0.55;
    j3Group.add(link2);
    addWireOutline(link2, link2Geo);

    // Joint 4: Wrist Pivot & Pitch
    const j4Group = new THREE.Group();
    j4Group.position.set(0, 1.1, 0);
    j3Group.add(j4Group);

    const j4PivotGeo = new THREE.SphereGeometry(0.14, 12, 12);
    const j4Pivot = new THREE.Mesh(j4PivotGeo, jointMat);
    j4Group.add(j4Pivot);

    // End-Effector: Precision Gripper Base
    const gripperBaseGeo = new THREE.BoxGeometry(0.22, 0.12, 0.14);
    const gripperBase = new THREE.Mesh(gripperBaseGeo, metalDarkMat);
    gripperBase.position.y = 0.12;
    j4Group.add(gripperBase);

    // Gripper Fingers (Parallel actuation)
    const fingerGeo = new THREE.BoxGeometry(0.04, 0.24, 0.06);
    const fingerLeft = new THREE.Mesh(fingerGeo, jointMat);
    fingerLeft.position.set(-0.08, 0.26, 0);
    j4Group.add(fingerLeft);

    const fingerRight = new THREE.Mesh(fingerGeo, jointMat);
    fingerRight.position.set(0.08, 0.26, 0);
    j4Group.add(fingerRight);

    // --- Trajectory Motion Arc (Previewing Kinematic Curve) ---
    const arcPoints = [
      new THREE.Vector3(0.3, 1.6, 0.8),
      new THREE.Vector3(0.6, 1.9, 0.4),
      new THREE.Vector3(0.9, 1.4, -0.2),
      new THREE.Vector3(0.7, 0.8, -0.5)
    ];
    const arcCurve = new THREE.CatmullRomCurve3(arcPoints);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(arcCurve.getPoints(40));
    const arcMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.1,
      gapSize: 0.08,
      transparent: true,
      opacity: 0.5
    });
    const arcLine = new THREE.Line(arcGeo, arcMat);
    arcLine.computeLineDistances();
    scene.add(arcLine);

    // Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const blueRimLight = new THREE.PointLight(0x38bdf8, 2.5, 8);
    blueRimLight.position.set(-3, 3, -2);
    scene.add(blueRimLight);

    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

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
      const t = clock.getElapsedTime() * 0.7; // Deliberate, smooth, slow motion

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Realistic Inverse Kinematics subtle repeating trajectory
      // Smooth sinusoidal joints with distinct phase shifts
      j1Group.rotation.y = Math.sin(t * 0.8) * 0.45;
      j2Group.rotation.z = -0.3 + Math.sin(t * 0.8 + 0.3) * 0.22;
      j3Group.rotation.z = 0.6 + Math.cos(t * 0.8) * 0.35;
      j4Group.rotation.z = -0.3 + Math.sin(t * 0.8 - 0.5) * 0.2;

      // Gripper pinch-close cycle at end of reach
      const gripPinch = 0.06 + Math.sin(t * 1.6) * 0.025;
      fingerLeft.position.x = -gripPinch;
      fingerRight.position.x = gripPinch;

      // Subtle scene camera drift & mouse tilt
      rootGroup.rotation.y = mouse.x * 0.25;

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
          color: 'var(--text-accent)',
          background: 'rgba(8, 9, 13, 0.75)',
          padding: '3px 8px',
          borderRadius: '2px',
          border: '1px solid var(--border-subtle)',
          pointerEvents: 'none'
        }}
      >
        KINEMATICS: 5-DoF CLOSED LOOP // PWM: 1520µs
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
        PRECISION: ±0.8MM // INSPECTION MODE
      </div>
    </div>
  );
};
