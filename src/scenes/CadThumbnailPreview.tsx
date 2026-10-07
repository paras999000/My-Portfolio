import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import type { CadModelItem } from '../data/cadModelsData';
import { createContactShadowTexture } from './threeUtils';

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
  const isHoveredRef = useRef<boolean>(isHovered);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

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

    // High-Clarity Studio 3-Point Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbae6fd, 2.0);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    const ambLight = new THREE.AmbientLight(0x64748b, 1.4);
    scene.add(ambLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 1.8);
    scene.add(hemiLight);

    // Ground Contact Shadow
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

    // Bright Aerospace Bead-Blasted Aluminum CAD Material
    const material = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.28,
      metalness: 0.55
    });

    const wireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65
    });

    let currentMesh: THREE.Mesh | null = null;
    let currentWire: THREE.LineSegments | null = null;

    const setupGeometry = (geometry: THREE.BufferGeometry) => {
      geometry.computeVertexNormals();
      geometry.center();

      geometry.computeBoundingBox();
      const bbox = geometry.boundingBox!;
      const size = new THREE.Vector3();
      bbox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scaleFactor = 1.6 / (maxDim || 1);

      currentMesh = new THREE.Mesh(geometry, material);
      currentMesh.scale.setScalar(scaleFactor);
      currentMesh.rotation.x = -Math.PI / 2;
      modelGroup.add(currentMesh);

      const edges = new THREE.EdgesGeometry(geometry, 28);
      currentWire = new THREE.LineSegments(edges, wireMat);
      currentWire.scale.copy(currentMesh.scale);
      currentWire.rotation.copy(currentMesh.rotation);
      modelGroup.add(currentWire);
    };

    if (model.fileType === 'stl' && model.fileUrl) {
      if (geometryCache.has(model.fileUrl)) {
        setupGeometry(geometryCache.get(model.fileUrl)!.clone());
      } else {
        const loader = new STLLoader();
        loader.load(
          model.fileUrl,
          (geometry) => {
            geometryCache.set(model.fileUrl, geometry);
            setupGeometry(geometry.clone());
          },
          undefined,
          () => {
            const fallbackGeo = new THREE.BoxGeometry(1.6, 0.7, 1.0, 6, 6, 6);
            setupGeometry(fallbackGeo);
          }
        );
      }
    } else {
      const proceduralGeo = new THREE.CylinderGeometry(0.7, 0.9, 1.3, 20, 4);
      setupGeometry(proceduralGeo);
    }

    // Interactive Mouse Tilt on Hover
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHoveredRef.current) return;
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const parentCard = container.closest('.cad-model-card');
    if (parentCard) {
      parentCard.addEventListener('mousemove', handleMouseMove as EventListener);
      parentCard.addEventListener('mouseleave', () => {
        mouse.targetX = 0;
        mouse.targetY = 0;
      });
    }

    // Performance IntersectionObserver (pauses WebGL loop when scrolled offscreen)
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
      const delta = (now - prevTime) * 0.001;
      prevTime = now;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Deliberate, subtle engineering turntable rotation
      const speed = isHoveredRef.current ? 0.45 : 0.22;
      modelGroup.rotation.y += delta * speed;

      // Subtle responsive cursor tilt
      if (isHoveredRef.current) {
        modelGroup.rotation.x = mouse.y * 0.22;
        modelGroup.rotation.z = -mouse.x * 0.12;
      } else {
        modelGroup.rotation.x *= 0.95;
        modelGroup.rotation.z *= 0.95;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      resizeObserver.disconnect();
      if (parentCard) {
        parentCard.removeEventListener('mousemove', handleMouseMove as EventListener);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (currentMesh) {
        currentMesh.geometry.dispose();
      }
      if (currentWire) {
        currentWire.geometry.dispose();
      }
      material.dispose();
      wireMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      renderer.dispose();
    };
  }, [model]);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: height,
        position: 'relative',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    />
  );
};
