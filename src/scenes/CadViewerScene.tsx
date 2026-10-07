import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import type { CadModelItem } from '../data/cadModelsData';
import { createStudioGround, setupStudioLighting, safeCreateRenderer, safeDisposeRenderer } from './threeUtils';

interface CadViewerSceneProps {
  model: CadModelItem;
  height?: string;
  showControls?: boolean;
}

// Global geometry cache so STL files are only parsed once across the session
const cadGeometryCache = new Map<string, THREE.BufferGeometry>();

export const CadViewerScene: React.FC<CadViewerSceneProps> = ({
  model,
  height = '520px',
  showControls = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [controlMode, setControlMode] = useState<'orbit' | 'pan'>('orbit');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [inspectionMode, setInspectionMode] = useState<boolean>(false);
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'contrast' | 'inspection'>('studio');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [errorOccurred, setErrorOccurred] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [stats, setStats] = useState<{ vertices: number; triangles: number; bbox: string }>({
    vertices: 0,
    triangles: 0,
    bbox: ''
  });

  const autoRotateRef = useRef<boolean>(autoRotate);
  const controlModeRef = useRef<'orbit' | 'pan'>(controlMode);
  const wireframeRef = useRef<boolean>(wireframe);
  const inspectionModeRef = useRef<boolean>(inspectionMode);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    controlModeRef.current = controlMode;
  }, [controlMode]);

  useEffect(() => {
    wireframeRef.current = wireframe;
  }, [wireframe]);

  useEffect(() => {
    inspectionModeRef.current = inspectionMode;
  }, [inspectionMode]);

  const sceneStateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    meshGroup: THREE.Group;
    material: THREE.MeshStandardMaterial;
    wireMaterial: THREE.LineBasicMaterial;
    wireSegments: THREE.LineSegments | null;
    bboxHelper: THREE.Box3Helper | null;
    annotationGroup: THREE.Group;
    keyLight: THREE.DirectionalLight;
    fillLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
    resetCamera: () => void;
    zoom: (delta: number) => void;
    setupGeometry: (geometry: THREE.BufferGeometry) => void;
    loadModel: (model: CadModelItem) => void;
  } | null>(null);

  // Fullscreen event listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Wireframe toggle effect
  useEffect(() => {
    if (sceneStateRef.current) {
      sceneStateRef.current.material.wireframe = wireframe;
      if (sceneStateRef.current.wireSegments) {
        sceneStateRef.current.wireSegments.visible = wireframe;
      }
    }
  }, [wireframe]);

  // Inspection mode toggle effect
  useEffect(() => {
    if (sceneStateRef.current) {
      if (sceneStateRef.current.bboxHelper) {
        sceneStateRef.current.bboxHelper.visible = inspectionMode;
      }
      sceneStateRef.current.annotationGroup.visible = inspectionMode;
    }
  }, [inspectionMode]);

  // Lighting preset effect
  useEffect(() => {
    if (sceneStateRef.current) {
      const { keyLight, fillLight, rimLight } = sceneStateRef.current;
      if (lightingPreset === 'studio') {
        keyLight.intensity = 3.4;
        fillLight.intensity = 2.2;
        rimLight.intensity = 2.8;
      } else if (lightingPreset === 'contrast') {
        keyLight.intensity = 4.2;
        fillLight.intensity = 1.0;
        rimLight.intensity = 3.5;
      } else if (lightingPreset === 'inspection') {
        keyLight.intensity = 3.0;
        fillLight.intensity = 3.0;
        rimLight.intensity = 1.5;
      }
    }
  }, [lightingPreset]);

  // Fullscreen trigger
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Reset Camera trigger
  const handleResetCamera = useCallback(() => {
    if (sceneStateRef.current) {
      sceneStateRef.current.resetCamera();
    }
  }, []);

  // Zoom triggers
  const handleZoom = useCallback((direction: 'in' | 'out') => {
    if (sceneStateRef.current) {
      const delta = direction === 'in' ? -0.6 : 0.6;
      sceneStateRef.current.zoom(delta);
    }
  }, []);

  // --- INITIALIZE WEBGL ENGINE ONCE ON MOUNT ---
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
      setErrorMessage('Hardware WebGL context limit reached. Reload to re-initialize.');
      setLoading(false);
      return;
    }

    const width = container.clientWidth || 600;
    const h = container.clientHeight || 520;

    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / h, 0.1, 1000);
    const defaultCamPos = new THREE.Vector3(0, 1.6, 4.2);
    camera.position.copy(defaultCamPos);
    camera.lookAt(0, 0, 0);

    // Studio Environment & Soft Contact Shadow
    const { keyLight, fillLight, rimLight } = setupStudioLighting(scene);
    createStudioGround(scene, 6, 6, -1.0, 2.0);

    const meshGroup = new THREE.Group();
    scene.add(meshGroup);

    const annotationGroup = new THREE.Group();
    annotationGroup.visible = inspectionModeRef.current;
    scene.add(annotationGroup);

    // High-visibility Aerospace Bead-Blasted Aluminum CAD Material
    const material = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.28,
      metalness: 0.62,
      wireframe: wireframeRef.current
    });

    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75
    });

    const resetCamera = () => {
      camera.position.copy(defaultCamPos);
      camera.lookAt(0, 0, 0);
      meshGroup.rotation.set(0, 0, 0);
    };

    const zoom = (delta: number) => {
      camera.position.z = Math.max(1.8, Math.min(8.5, camera.position.z + delta));
    };

    const setupGeometry = (geometry: THREE.BufferGeometry) => {
      geometry.computeVertexNormals();
      geometry.center();

      // Bounding box scale
      geometry.computeBoundingBox();
      const bbox = geometry.boundingBox!;
      const size = new THREE.Vector3();
      bbox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scaleFactor = 2.2 / (maxDim || 1);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.setScalar(scaleFactor);
      mesh.rotation.x = -Math.PI / 2;

      meshGroup.clear();
      meshGroup.add(mesh);

      // Edge segments for precision CAD outline
      const edges = new THREE.EdgesGeometry(geometry, 28);
      const wire = new THREE.LineSegments(edges, wireMaterial);
      wire.scale.copy(mesh.scale);
      wire.rotation.copy(mesh.rotation);
      wire.visible = wireframeRef.current;
      meshGroup.add(wire);

      if (sceneStateRef.current) {
        sceneStateRef.current.wireSegments = wire;
      }

      // Bounding Box Inspection Wireframe
      if (sceneStateRef.current?.bboxHelper) {
        scene.remove(sceneStateRef.current.bboxHelper);
        sceneStateRef.current.bboxHelper.dispose();
      }
      const bboxHelper = new THREE.Box3Helper(new THREE.Box3().setFromObject(mesh), new THREE.Color(0x38bdf8));
      bboxHelper.visible = inspectionModeRef.current;
      scene.add(bboxHelper);
      if (sceneStateRef.current) {
        sceneStateRef.current.bboxHelper = bboxHelper;
      }

      // Mounting Point Inspection Markers
      annotationGroup.clear();
      const mountOffsets = [
        new THREE.Vector3(-0.8, -0.6, 0.4),
        new THREE.Vector3(0.8, -0.6, 0.4),
        new THREE.Vector3(-0.8, -0.6, -0.4),
        new THREE.Vector3(0.8, -0.6, -0.4)
      ];
      mountOffsets.forEach((pos) => {
        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x34d399 })
        );
        marker.position.copy(pos);
        annotationGroup.add(marker);

        const labelCross = new THREE.LineSegments(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-0.06, 0, 0), new THREE.Vector3(0.06, 0, 0),
            new THREE.Vector3(0, -0.06, 0), new THREE.Vector3(0, 0.06, 0)
          ]),
          new THREE.LineBasicMaterial({ color: 0x34d399 })
        );
        labelCross.position.copy(pos);
        annotationGroup.add(labelCross);
      });

      setStats({
        vertices: geometry.attributes.position.count,
        triangles: geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3,
        bbox: `${(size.x * 10).toFixed(1)} × ${(size.y * 10).toFixed(1)} × ${(size.z * 10).toFixed(1)} mm`
      });

      setLoadProgress(100);
      setLoading(false);
    };

    const loadModel = (m: CadModelItem) => {
      setLoading(true);
      setLoadProgress(30);
      setErrorOccurred(false);
      setErrorMessage('');

      if (m.fileType === 'stl' && m.fileUrl) {
        if (cadGeometryCache.has(m.fileUrl)) {
          setLoadProgress(90);
          setupGeometry(cadGeometryCache.get(m.fileUrl)!.clone());
        } else {
          const loader = new STLLoader();
          let didFinish = false;
          const timeoutId = setTimeout(() => {
            if (!didFinish) {
              setErrorOccurred(true);
              setErrorMessage(`CAD Asset timeout: ${m.name}`);
              setLoading(false);
            }
          }, 8000);

          loader.load(
            m.fileUrl,
            (geometry) => {
              didFinish = true;
              clearTimeout(timeoutId);
              cadGeometryCache.set(m.fileUrl, geometry);
              setLoadProgress(95);
              setupGeometry(geometry.clone());
            },
            (xhr) => {
              if (xhr.lengthComputable) {
                setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
              }
            },
            () => {
              didFinish = true;
              clearTimeout(timeoutId);
              setErrorOccurred(true);
              setErrorMessage(import.meta.env.DEV ? `STLLoader error: ${m.fileUrl}` : 'CAD MODEL UNAVAILABLE');
              setLoading(false);
              const fallbackGeo = new THREE.BoxGeometry(2.0, 0.8, 1.2, 8, 8, 8);
              setupGeometry(fallbackGeo);
            }
          );
        }
      } else {
        const proceduralGeo = new THREE.CylinderGeometry(0.8, 1.1, 1.6, 24, 6);
        setupGeometry(proceduralGeo);
      }
    };

    sceneStateRef.current = {
      renderer,
      scene,
      camera,
      meshGroup,
      material,
      wireMaterial,
      wireSegments: null,
      bboxHelper: null,
      annotationGroup,
      keyLight,
      fillLight,
      rimLight,
      resetCamera,
      zoom,
      setupGeometry,
      loadModel
    };

    // Load initial model right away on mount!
    loadModel(model);

    // Interactive Orbit / Pan / Zoom
    let isDragging = false;
    let isPanning = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        if (controlModeRef.current === 'pan') {
          isPanning = true;
        } else {
          isDragging = true;
        }
      }
      if (e.button === 2) isPanning = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      prevMouse = { x: e.clientX, y: e.clientY };

      if (isDragging) {
        meshGroup.rotation.y += dx * 0.01;
        meshGroup.rotation.x += dy * 0.01;
      } else if (isPanning) {
        camera.position.x -= dx * 0.005;
        camera.position.y += dy * 0.005;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      isPanning = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(1.8, Math.min(8.5, camera.position.z + e.deltaY * 0.003));
    };

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    // Touch Support for Mobile
    let prevTouchDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        if (controlModeRef.current === 'pan') {
          isPanning = true;
        } else {
          isDragging = true;
        }
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        isDragging = false;
        isPanning = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        prevTouchDist = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - prevMouse.x;
        const dy = e.touches[0].clientY - prevMouse.y;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        if (isDragging) {
          meshGroup.rotation.y += dx * 0.012;
          meshGroup.rotation.x += dy * 0.012;
        } else if (isPanning) {
          camera.position.x -= dx * 0.006;
          camera.position.y += dy * 0.006;
        }
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (prevTouchDist > 0) {
          const delta = (prevTouchDist - dist) * 0.01;
          camera.position.z = Math.max(1.8, Math.min(8.5, camera.position.z + delta));
        }
        prevTouchDist = dist;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
      isPanning = false;
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

    // Performance IntersectionObserver
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
    let prevTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const now = performance.now();
      const delta = (now - prevTime) / 1000;
      prevTime = now;

      if (autoRotateRef.current && !isDragging && !isPanning) {
        meshGroup.rotation.y += delta * 0.35;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
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
      sceneStateRef.current = null;
    };
  }, []);

  // --- MODEL SWAPPING EFFECT (REUSES EXISTING WEBGL CONTEXT) ---
  useEffect(() => {
    if (sceneStateRef.current) {
      sceneStateRef.current.loadModel(model);
    }
  }, [model]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: height,
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-medium)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    >
      {/* Loading Progress State */}
      {loading && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(8, 9, 13, 0.92)',
            zIndex: 20,
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-accent)' }}>
            <span className="tech-status-dot" />
            <span>INITIALIZING CAD DATA // [{loadProgress}%]</span>
          </div>
          <div style={{ width: '220px', height: '2px', backgroundColor: 'var(--border-subtle)', position: 'relative' }}>
            <div style={{ width: `${loadProgress}%`, height: '100%', backgroundColor: 'var(--accent-blue)', transition: 'width 200ms ease' }} />
          </div>
        </div>
      )}

      {/* Error Fallback Notice */}
      {errorOccurred && !loading && (
        <div 
          style={{
            position: 'absolute',
            top: '48px',
            left: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: '#f87171',
            backgroundColor: 'rgba(8, 9, 13, 0.90)',
            padding: '4px 10px',
            border: '1px solid rgba(248, 113, 113, 0.4)',
            borderRadius: '2px',
            zIndex: 15
          }}
        >
          CAD MODEL UNAVAILABLE {errorMessage ? `// ${errorMessage}` : '// PROCEDURAL FALLBACK LOADED'}
        </div>
      )}

      {/* Engineering Technical Readout (Top Left) */}
      <div 
        style={{
          position: 'absolute',
          top: '14px',
          left: '16px',
          pointerEvents: 'none',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          zIndex: 5
        }}
      >
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {model.name}
        </span>
        <span style={{ color: 'var(--text-accent)' }}>
          {model.cadCode} // {model.category}
        </span>
        <span className="tech-coord">
          DIM: {stats.bbox || model.dimensions}
        </span>
      </div>

      {/* Mesh Statistics (Top Right, hidden in fullscreen mode for clean inspection) */}
      {!isFullscreen && (
        <div 
          style={{
            position: 'absolute',
            top: '14px',
            right: '16px',
            pointerEvents: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            textAlign: 'right',
            zIndex: 5
          }}
        >
          <div>VERTS: {stats.vertices.toLocaleString()}</div>
          <div>TRIS: {Math.round(stats.triangles).toLocaleString()}</div>
          <div>MAT: {model.material}</div>
        </div>
      )}

      {/* Professional CAD Inspection Controls Bar (Bottom) */}
      {showControls && (
        <div 
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '14px',
            right: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            zIndex: 10
          }}
        >
          {/* Inspection Mode, Wireframe & Interaction Modes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* ORBIT Control */}
            <button
              onClick={() => setControlMode('orbit')}
              className="tech-badge"
              style={{
                cursor: 'pointer',
                backgroundColor: controlMode === 'orbit' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(8, 9, 13, 0.85)',
                color: controlMode === 'orbit' ? 'var(--text-accent)' : 'var(--text-secondary)'
              }}
              title="3-Axis Orbit Mode"
            >
              ORBIT
            </button>

            {/* PAN Control */}
            <button
              onClick={() => setControlMode('pan')}
              className="tech-badge"
              style={{
                cursor: 'pointer',
                backgroundColor: controlMode === 'pan' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(8, 9, 13, 0.85)',
                color: controlMode === 'pan' ? 'var(--text-accent)' : 'var(--text-secondary)'
              }}
              title="Camera Pan Mode"
            >
              PAN
            </button>

            {/* ZOOM Controls */}
            <button
              onClick={() => handleZoom('in')}
              className="tech-badge"
              style={{ cursor: 'pointer', backgroundColor: 'rgba(8, 9, 13, 0.85)' }}
              title="Zoom In"
            >
              ZOOM +
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="tech-badge"
              style={{ cursor: 'pointer', backgroundColor: 'rgba(8, 9, 13, 0.85)' }}
              title="Zoom Out"
            >
              ZOOM -
            </button>

            {/* WIREFRAME Toggle */}
            <button
              onClick={() => setWireframe(!wireframe)}
              className="tech-badge"
              style={{
                cursor: 'pointer',
                backgroundColor: wireframe ? 'rgba(56, 189, 248, 0.2)' : 'rgba(8, 9, 13, 0.85)'
              }}
              title="Toggle wireframe rendering (shows CAD technical edges)"
            >
              {wireframe ? '● WIREFRAME' : 'SOLID'}
            </button>

            {!isFullscreen && (
              <button
                onClick={() => setInspectionMode(!inspectionMode)}
                className="tech-badge"
                style={{
                  cursor: 'pointer',
                  backgroundColor: inspectionMode ? 'rgba(52, 211, 153, 0.2)' : 'rgba(8, 9, 13, 0.85)',
                  color: inspectionMode ? 'var(--status-active)' : 'var(--text-secondary)'
                }}
                title="Toggle CAD dimension markers and mounting points"
              >
                {inspectionMode ? '● INSPECT: ON' : 'INSPECT MODE'}
              </button>
            )}

            {!isFullscreen && (
              <button
                onClick={() => {
                  const next = lightingPreset === 'studio' ? 'contrast' : lightingPreset === 'contrast' ? 'inspection' : 'studio';
                  setLightingPreset(next);
                }}
                className="tech-badge"
                style={{ cursor: 'pointer', backgroundColor: 'rgba(8, 9, 13, 0.85)' }}
                title="Toggle Studio Lighting Setup"
              >
                LIGHT: {lightingPreset.toUpperCase()}
              </button>
            )}
          </div>

          {/* Camera Reset, Auto-Rotate & Fullscreen */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="tech-badge"
              style={{
                cursor: 'pointer',
                backgroundColor: autoRotate ? 'rgba(56, 189, 248, 0.2)' : 'rgba(8, 9, 13, 0.85)'
              }}
            >
              {autoRotate ? 'PAUSE ROT' : 'AUTO ROT'}
            </button>

            <button
              onClick={handleResetCamera}
              className="tech-badge"
              style={{ cursor: 'pointer', backgroundColor: 'rgba(8, 9, 13, 0.85)' }}
              title="Reset View to 3/4 Product Angle"
            >
              RESET
            </button>

            <button
              onClick={toggleFullscreen}
              className="tech-badge"
              style={{
                cursor: 'pointer',
                backgroundColor: isFullscreen ? 'rgba(56, 189, 248, 0.2)' : 'rgba(8, 9, 13, 0.85)'
              }}
              title="Toggle Fullscreen Viewport"
            >
              {isFullscreen ? 'EXIT FULL' : 'FULLSCREEN'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
