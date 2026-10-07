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
    camera.position.set(4.6, 4.2, 5.8);
    camera.lookAt(0, 0.45, 0);

    setupStudioLighting(scene);
    createStudioGround(scene, 5.8, 5.8, 0, 2.3);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- 1. REALISTIC ASPHALT TARMAC & INFRASTRUCTURE ---
    const tarmacGeo = new THREE.BoxGeometry(4.8, 0.12, 3.4);
    const tarmacMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Architectural slate paved tarmac
      roughness: 0.82,
      metalness: 0.12
    });
    const tarmac = new THREE.Mesh(tarmacGeo, tarmacMat);
    tarmac.position.y = 0.06;
    rootGroup.add(tarmac);

    // Concrete curb perimeter border with expansion joints
    const curbMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Light cast concrete curb
      roughness: 0.65,
      metalness: 0.15
    });

    const curbFront = new THREE.Mesh(new THREE.BoxGeometry(4.88, 0.16, 0.08), curbMat);
    curbFront.position.set(0, 0.08, 1.74);
    rootGroup.add(curbFront);

    const curbBack = new THREE.Mesh(new THREE.BoxGeometry(4.88, 0.16, 0.08), curbMat);
    curbBack.position.set(0, 0.08, -1.74);
    rootGroup.add(curbBack);

    // Central roadway dividing line (dashed white thermoplastic)
    const roadLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2.2, 0.125, 0),
      new THREE.Vector3(2.2, 0.125, 0)
    ]);
    const roadLine = new THREE.Line(roadLineGeo, new THREE.LineDashedMaterial({
      color: 0x94a3b8,
      dashSize: 0.25,
      gapSize: 0.20,
      transparent: true,
      opacity: 0.85
    }));
    roadLine.computeLineDistances();
    rootGroup.add(roadLine);

    // 6 Parking Bays (2 rows of 3) with distinct metallic automotive colors
    const bays = [
      { id: "01", x: -1.4, z: -0.85, occupied: true, carColor: 0x0284c7 }, // Electric Pacific Blue
      { id: "02", x: 0.0, z: -0.85, occupied: false, carColor: 0x000000 },
      { id: "03", x: 1.4, z: -0.85, occupied: true, carColor: 0xef4444 }, // Crimson Sport Red
      { id: "04", x: -1.4, z: 0.85, occupied: false, carColor: 0x000000 },
      { id: "05", x: 0.0, z: 0.85, occupied: true, carColor: 0xe2e8f0 }, // Alpine Pearl White
      { id: "06", x: 1.4, z: 0.85, occupied: false, carColor: 0x000000 }
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
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.75
      }));
      rootGroup.add(bayLine);

      // Concrete wheel stop barrier at rear of bay
      const wheelStop = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.1), curbMat);
      wheelStop.position.set(bay.x, 0.145, bay.z > 0 ? bay.z + 0.55 : bay.z - 0.55);
      rootGroup.add(wheelStop);

      // Realistic scale vehicle if occupied
      if (bay.occupied) {
        const car = new THREE.Group();
        car.position.set(bay.x, 0.12, bay.z);

        // Vehicle Chassis Body
        const bodyMat = new THREE.MeshStandardMaterial({
          color: bay.carColor,
          roughness: 0.28,
          metalness: 0.72
        });
        const carBody = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.28, 1.15), bodyMat);
        carBody.position.y = 0.16;
        car.add(carBody);

        // Windshield and Cabin Glass
        const cabinMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.15,
          metalness: 0.85
        });
        const carCabin = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.22, 0.65), cabinMat);
        carCabin.position.set(0, 0.38, -0.05);
        car.add(carCabin);

        // Headlights & Taillights
        const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfffaed });
        const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        [-0.28, 0.28].forEach((lx) => {
          const hl = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.02), headlightMat);
          hl.position.set(lx, 0.18, -0.58);
          car.add(hl);

          const tl = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.02), taillightMat);
          tl.position.set(lx, 0.18, 0.58);
          car.add(tl);
        });

        // Wheels with rims
        const tireMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.95 });
        const rimMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
        [[-0.42, -0.32], [0.42, -0.32], [-0.42, 0.32], [0.42, 0.32]].forEach(([wx, wz]) => {
          const wheelGroup = new THREE.Group();
          wheelGroup.position.set(wx, 0.1, wz);
          const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 16), tireMat);
          tire.rotateZ(Math.PI / 2);
          wheelGroup.add(tire);
          const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.065, 8), rimMat);
          rim.rotateZ(Math.PI / 2);
          wheelGroup.add(rim);
          car.add(wheelGroup);
        });

        rootGroup.add(car);
      }

      // Overhead Ultrasonic Sensor Gantry Node
      const poleGeo = new THREE.CylinderGeometry(0.022, 0.022, 1.4, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.3 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(bay.x + 0.65, 0.7, bay.z);
      rootGroup.add(pole);

      const crossbar = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.03, 0.03), poleMat);
      crossbar.position.set(bay.x + 0.32, 1.4, bay.z);
      rootGroup.add(crossbar);

      // HC-SR04 Transceiver Head Breakout PCB
      const sensorHead = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.06, 0.10),
        new THREE.MeshStandardMaterial({ color: 0x091a14, roughness: 0.45 })
      );
      sensorHead.position.set(bay.x, 1.38, bay.z);
      rootGroup.add(sensorHead);

      // Dual Ultrasonic Transceiver Cylinders (Brushed Metal)
      [-0.045, 0.045].forEach((ox) => {
        const barrel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.028, 0.028, 0.04, 14),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.92, roughness: 0.2 })
        );
        barrel.position.set(bay.x + ox, 1.34, bay.z);
        rootGroup.add(barrel);
      });

      // Dual-Color Status Beacon LED (Red = Occupied, Emerald = Vacant)
      const beaconColor = bay.occupied ? 0xef4444 : 0x10b981;
      const beaconMat = new THREE.MeshStandardMaterial({
        color: beaconColor,
        emissive: beaconColor,
        emissiveIntensity: 0.85,
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

    // Antenna Mast on Gateway
    const antennaMast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
    );
    antennaMast.position.set(0.6, 0.55, 0);
    gatewayGroup.add(antennaMast);

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
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = (performance.now() - startTime) * 0.001;

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
        <span>SIMULATION: SENSOR → CONTROLLER → NETWORK → DASHBOARD</span>
      </div>

      <div 
        style={{
          position: 'absolute',
          top: '12px',
          right: '14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--status-active)',
          background: 'rgba(8, 9, 13, 0.75)',
          padding: '3px 8px',
          border: '1px solid var(--border-subtle)',
          borderRadius: '2px',
          pointerEvents: 'none',
          textAlign: 'right'
        }}
      >
        <div>OCCUPANCY: 3 / 6 BAYS OCCUPIED</div>
        <div style={{ color: 'var(--text-accent)' }}>RP2040 PICO W // LATENCY: 42MS</div>
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
        HC-SR04 SENSOR ARRAY // CANOPY GANTRY
      </div>
    </div>
  );
};
