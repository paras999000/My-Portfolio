import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createStudioGround, setupStudioLighting } from './threeUtils';

interface CropSystemSceneProps {
  interactive?: boolean;
}

export const CropSystemScene: React.FC<CropSystemSceneProps> = ({ interactive = true }) => {
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
    camera.position.set(3.4, 2.6, 4.4);
    camera.lookAt(0, 0.35, 0);

    setupStudioLighting(scene);
    createStudioGround(scene, 5.0, 5.0, -0.75, 2.0);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- MATERIALS ---
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x1f1914,
      roughness: 0.95,
      metalness: 0.05
    });
    const trayMat = new THREE.MeshStandardMaterial({
      color: 0x222938,
      roughness: 0.4,
      metalness: 0.7
    });
    const probeSteelMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.2,
      metalness: 0.95
    });
    const pcbGreenMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.4,
      metalness: 0.2
    });
    const sensorWhiteMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.3,
      metalness: 0.1
    });

    // --- 1. SOIL SUBSTRATE TRAY ---
    const trayGeo = new THREE.CylinderGeometry(1.4, 1.3, 0.4, 32);
    const tray = new THREE.Mesh(trayGeo, trayMat);
    tray.position.y = -0.55;
    rootGroup.add(tray);

    const soilGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.35, 32);
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.y = -0.48;
    rootGroup.add(soil);

    // --- 2. CAPACITIVE SOIL MOISTURE PROBE PRONGS (INSERTED IN SOIL) ---
    // Dual parallel stainless steel prongs
    for (let p = -1; p <= 1; p += 2) {
      const prong = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.6, 0.015), probeSteelMat);
      prong.position.set(p * 0.12 - 0.2, -0.25, 0);
      rootGroup.add(prong);
    }
    // Probe Head Sensor PCB
    const probeHead = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.25, 0.03), pcbGreenMat);
    probeHead.position.set(-0.2, 0.1, 0);
    rootGroup.add(probeHead);

    // Signal trace wire from probe to central ESP8266 controller
    const wireCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, 0.22, 0),
      new THREE.Vector3(-0.05, 0.4, 0.1),
      new THREE.Vector3(0.2, 0.55, 0)
    ]);
    const wireGeo = new THREE.TubeGeometry(wireCurve, 16, 0.015, 8, false);
    const wire = new THREE.Mesh(wireGeo, new THREE.MeshStandardMaterial({ color: 0x10b981 }));
    rootGroup.add(wire);

    // --- 3. ESP8266 NODEMCU MICROCONTROLLER STALK ---
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.1, 16), trayMat);
    mast.position.set(0.35, 0.1, 0);
    rootGroup.add(mast);

    // ESP8266 NodeMCU Board
    const espBoard = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.75, 0.04), pcbGreenMat);
    espBoard.position.set(0.35, 0.7, 0.05);
    espBoard.rotation.y = -Math.PI / 8;
    rootGroup.add(espBoard);

    // ESP8266 Metal Shield Can
    const espShield = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.32, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15 })
    );
    espShield.position.set(0.35, 0.76, 0.09);
    espShield.rotation.y = -Math.PI / 8;
    rootGroup.add(espShield);

    // DHT11 / DHT22 Atmospheric Sensor Module (Blue/White slotted casing)
    const dht = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.3, 0.12), sensorWhiteMat);
    dht.position.set(0.35, 0.35, 0.2);
    rootGroup.add(dht);

    // Wi-Fi Telemetry Transmitter Antenna (PCB Meander trace)
    const antTrace = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.2, 8),
      new THREE.MeshBasicMaterial({ color: 0xd4af37 })
    );
    antTrace.position.set(0.35, 1.15, 0.05);
    rootGroup.add(antTrace);

    // --- 4. TELEMETRY TRANSMISSION WAVE RINGS (THINGSPEAK CLOUD STREAM) ---
    const waveCount = 3;
    const waveRings: THREE.Mesh[] = [];
    const waveMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.7, side: THREE.DoubleSide });

    for (let w = 0; w < waveCount; w++) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.13, 32), waveMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0.35, 1.25 + w * 0.25, 0.05);
      rootGroup.add(ring);
      waveRings.push(ring);
    }

    // Animation & Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let animId: number;
    const startTime = performance.now();

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

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const elapsed = (performance.now() - startTime) / 1000;

      // Mouse Parallax
      rootGroup.rotation.y += (mouseX * 0.3 - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (mouseY * 0.15 - rootGroup.rotation.x) * 0.05;

      // Animate telemetry broadcast waves upward
      waveRings.forEach((r, idx) => {
        const t = (elapsed * 0.8 + idx / waveCount) % 1;
        const scale = 0.5 + t * 2.2;
        r.scale.set(scale, scale, scale);
        r.position.y = 1.25 + t * 0.7;
        (r.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.8;
      });

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
      trayGeo.dispose();
      soilGeo.dispose();
      wireGeo.dispose();
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
        <span>SOIL MOISTURE: 74% // TEMP: 27.8°C // RECOMMENDED: RICE 🌾</span>
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
        <div>ESP8266 NODEMCU + DHT11/22</div>
        <div style={{ color: 'var(--color-success)' }}>THINGSPEAK CLOUD TIME-SERIES REST API</div>
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
        SMART AGRICULTURE // PRECISION IOT
      </div>
    </div>
  );
};
