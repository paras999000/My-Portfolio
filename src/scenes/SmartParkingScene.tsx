import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createStudioGround, setupStudioLighting } from './threeUtils';

interface SmartParkingSceneProps {
  interactive?: boolean;
}

export const SmartParkingScene: React.FC<SmartParkingSceneProps> = ({ interactive = true }) => {
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
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(4.5, 4.2, 5.8);
    camera.lookAt(0, 0.4, 0);

    setupStudioLighting(scene);
    createStudioGround(scene, 5.5, 5.5, 0, 2.2);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- 1. REALISTIC ASPHALT / CONCRETE PARKING TARMAC ---
    const tarmacGeo = new THREE.BoxGeometry(4.8, 0.12, 3.4);
    const tarmacMat = new THREE.MeshStandardMaterial({
      color: 0x141822, // Rich dark asphalt
      roughness: 0.88,
      metalness: 0.12
    });
    const tarmac = new THREE.Mesh(tarmacGeo, tarmacMat);
    tarmac.position.y = 0.06;
    rootGroup.add(tarmac);

    // Concrete curb perimeter border
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x2b3342, roughness: 0.7 });
    const curbFront = new THREE.Mesh(new THREE.BoxGeometry(4.88, 0.16, 0.08), curbMat);
    curbFront.position.set(0, 0.08, 1.74);
    rootGroup.add(curbFront);

    // 6 Parking Bays (2 rows of 3)
    const bays = [
      { id: "A01", x: -1.4, z: -0.85, occupied: true, carColor: 0x243044 },
      { id: "A02", x: 0.0, z: -0.85, occupied: false, carColor: 0x000000 },
      { id: "A03", x: 1.4, z: -0.85, occupied: true, carColor: 0x3d4b60 },
      { id: "B01", x: -1.4, z: 0.85, occupied: false, carColor: 0x000000 },
      { id: "B02", x: 0.0, z: 0.85, occupied: true, carColor: 0x1e2633 },
      { id: "B03", x: 1.4, z: 0.85, occupied: false, carColor: 0x000000 }
    ];

    const sensorCones: THREE.Mesh[] = [];

    bays.forEach((bay) => {
      // White bay boundary line markings
      const bayLineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(bay.x - 0.58, 0.125, bay.z - 0.65),
        new THREE.Vector3(bay.x - 0.58, 0.125, bay.z + 0.65),
        new THREE.Vector3(bay.x + 0.58, 0.125, bay.z + 0.65),
        new THREE.Vector3(bay.x + 0.58, 0.125, bay.z - 0.65)
      ]);
      const bayLine = new THREE.Line(bayLineGeo, new THREE.LineBasicMaterial({
        color: 0x64748b,
        transparent: true,
        opacity: 0.75
      }));
      rootGroup.add(bayLine);

      // Concrete wheel stop barrier
      const wheelStop = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.1), curbMat);
      wheelStop.position.set(bay.x, 0.145, bay.z > 0 ? bay.z + 0.55 : bay.z - 0.55);
      rootGroup.add(wheelStop);

      // Realistic scale vehicle if occupied
      if (bay.occupied) {
        const car = new THREE.Group();
        car.position.set(bay.x, 0.12, bay.z);

        // Vehicle Chassis
        const bodyMat = new THREE.MeshStandardMaterial({
          color: bay.carColor,
          roughness: 0.35,
          metalness: 0.8
        });
        const carBody = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.28, 1.15), bodyMat);
        carBody.position.y = 0.16;
        car.add(carBody);

        // Windshield and Cabin
        const cabinMat = new THREE.MeshStandardMaterial({
          color: 0x0a0f16,
          roughness: 0.1,
          metalness: 0.9
        });
        const carCabin = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.22, 0.65), cabinMat);
        carCabin.position.set(0, 0.38, -0.05);
        car.add(carCabin);

        // Wheels
        const tireMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
        [[-0.42, -0.32], [0.42, -0.32], [-0.42, 0.32], [0.42, 0.32]].forEach(([wx, wz]) => {
          const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 16), tireMat);
          tire.rotateZ(Math.PI / 2);
          tire.position.set(wx, 0.1, wz);
          car.add(tire);
        });

        rootGroup.add(car);
      }

      // Overhead Ultrasonic Sensor Gantry Node
      const poleGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(bay.x + 0.65, 0.7, bay.z);
      rootGroup.add(pole);

      const crossbar = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.03, 0.03), poleMat);
      crossbar.position.set(bay.x + 0.32, 1.4, bay.z);
      rootGroup.add(crossbar);

      // HC-SR04 Transceiver Pair Head
      const sensorHead = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.06, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 })
      );
      sensorHead.position.set(bay.x, 1.38, bay.z);
      rootGroup.add(sensorHead);

      // Dual Ultrasonic Transceiver Cylinders
      [-0.04, 0.04].forEach((ox) => {
        const barrel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, 0.04, 12),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
        );
        barrel.position.set(bay.x + ox, 1.34, bay.z);
        rootGroup.add(barrel);
      });

      // Dual-Color Status Beacon LED (Red = Occupied, Emerald = Vacant)
      const beaconColor = bay.occupied ? 0xef4444 : 0x10b981;
      const beaconMat = new THREE.MeshStandardMaterial({
        color: beaconColor,
        emissive: beaconColor,
        emissiveIntensity: 0.8,
        roughness: 0.2
      });
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), beaconMat);
      beacon.position.set(bay.x, 1.42, bay.z);
      rootGroup.add(beacon);

      // Ultrasonic Conical Sonar Pulse Beam
      const coneGeo = new THREE.ConeGeometry(0.42, 1.15, 16, 1, true);
      coneGeo.rotateX(Math.PI);
      const coneMat = new THREE.MeshBasicMaterial({
        color: beaconColor,
        wireframe: true,
        transparent: true,
        opacity: 0.16
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(bay.x, 0.78, bay.z);
      rootGroup.add(cone);
      sensorCones.push(cone);
    });

    // --- 2. EDGE GATEWAY CONTROLLER UNIT (RP2040 Pico W Hub) ---
    const gatewayGroup = new THREE.Group();
    gatewayGroup.position.set(0, 2.3, 0);
    rootGroup.add(gatewayGroup);

    // Gateway Enclosure Terminal
    const gatewayChassis = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.8, 0.12),
      new THREE.MeshStandardMaterial({
        color: 0x0a0e17,
        roughness: 0.3,
        metalness: 0.85
      })
    );
    gatewayGroup.add(gatewayChassis);

    // Bezel border
    const gatewayBorder = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.4, 0.8, 0.12)),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
    );
    gatewayGroup.add(gatewayBorder);

    // Conduit Data Lines connecting bays to the Gateway Terminal
    const conduitMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.08,
      gapSize: 0.08,
      transparent: true,
      opacity: 0.4
    });

    bays.forEach((bay) => {
      const cPts = [new THREE.Vector3(bay.x, 1.4, bay.z), new THREE.Vector3(0, 2.3, 0)];
      const cGeo = new THREE.BufferGeometry().setFromPoints(cPts);
      const cLine = new THREE.Line(cGeo, conduitMat);
      cLine.computeLineDistances();
      rootGroup.add(cLine);
    });

    // IoT Telemetry Packets streaming along conduits: VEHICLE → SENSOR → PICO → DASHBOARD
    const packets: { mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; offset: number }[] = [];
    bays.forEach((bay, idx) => {
      const pMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 8, 8),
        new THREE.MeshBasicMaterial({ color: bay.occupied ? 0xf87171 : 0x34d399 })
      );
      rootGroup.add(pMesh);
      packets.push({
        mesh: pMesh,
        start: new THREE.Vector3(bay.x, 1.4, bay.z),
        end: new THREE.Vector3(0, 2.3, 0),
        offset: idx * 0.2
      });
    });

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

      // Packets streaming from sensors to Gateway
      packets.forEach((p) => {
        const prog = ((t * 0.75 + p.offset) % 1);
        p.mesh.position.lerpVectors(p.start, p.end, prog);
        p.mesh.scale.setScalar(0.7 + Math.sin(prog * Math.PI) * 0.5);
      });

      // Subtle ultrasonic cone breath
      sensorCones.forEach((cone, idx) => {
        const s = 1 + Math.sin(t * 3.5 + idx) * 0.12;
        cone.scale.set(s, 1, s);
      });

      // Gateway panel slight oscillation
      gatewayGroup.rotation.y = Math.sin(t * 0.6) * 0.12;

      // Miniature lot turntable drift
      rootGroup.rotation.y = t * 0.07 + mouse.x * 0.25;
      rootGroup.rotation.x = mouse.y * 0.12;

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
        PIPELINE: VEHICLE → SENSOR → PICO W → NETWORK → DASHBOARD
      </div>

      <div 
        style={{
          position: 'absolute',
          top: '12px',
          right: '14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--status-active)',
          pointerEvents: 'none'
        }}
      >
        LIVE OCCUPANCY: 3 / 6 SLOTS OCCUPIED
      </div>
    </div>
  );
};
