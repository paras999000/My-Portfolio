import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { createStudioGround, setupStudioLighting, safeCreateRenderer, safeDisposeRenderer } from './threeUtils';

interface FridaySceneProps {
  interactive?: boolean;
  onOpenCaseStudy?: () => void;
}

// In-memory cache for loaded BufferGeometries so they load once and never re-fetch
const fridayGeometryCache = new Map<string, THREE.BufferGeometry>();

interface PartDefinition {
  id: string;
  name: string;
  code: string;
  fileUrl: string;
  color: number;
  roughness: number;
  metalness: number;
  explodedOffset: THREE.Vector3; // offset applied in Three.js coordinates
}

const FRIDAY_PARTS: PartDefinition[] = [
  {
    id: 'friday-shell',
    name: 'FRIDAY SHELL',
    code: '02_SHELL_ESP32',
    fileUrl: '/models/02_FridayShell_esp32.stl',
    color: 0x222c3a, // Matte dark slate engineering polymer
    roughness: 0.36,
    metalness: 0.20,
    explodedOffset: new THREE.Vector3(0.12, 0.04, 0.62) // Separates forward-right towards viewer
  },
  {
    id: 'friday-rear-cover',
    name: 'FRIDAY REAR COVER',
    code: '03_REAR_COVER_ESP32',
    fileUrl: '/models/03_FridayRearCover_esp32.stl',
    color: 0x161e29, // Dark high-temp backplate with exhaust louvers
    roughness: 0.40,
    metalness: 0.25,
    explodedOffset: new THREE.Vector3(-0.24, 0.08, -0.82) // Separates backward-left away from viewer
  },
  {
    id: 'friday-carrier',
    name: 'FRIDAY CARRIER',
    code: '04_CARRIER_ESP32',
    fileUrl: '/models/04_FridayCarrier_esp32.stl',
    color: 0x0f172a, // Structural internal PCB & hardware carrier
    roughness: 0.48,
    metalness: 0.32,
    explodedOffset: new THREE.Vector3(-0.10, 0.14, -0.20) // Exposed center-left
  },
  {
    id: 'friday-stand-base',
    name: 'FRIDAY STAND BASE',
    code: '06_STAND_BASE_ESP32',
    fileUrl: '/models/06_FridayStandBase_esp32.stl',
    color: 0x334155, // Weighted desktop base mount
    roughness: 0.32,
    metalness: 0.42,
    explodedOffset: new THREE.Vector3(0, -0.60, 0) // Separates downward along Y
  }
];

function createOledDisplayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Deep OLED black background
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, 256, 256);

  // Subtle pixel grid pattern
  ctx.fillStyle = 'rgba(56, 189, 248, 0.03)';
  for (let y = 0; y < 256; y += 4) {
    ctx.fillRect(0, y, 256, 1);
  }

  // Header
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('FRIDAY // v2.4-S3', 20, 36);

  // Status line
  ctx.fillStyle = '#34d399';
  ctx.font = '12px monospace';
  ctx.fillText('● SYSTEM READY', 20, 60);

  // Audio waveform bars
  ctx.fillStyle = '#38bdf8';
  const barHeights = [18, 32, 54, 82, 95, 68, 44, 28, 50, 72, 38, 20];
  for (let i = 0; i < barHeights.length; i++) {
    const x = 20 + i * 18;
    const h = barHeights[i];
    ctx.fillRect(x, 180 - h, 12, h);
  }

  // Telemetry footer
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px monospace';
  ctx.fillText('I2S: 24b/16kHz · MCP: ON', 20, 215);
  ctx.fillText('CORE: ESP32-S3 @ 240MHz', 20, 235);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const FridayScene: React.FC<FridaySceneProps> = ({ 
  interactive = true,
  onOpenCaseStudy 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [exploded, setExploded] = useState(false);
  const [technicalMode, setTechnicalMode] = useState(false);
  const [activePipelineStage, setActivePipelineStage] = useState(0);

  const explodedRef = useRef(exploded);
  explodedRef.current = exploded;
  const technicalModeRef = useRef(technicalMode);
  technicalModeRef.current = technicalMode;

  const resetCameraRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = safeCreateRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    if (!renderer) {
      setErrorOccurred(true);
      setErrorMessage('Hardware WebGL context limit reached. Click retry to reload.');
      setLoading(false);
      return;
    }

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 380;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    
    // Perfectly framed 3/4 perspective camera
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    const defaultCamPos = new THREE.Vector3(2.4, 1.1, 4.6);
    camera.position.copy(defaultCamPos);
    camera.lookAt(0, -0.05, 0);

    // Studio Lighting Rig
    setupStudioLighting(scene);
    createStudioGround(scene, 6.0, 6.0, -1.05, 2.0);

    // Assembly Root Group
    const assemblyRoot = new THREE.Group();
    assemblyRoot.position.set(0, -0.05, 0);
    assemblyRoot.rotation.y = 0.35; // 3/4 front perspective showing display & aperture
    scene.add(assemblyRoot);

    resetCameraRef.current = () => {
      camera.position.copy(defaultCamPos);
      camera.lookAt(0, -0.05, 0);
      assemblyRoot.position.set(0, -0.05, 0);
      assemblyRoot.rotation.set(0, 0.35, 0);
    };

    // Scale mm to Three.js units (108mm height -> ~1.65 units for comfortable viewport framing)
    const scaleFactor = 1.65 / 108;

    // Part meshes storage for animation & shader toggling
    interface PartMeshInstance {
      id: string;
      group: THREE.Group;
      solidMesh: THREE.Mesh;
      wireMesh: THREE.LineSegments;
      solidMaterial: THREE.MeshStandardMaterial;
      wireMaterial: THREE.LineBasicMaterial;
      assembledPos: THREE.Vector3;
      explodedPos: THREE.Vector3;
    }

    const partInstances: PartMeshInstance[] = [];

    // Internal OLED Display panel placed right behind the shell window
    const oledTex = createOledDisplayTexture();
    const oledMat = new THREE.MeshBasicMaterial({ map: oledTex });
    const oledMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.55), oledMat);
    oledMesh.position.set(0, 0.08, 0.44); // aligned with front aperture
    assemblyRoot.add(oledMesh);

    // Status LED indicator aperture glow
    const ledMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    ledMesh.position.set(0.24, -0.32, 0.45);
    assemblyRoot.add(ledMesh);

    // Mouse & Touch Orbit / Pan / Zoom tracking
    let isDragging = false;
    let isPanning = false;
    let prevMouse = { x: 0, y: 0 };
    const mouseOffset = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      if (e.button === 0) isDragging = true;
      if (e.button === 2) isPanning = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseOffset.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseOffset.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        assemblyRoot.rotation.y += dx * 0.008;
        assemblyRoot.rotation.x += dy * 0.008;
      } else if (isPanning) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        camera.position.x -= dx * 0.004;
        camera.position.y += dy * 0.004;
      }
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      isPanning = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!interactive) return;
      e.preventDefault();
      camera.position.z = Math.max(2.0, Math.min(7.5, camera.position.z + e.deltaY * 0.0025));
    };

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    // Touch Support
    let prevTouchDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        prevTouchDist = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const dx = e.touches[0].clientX - prevMouse.x;
        const dy = e.touches[0].clientY - prevMouse.y;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        assemblyRoot.rotation.y += dx * 0.01;
        assemblyRoot.rotation.x += dy * 0.01;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (prevTouchDist > 0) {
          const delta = (prevTouchDist - dist) * 0.01;
          camera.position.z = Math.max(2.0, Math.min(7.5, camera.position.z + delta));
        }
        prevTouchDist = dist;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
      prevTouchDist = 0;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('contextmenu', onContextMenu);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Load all 4 real FRIDAY STL parts
    const loader = new STLLoader();
    let loadedCount = 0;
    let hasError = false;

    FRIDAY_PARTS.forEach((def, index) => {
      const onLoadGeometry = (geo: THREE.BufferGeometry) => {
        geo.computeVertexNormals();

        // Standardize STL origin to assembly center (0, 0, 54mm in CAD coordinates)
        const centeredGeo = geo.clone();
        centeredGeo.translate(0, 0, -54);

        // Solid polymer material
        const solidMaterial = new THREE.MeshStandardMaterial({
          color: def.color,
          roughness: def.roughness,
          metalness: def.metalness
        });

        const solidMesh = new THREE.Mesh(centeredGeo, solidMaterial);
        solidMesh.scale.setScalar(scaleFactor);
        solidMesh.rotation.x = -Math.PI / 2; // Upright in Three.js coordinate system

        // Precision Technical Wireframe Overlay
        const edges = new THREE.EdgesGeometry(centeredGeo, 26);
        const wireMaterial = new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.45
        });
        const wireMesh = new THREE.LineSegments(edges, wireMaterial);
        wireMesh.scale.copy(solidMesh.scale);
        wireMesh.rotation.copy(solidMesh.rotation);

        const partGroup = new THREE.Group();
        partGroup.add(solidMesh);
        partGroup.add(wireMesh);
        assemblyRoot.add(partGroup);

        const instance: PartMeshInstance = {
          id: def.id,
          group: partGroup,
          solidMesh,
          wireMesh,
          solidMaterial,
          wireMaterial,
          assembledPos: new THREE.Vector3(0, 0, 0),
          explodedPos: def.explodedOffset.clone()
        };

        partInstances.push(instance);
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / FRIDAY_PARTS.length) * 100));

        if (loadedCount === FRIDAY_PARTS.length) {
          setLoading(false);
        }
      };

      if (fridayGeometryCache.has(def.fileUrl)) {
        onLoadGeometry(fridayGeometryCache.get(def.fileUrl)!);
      } else {
        loader.load(
          def.fileUrl,
          (geo) => {
            fridayGeometryCache.set(def.fileUrl, geo);
            onLoadGeometry(geo);
          },
          (xhr) => {
            if (xhr.lengthComputable && FRIDAY_PARTS.length > 0) {
              const partPct = (xhr.loaded / xhr.total) * (100 / FRIDAY_PARTS.length);
              const overall = (index * (100 / FRIDAY_PARTS.length)) + partPct;
              setLoadProgress(Math.min(95, Math.round(overall)));
            }
          },
          () => {
            hasError = true;
            setErrorOccurred(true);
            setErrorMessage(`Failed to load STL part: ${def.name}`);
            setLoading(false);
          }
        );
      }
    });

    // Timeout safety to prevent stuck loading
    const loadTimeout = setTimeout(() => {
      if (loadedCount < FRIDAY_PARTS.length && !hasError) {
        setErrorOccurred(true);
        setErrorMessage('CAD Asset loading timeout.');
        setLoading(false);
      }
    }, 10000);

    // Performance Intersection Observer
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
    let explosionProgress = 0; // 0 = assembled, 1 = exploded

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      // Smooth Explosion Interpolation
      const targetExplosion = explodedRef.current ? 1.0 : 0.0;
      explosionProgress += (targetExplosion - explosionProgress) * 0.08;

      // Update part positions & wireframe visibility
      const isTech = technicalModeRef.current;
      partInstances.forEach((p) => {
        p.group.position.lerpVectors(p.assembledPos, p.explodedPos, explosionProgress);
        p.solidMaterial.wireframe = isTech;
        p.wireMesh.visible = isTech || explosionProgress > 0.05;
        p.wireMaterial.opacity = isTech ? 0.9 : 0.45 * explosionProgress;
      });

      // OLED screen shifts with the shell when exploded
      oledMesh.position.z = 0.44 + (0.70 * explosionProgress);
      oledMesh.visible = !isTech;

      // Smooth subtle idle turntable rotation when not dragging
      if (!isDragging && !isPanning) {
        assemblyRoot.rotation.y += 0.0015;
      }

      // Smooth mouse damping
      mouseOffset.x += (mouseOffset.targetX - mouseOffset.x) * 0.05;
      mouseOffset.y += (mouseOffset.targetY - mouseOffset.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Voice Pipeline Telemetry ticker
    const pipelineInterval = setInterval(() => {
      setActivePipelineStage((prev) => (prev + 1) % 5);
    }, 1400);

    return () => {
      clearTimeout(loadTimeout);
      clearInterval(pipelineInterval);
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('contextmenu', onContextMenu);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      observer.disconnect();
      resizeObserver.disconnect();
      safeDisposeRenderer(renderer, container);
    };
  }, [interactive]);

  const handleReset = useCallback(() => {
    if (resetCameraRef.current) resetCameraRef.current();
  }, []);

  const pipelineStages = [
    { label: 'MIC IN', desc: 'INMP441 I2S' },
    { label: 'AUDIO DSP', desc: 'DMA Ring Buffer' },
    { label: 'GEMINI AI', desc: 'Voice Reasoning' },
    { label: 'MCP TOOLS', desc: 'Protocol Bus' },
    { label: 'ACTION', desc: 'GPIO / Actuator' }
  ];

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '380px',
        position: 'relative',
        backgroundColor: '#090b10',
        overflow: 'hidden',
        userSelect: 'none',
        borderRadius: 'var(--radius-md)'
      }}
    >
      {/* 1. TOP HEADER OVERLAY: REAL HARDWARE VERIFICATION */}
      <div 
        style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          right: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        <div>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-accent)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            <span className="tech-status-dot" />
            <span>FRIDAY // PHYSICAL CAD ASSEMBLY</span>
          </div>
          <div 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.04em',
              marginTop: '2px'
            }}
          >
            4-PART FDM ENCLOSURE // ESP32-S3 EMBEDDED AI
          </div>
        </div>

        {/* Part Count Badge */}
        <div 
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            padding: '3px 8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'var(--text-secondary)'
          }}
        >
          {exploded ? 'EXPLODED VIEW' : 'ASSEMBLED PRODUCT'}
        </div>
      </div>

      {/* 2. LOADING STATE WITH REAL PROGRESS */}
      {loading && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(9, 11, 16, 0.92)',
            zIndex: 20,
            backdropFilter: 'blur(6px)',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="tech-status-dot pulse" />
            <span 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--text-accent)',
                letterSpacing: '0.1em'
              }}
            >
              LOADING FRIDAY CAD ASSEMBLY // [{loadProgress}%]
            </span>
          </div>

          <div 
            style={{
              width: '200px',
              height: '3px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                width: `${loadProgress}%`,
                height: '100%',
                backgroundColor: 'var(--accent-primary)',
                transition: 'width 0.2s ease-out'
              }}
            />
          </div>

          <div 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.04em'
            }}
          >
            PARSING SHELL, CARRIER, REAR COVER & STAND BASE STLs
          </div>
        </div>
      )}

      {/* 3. ERROR FALLBACK (CLEAR & INFORMATIVE, NEVER INFINITE 0%) */}
      {errorOccurred && !loading && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(9, 11, 16, 0.95)',
            zIndex: 20,
            padding: '24px',
            textAlign: 'center',
            gap: '10px'
          }}
        >
          <div 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: '#f87171',
              letterSpacing: '0.08em',
              fontWeight: 600
            }}
          >
            CAD MODEL UNAVAILABLE
          </div>
          <div 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-dim)',
              maxWidth: '320px'
            }}
          >
            {errorMessage || 'Unable to stream CAD mesh from local storage.'}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-secondary"
            style={{
              padding: '4px 12px',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              marginTop: '8px'
            }}
          >
            RETRY CAD PIPELINE
          </button>
        </div>
      )}

      {/* 4. INTERACTIVE TOOLBAR CONTROLS */}
      <div 
        style={{
          position: 'absolute',
          bottom: '52px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'auto',
          zIndex: 15
        }}
      >
        {/* Left: View Mode Toggles */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            type="button"
            onClick={() => setExploded(!exploded)}
            className="btn"
            style={{
              padding: '5px 10px',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              backgroundColor: exploded ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.85)',
              borderColor: exploded ? 'var(--accent-primary)' : 'var(--border-subtle)',
              color: exploded ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
            title="Toggle Exploded CAD Assembly View"
          >
            {exploded ? '⚡ ASSEMBLE' : '🔍 EXPLODED VIEW'}
          </button>

          <button 
            type="button"
            onClick={() => setTechnicalMode(!technicalMode)}
            className="btn"
            style={{
              padding: '5px 10px',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              backgroundColor: technicalMode ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.85)',
              borderColor: technicalMode ? 'var(--accent-primary)' : 'var(--border-subtle)',
              color: technicalMode ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
            title="Toggle Wireframe CAD Inspection Mode"
          >
            {technicalMode ? 'SOLID PBR' : 'TECHNICAL CAD'}
          </button>
        </div>

        {/* Right: Camera Reset & Case Study Button */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            type="button"
            onClick={handleReset}
            className="btn"
            style={{
              padding: '5px 10px',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
            title="Reset 3D Camera Position"
          >
            RESET CAM
          </button>

          {onOpenCaseStudy && (
            <button 
              type="button"
              onClick={onOpenCaseStudy}
              className="btn btn-primary"
              style={{
                padding: '5px 10px',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer'
              }}
            >
              SPECS →
            </button>
          )}
        </div>
      </div>

      {/* 5. EXPLODED VIEW PART ANNOTATION LABELS OVERLAY */}
      {exploded && !loading && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 12
          }}
        >
          {FRIDAY_PARTS.map((part) => (
            <div 
              key={part.id}
              style={{
                position: 'absolute',
                left: part.id.includes('shell') ? '66%' : part.id.includes('carrier') ? '68%' : '8%',
                top: part.id.includes('stand') ? '68%' : part.id.includes('rear') ? '26%' : part.id.includes('carrier') ? '46%' : '22%',
                background: 'rgba(15, 23, 42, 0.90)',
                border: '1px solid rgba(56, 189, 248, 0.45)',
                padding: '4px 10px',
                borderRadius: '3px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'var(--text-accent)',
                letterSpacing: '0.06em',
                boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                animation: 'fadeIn 0.3s ease'
              }}
            >
              <div style={{ fontWeight: 600, color: '#f8fafc' }}>{part.name}</div>
              <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)' }}>{part.code}</div>
            </div>
          ))}
        </div>
      )}

      {/* 6. BOTTOM TELEMETRY BAR: VOICE DSP & HARDWARE PIPELINE FLOW */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.94)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          color: 'var(--text-dim)'
        }}
      >
        <span style={{ color: 'var(--text-accent)', fontWeight: 600, letterSpacing: '0.06em' }}>
          PIPELINE //
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
          {pipelineStages.map((stage, idx) => (
            <React.Fragment key={stage.label}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: activePipelineStage === idx ? 'var(--text-accent)' : 'var(--text-dim)',
                  fontWeight: activePipelineStage === idx ? 600 : 400,
                  transition: 'color 0.2s ease'
                }}
              >
                <span 
                  style={{
                    display: 'inline-block',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: activePipelineStage === idx ? 'var(--accent-primary)' : 'rgba(148, 163, 184, 0.3)',
                    boxShadow: activePipelineStage === idx ? '0 0 6px var(--accent-primary)' : 'none'
                  }}
                />
                <span>{stage.label}</span>
              </div>
              {idx < pipelineStages.length - 1 && (
                <span style={{ color: 'rgba(148, 163, 184, 0.25)' }}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
