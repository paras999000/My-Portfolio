import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import type { CadModelItem } from '../data/cadModelsData';
import { createContactShadowTexture, safeCreateRenderer, safeDisposeRenderer } from './threeUtils';

interface CadThumbnailPreviewProps {
  model: CadModelItem;
  isHovered?: boolean;
  height?: string;
}

// Module-level geometry cache so STLs are only parsed once across cards
const geometryCache = new Map<string, THREE.BufferGeometry>();

export const CadThumbnailPreview: React.FC<CadThumbnailPreviewProps> = ({
  model,
  isHovered = false,
  height = '200px'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvas2dRef = useRef<HTMLCanvasElement>(null);

  // 1. Lightweight 2D Technical Blueprint Render (Zero WebGL contexts when idle)
  useEffect(() => {
    if (isHovered) return;
    const canvas = canvas2dRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width = 320;
    const h = canvas.height = 210;

    ctx.fillStyle = '#080b11';
    ctx.fillRect(0, 0, w, h);

    // Subtle technical grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Isometric CAD Part Bounding Box Projection
    const cx = w / 2;
    const cy = h / 2 + 10;
    const bw = 55;
    const bh = 40;
    const bz = 45;

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.5;

    // Top face
    ctx.beginPath();
    ctx.moveTo(cx, cy - bh - bz);
    ctx.lineTo(cx + bw, cy - bh);
    ctx.lineTo(cx, cy - bh + bz * 0.4);
    ctx.lineTo(cx - bw, cy - bh);
    ctx.closePath();
    ctx.stroke();

    // Front-left face
    ctx.beginPath();
    ctx.moveTo(cx - bw, cy - bh);
    ctx.lineTo(cx, cy - bh + bz * 0.4);
    ctx.lineTo(cx, cy + bz * 0.4);
    ctx.lineTo(cx - bw, cy);
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.fill();
    ctx.stroke();

    // Front-right face
    ctx.beginPath();
    ctx.moveTo(cx, cy - bh + bz * 0.4);
    ctx.lineTo(cx + bw, cy - bh);
    ctx.lineTo(cx + bw, cy);
    ctx.lineTo(cx, cy + bz * 0.4);
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.fill();
    ctx.stroke();

    // Reticle crosshair at center
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy);
    ctx.lineTo(cx + 12, cy);
    ctx.moveTo(cx, cy - 12);
    ctx.lineTo(cx, cy + 12);
    ctx.stroke();

    // Technical coordinates readout
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.font = '9px monospace';
    ctx.fillText(`CAD // ${model.cadCode}`, 14, 22);
    ctx.fillText(`STATUS: PRE-COMPILED MESH`, 14, 34);
    ctx.fillText(`HOVER TO ENGAGE 3D TURNTABLE`, 14, h - 14);

  }, [isHovered, model]);

  // 2. High-Performance On-Demand 3D WebGL Turntable (Active only when hovered)
  useEffect(() => {
    if (!isHovered) return;
    const container = containerRef.current;
    if (!container) return;

    const renderer = safeCreateRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
    if (!renderer) return;

    const width = container.clientWidth || 300;
    const h = container.clientHeight || 200;

    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / h, 0.1, 100);
    camera.position.set(0, 1.4, 3.8);
    camera.lookAt(0, 0, 0);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbae6fd, 2.0);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    scene.add(new THREE.AmbientLight(0x64748b, 1.4));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.8));

    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = -0.72;
    scene.add(shadowMesh);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const material = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.28,
      metalness: 0.55
    });

    const wireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45
    });

    const setupGeo = (geo: THREE.BufferGeometry) => {
      geo.computeVertexNormals();
      geo.center();
      geo.computeBoundingBox();
      const bbox = geo.boundingBox!;
      const size = new THREE.Vector3();
      bbox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scaleFactor = 1.9 / (maxDim || 1);

      const mesh = new THREE.Mesh(geo, material);
      mesh.scale.setScalar(scaleFactor);
      mesh.rotation.x = -Math.PI / 2;

      const edges = new THREE.EdgesGeometry(geo, 30);
      const wire = new THREE.LineSegments(edges, wireMat);
      wire.scale.copy(mesh.scale);
      wire.rotation.copy(mesh.rotation);

      modelGroup.clear();
      modelGroup.add(mesh);
      modelGroup.add(wire);
    };

    if (model.fileType === 'stl' && model.fileUrl) {
      if (geometryCache.has(model.fileUrl)) {
        setupGeo(geometryCache.get(model.fileUrl)!.clone());
      } else {
        const loader = new STLLoader();
        loader.load(
          model.fileUrl,
          (g) => {
            geometryCache.set(model.fileUrl, g);
            setupGeo(g.clone());
          },
          undefined,
          () => {
            const fallbackGeo = new THREE.BoxGeometry(1.4, 0.6, 1.0, 4, 4, 4);
            setupGeo(fallbackGeo);
          }
        );
      }
    } else {
      const proceduralGeo = new THREE.CylinderGeometry(0.65, 0.9, 1.3, 18, 4);
      setupGeo(proceduralGeo);
    }

    let animationFrameId: number;
    let prevTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - prevTime) * 0.001;
      prevTime = now;

      modelGroup.rotation.y += delta * 0.65;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      safeDisposeRenderer(renderer, container);
    };
  }, [isHovered, model]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: height,
        backgroundColor: '#080b11',
        overflow: 'hidden'
      }}
    >
      {!isHovered && (
        <canvas
          ref={canvas2dRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />
      )}
    </div>
  );
};
