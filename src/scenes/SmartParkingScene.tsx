import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

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
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.2, 4.0, 5.8);
    camera.lookAt(0, 0.2, 0);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- 1. Parking Lot Base & Bay Marking Lines ---
    const tarmacGeo = new THREE.PlaneGeometry(5.2, 3.6);
    tarmacGeo.rotateX(-Math.PI / 2);
    const tarmacMat = new THREE.MeshStandardMaterial({
      color: 0x0f121a,
      roughness: 0.9,
      metalness: 0.1
    });
    const tarmac = new THREE.Mesh(tarmacGeo, tarmacMat);
    rootGroup.add(tarmac);

    // Grid Floor outline
    const floorEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(5.2, 0.05, 3.6)),
      new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.4 })
    );
    floorEdges.position.y = -0.025;
    rootGroup.add(floorEdges);

    // 6 Parking Bays (2 rows of 3)
    const bays = [
      { id: "A1", x: -1.5, z: -0.9, occupied: true },
      { id: "A2", x: 0.0, z: -0.9, occupied: false },
      { id: "A3", x: 1.5, z: -0.9, occupied: true },
      { id: "B1", x: -1.5, z: 0.9, occupied: false },
      { id: "B2", x: 0.0, z: 0.9, occupied: true },
      { id: "B3", x: 1.5, z: 0.9, occupied: false }
    ];

    const sensorGroup = new THREE.Group();
    rootGroup.add(sensorGroup);

    const bayIndicatorMeshes: { mesh: THREE.Mesh; occupied: boolean; bayX: number; bayZ: number }[] = [];

    bays.forEach((bay) => {
      // White bay boundary line markings
      const slotLineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(bay.x - 0.6, 0.01, bay.z - 0.7),
        new THREE.Vector3(bay.x - 0.6, 0.01, bay.z + 0.7),
        new THREE.Vector3(bay.x + 0.6, 0.01, bay.z + 0.7),
        new THREE.Vector3(bay.x + 0.6, 0.01, bay.z - 0.7)
      ]);
      const slotLine = new THREE.Line(slotLineGeo, new THREE.LineBasicMaterial({
        color: 0x475569,
        transparent: true,
        opacity: 0.6
      }));
      rootGroup.add(slotLine);

      // If occupied, render modern stylized vehicle
      if (bay.occupied) {
        const carGroup = new THREE.Group();
        carGroup.position.set(bay.x, 0, bay.z);

        const carBodyGeo = new THREE.BoxGeometry(0.85, 0.35, 1.15);
        const carBodyMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.4,
          metalness: 0.7
        });
        const carBody = new THREE.Mesh(carBodyGeo, carBodyMat);
        carBody.position.y = 0.22;
        carGroup.add(carBody);

        const cabinGeo = new THREE.BoxGeometry(0.7, 0.25, 0.65);
        const cabinMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          roughness: 0.2,
          metalness: 0.9
        });
        const cabin = new THREE.Mesh(cabinGeo, cabinMat);
        cabin.position.set(0, 0.45, -0.05);
        carGroup.add(cabin);

        // Vehicle edge lines
        const carEdges = new THREE.LineSegments(
          new THREE.EdgesGeometry(carBodyGeo),
          new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 })
        );
        carEdges.position.y = 0.22;
        carGroup.add(carEdges);

        rootGroup.add(carGroup);
      }

      // Overhead Ultrasonic Sensor Node suspended at y = 1.3
      const sensorNodeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12);
      const sensorNodeMat = new THREE.MeshBasicMaterial({ color: 0x64748b });
      const sensorNode = new THREE.Mesh(sensorNodeGeo, sensorNodeMat);
      sensorNode.position.set(bay.x, 1.3, bay.z);
      sensorGroup.add(sensorNode);

      // Overhead Status Beacon LED (Red if occupied, Emerald Green if vacant)
      const beaconGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: bay.occupied ? 0xf87171 : 0x34d399
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(bay.x, 1.22, bay.z);
      sensorGroup.add(beacon);
      bayIndicatorMeshes.push({ mesh: beacon, occupied: bay.occupied, bayX: bay.x, bayZ: bay.z });

      // Sensor ultrasonic cone beam (subtle pulse)
      const beamGeo = new THREE.ConeGeometry(0.45, 1.15, 16, 1, true);
      beamGeo.rotateX(Math.PI);
      const beamMat = new THREE.MeshBasicMaterial({
        color: bay.occupied ? 0xf87171 : 0x34d399,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(bay.x, 0.65, bay.z);
      sensorGroup.add(beam);
    });

    // --- 2. Floating Edge Dashboard Telemetry Display ---
    const dashGroup = new THREE.Group();
    dashGroup.position.set(0, 2.3, 0);
    rootGroup.add(dashGroup);

    const dashPanelGeo = new THREE.PlaneGeometry(1.6, 0.9);
    const dashPanelMat = new THREE.MeshBasicMaterial({
      color: 0x090d16,
      side: THREE.DoubleSide
    });
    const dashPanel = new THREE.Mesh(dashPanelGeo, dashPanelMat);
    dashGroup.add(dashPanel);

    const dashBorder = new THREE.LineSegments(
      new THREE.EdgesGeometry(dashPanelGeo),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 })
    );
    dashGroup.add(dashBorder);

    // Conduit lines connecting sensors to the Dashboard
    bays.forEach((bay) => {
      const conduitGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(bay.x, 1.3, bay.z),
        new THREE.Vector3(0, 2.3, 0)
      ]);
      const conduitLine = new THREE.LineDashedMaterial({
        color: 0x38bdf8,
        dashSize: 0.1,
        gapSize: 0.1,
        transparent: true,
        opacity: 0.35
      });
      const cLine = new THREE.Line(conduitGeo, conduitLine);
      cLine.computeLineDistances();
      rootGroup.add(cLine);
    });

    // Telemetry Pulse Particles traveling from sensors to dashboard
    const packetGeo = new THREE.SphereGeometry(0.035, 6, 6);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const packets: { mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; speed: number; offset: number }[] = [];

    bays.forEach((bay, idx) => {
      const pkt = new THREE.Mesh(packetGeo, packetMat);
      rootGroup.add(pkt);
      packets.push({
        mesh: pkt,
        start: new THREE.Vector3(bay.x, 1.3, bay.z),
        end: new THREE.Vector3(0, 2.3, 0),
        speed: 0.8,
        offset: idx * 0.25
      });
    });

    // Lights
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(4, 5, 4);
    scene.add(dirLight);

    const ambLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambLight);

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

      // Packets traveling along conduit
      packets.forEach((p) => {
        const prog = ((t * p.speed + p.offset) % 1);
        p.mesh.position.lerpVectors(p.start, p.end, prog);
        p.mesh.scale.setScalar(0.7 + Math.sin(prog * Math.PI) * 0.5);
      });

      // Dashboard facing camera with gentle oscillation
      dashGroup.rotation.y = Math.sin(t * 0.5) * 0.15;

      // Subtle slow turntable
      rootGroup.rotation.y = t * 0.06 + mouse.x * 0.2;
      rootGroup.rotation.x = mouse.y * 0.15;

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
        TELEMETRY: SENSOR → IoT → REAL-TIME DATA → DASHBOARD
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
        OCCUPANCY: 3 / 6 SLOTS OCCUPIED
      </div>
    </div>
  );
};
