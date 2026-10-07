import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import type { CadModelItem } from '../data/cadModelsData';

interface CadViewerSceneProps {
  model: CadModelItem;
  height?: string;
  showControls?: boolean;
}

export const CadViewerScene: React.FC<CadViewerSceneProps> = ({
  model,
  height = '420px',
  showControls = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<{ vertices: number; triangles: number }>({ vertices: 0, triangles: 0 });

  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    meshGroup: THREE.Group;
    material: THREE.MeshStandardMaterial;
    wireMaterial: THREE.LineBasicMaterial;
    wireSegments: THREE.LineSegments | null;
  } | null>(null);

  // Toggle wireframe mode
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.material.wireframe = wireframe;
      if (sceneRef.current.wireSegments) {
        sceneRef.current.wireSegments.visible = wireframe;
      }
    }
  }, [wireframe]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setLoading(true);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      setLoading(false);
      return;
    }

    const width = container.clientWidth || 600;
    const h = container.clientHeight || 420;

    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / h, 0.1, 1000);
    camera.position.set(0, 1.8, 4.2);

    // Floor Technical Grid
    const floorGrid = new THREE.GridHelper(6, 16, 0x334155, 0x1e293b);
    floorGrid.position.y = -1.2;
    scene.add(floorGrid);

    // Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-5, -2, -4);
    scene.add(fillLight);

    const ambLight = new THREE.AmbientLight(0x1e293b, 1.5);
    scene.add(ambLight);

    const meshGroup = new THREE.Group();
    scene.add(meshGroup);

    // Industrial Titanium / Matte Carbon CAD Material
    const material = new THREE.MeshStandardMaterial({
      color: 0x222a38,
      roughness: 0.35,
      metalness: 0.7,
      wireframe: wireframe
    });

    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6
    });

    sceneRef.current = {
      renderer,
      scene,
      camera,
      meshGroup,
      material,
      wireMaterial,
      wireSegments: null
    };

    // Load STL or procedural fallback
    const loader = new STLLoader();

    const setupGeometry = (geometry: THREE.BufferGeometry) => {
      geometry.computeVertexNormals();
      geometry.center();

      // Compute bounding box for scaling
      geometry.computeBoundingBox();
      const bbox = geometry.boundingBox!;
      const size = new THREE.Vector3();
      bbox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scaleFactor = 2.4 / (maxDim || 1);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.setScalar(scaleFactor);
      
      // Orient upright
      mesh.rotation.x = -Math.PI / 2;

      meshGroup.clear();
      meshGroup.add(mesh);

      // Edge segments for high precision CAD outline
      const edges = new THREE.EdgesGeometry(geometry, 25);
      const wire = new THREE.LineSegments(edges, wireMaterial);
      wire.scale.copy(mesh.scale);
      wire.rotation.copy(mesh.rotation);
      wire.visible = false;
      meshGroup.add(wire);
      if (sceneRef.current) {
        sceneRef.current.wireSegments = wire;
      }

      setStats({
        vertices: geometry.attributes.position.count,
        triangles: geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3
      });
      setLoading(false);
    };

    if (model.fileType === 'stl' && model.fileUrl) {
      loader.load(
        model.fileUrl,
        (geometry) => {
          setupGeometry(geometry);
        },
        undefined,
        () => {
          // Fallback procedural CAD enclosure geometry if STL is missing
          const fallbackGeo = new THREE.BoxGeometry(2.0, 0.8, 1.2, 8, 8, 8);
          setupGeometry(fallbackGeo);
        }
      );
    } else {
      const proceduralGeo = new THREE.CylinderGeometry(0.8, 1.1, 1.6, 24, 6);
      setupGeometry(proceduralGeo);
    }

    // Manual Orbit / Pan / Zoom handlers
    let isDragging = false;
    let isPanning = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) isDragging = true;
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

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('contextmenu', onContextMenu);

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
      const delta = clock.getDelta();

      if (autoRotate && !isDragging) {
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
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [model]);

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: height,
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '3px',
        overflow: 'hidden'
      }}
    >
      <div 
        ref={containerRef} 
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          cursor: 'grab'
        }} 
      />

      {/* Loading Overlay */}
      {loading && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(8, 9, 13, 0.8)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--text-accent)',
            gap: '8px',
            zIndex: 10
          }}
        >
          <span className="tech-status-dot" />
          PARSING CAD MESH DATA...
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
          DIM: {model.dimensions}
        </span>
      </div>

      {/* Mesh Statistics (Top Right) */}
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

      {/* Control Toolbar (Bottom Right) */}
      {showControls && (
        <div 
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 5
          }}
        >
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`btn-ghost tech-badge ${wireframe ? 'active' : ''}`}
            style={{
              cursor: 'pointer',
              backgroundColor: wireframe ? 'rgba(56, 189, 248, 0.2)' : 'rgba(8, 9, 13, 0.7)'
            }}
          >
            {wireframe ? 'SOLID' : 'WIREFRAME'}
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="btn-ghost tech-badge"
            style={{
              cursor: 'pointer',
              backgroundColor: autoRotate ? 'rgba(56, 189, 248, 0.2)' : 'rgba(8, 9, 13, 0.7)'
            }}
          >
            {autoRotate ? 'PAUSE ROT' : 'AUTO ROT'}
          </button>
        </div>
      )}

      {/* Inspection Mode Tag (Bottom Left) */}
      <div 
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-dim)',
          pointerEvents: 'none',
          zIndex: 5
        }}
      >
        [L-CLICK] ROTATE · [R-CLICK] PAN · [SCROLL] ZOOM
      </div>
    </div>
  );
};
