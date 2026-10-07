import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createContactShadowTexture, safeCreateRenderer, safeDisposeRenderer } from './threeUtils';

interface ThreeDPaperProps {
  interactive?: boolean;
}

export const ThreeDPaper: React.FC<ThreeDPaperProps> = ({ interactive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = safeCreateRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    if (!renderer) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 7.2);

    // Studio Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.0);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x90b4ce, 0.8);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    const ambLight = new THREE.AmbientLight(0x0e111a, 1.2);
    scene.add(ambLight);

    // Artifact Anchor Group
    const artifactGroup = new THREE.Group();
    scene.add(artifactGroup);

    // --- Soft Ambient Contact Shadow Underneath ---
    const shadowGeo = new THREE.PlaneGeometry(5.6, 3.8);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      opacity: 0.7,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -1.8, -0.4);
    artifactGroup.add(shadowMesh);

    // --- 1. Custom Technical Paper Shader Plane ---
    const planeGeo = new THREE.PlaneGeometry(5.2, 3.4, 64, 48);

    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        vUv = uv;
        vec3 pos = position;

        // Subtle organic undulating paper wave
        float wave1 = sin(pos.x * 1.4 + uTime * 0.7) * cos(pos.y * 1.8 + uTime * 0.5) * 0.11;
        float wave2 = sin(pos.x * 2.8 - pos.y * 2.0 + uTime * 0.35) * 0.03;
        
        // Gentle cursor-induced ripple
        float distToMouse = length(pos.xy - uMouse * 2.2);
        float mouseRipple = sin(distToMouse * 3.8 - uTime * 1.8) * exp(-distToMouse * 1.4) * 0.06;

        pos.z += wave1 + wave2 + mouseRipple;
        vElevation = pos.z;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        // High-precision technical blueprint grid
        vec2 grid = abs(fract(vUv * vec2(32.0, 20.0) - 0.5) - 0.5) / fwidth(vUv * vec2(32.0, 20.0));
        float line = min(grid.x, grid.y);
        float gridAlpha = 1.0 - min(line, 1.0);

        // Major quadrant grid lines
        vec2 majorGrid = abs(fract(vUv * vec2(4.0, 2.5) - 0.5) - 0.5) / fwidth(vUv * vec2(4.0, 2.5));
        float majorLine = min(majorGrid.x, majorGrid.y);
        float majorAlpha = 1.0 - min(majorLine, 1.0);

        // Subtle topographic contour lines
        float contour = sin(vElevation * 42.0);
        float contourLine = smoothstep(0.93, 1.0, contour) * 0.22;

        // Base sheet tone - deep matte graphite/charcoal
        vec3 paperBase = vec3(0.065, 0.075, 0.10);
        
        // Technical electric blue accent lines
        vec3 lineBlue = vec3(0.22, 0.74, 0.97);
        vec3 gridCol = mix(paperBase, lineBlue, gridAlpha * 0.20 + majorAlpha * 0.50 + contourLine);

        // Edge perimeter frame glow
        float edgeX = smoothstep(0.0, 0.015, vUv.x) * smoothstep(1.0, 0.985, vUv.x);
        float edgeY = smoothstep(0.0, 0.02, vUv.y) * smoothstep(1.0, 0.98, vUv.y);
        float edge = 1.0 - (edgeX * edgeY);

        vec3 col = mix(gridCol, vec3(0.35, 0.82, 1.0), edge * 0.82);
        
        // Depth shading based on elevation
        col += (vElevation * 0.32);

        float alpha = 0.95;
        gl_FragColor = vec4(col, alpha);
      }
    `;

    const paperMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(width, height) }
      },
      transparent: true,
      side: THREE.DoubleSide
    });

    const paperMesh = new THREE.Mesh(planeGeo, paperMaterial);
    artifactGroup.add(paperMesh);

    // --- 2. Technical Outer Wireframe Boundary Box ---
    const borderGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(5.24, 3.44));
    const borderMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55
    });
    const borderLines = new THREE.LineSegments(borderGeo, borderMat);
    artifactGroup.add(borderLines);

    // --- 3. Engineering Precision Crosshairs & Corner Ticks ---
    const tickGroup = new THREE.Group();
    const cornerOffsets = [
      [-2.6, 1.7], [2.6, 1.7], [-2.6, -1.7], [2.6, -1.7]
    ];
    cornerOffsets.forEach(([cx, cy]) => {
      const cornerGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(cx - 0.2 * Math.sign(cx), cy, 0.05),
        new THREE.Vector3(cx, cy, 0.05),
        new THREE.Vector3(cx, cy - 0.2 * Math.sign(cy), 0.05)
      ]);
      const cornerLine = new THREE.Line(cornerGeo, new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.85
      }));
      tickGroup.add(cornerLine);
    });

    // Center precision reticle
    const reticleGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.15, 0, 0.05), new THREE.Vector3(0.15, 0, 0.05),
      new THREE.Vector3(0, -0.15, 0.05), new THREE.Vector3(0, 0.15, 0.05)
    ]);
    const reticleLine = new THREE.LineSegments(reticleGeo, new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5
    }));
    tickGroup.add(reticleLine);
    artifactGroup.add(tickGroup);

    // Floating Engineering Studio Depth Grid
    const backGridGeo = new THREE.GridHelper(8, 16, 0x1e2433, 0x0f131c);
    backGridGeo.rotation.x = Math.PI / 2.2;
    backGridGeo.position.z = -1.4;
    scene.add(backGridGeo);

    // Resting rotation (isometric engineering pitch)
    artifactGroup.rotation.x = 0.24;
    artifactGroup.rotation.y = -0.30;
    artifactGroup.rotation.z = 0.07;

    // Mouse Tracking with Easing
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = nx;
      mouse.targetY = ny;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Performance IntersectionObserver (pauses loop when scrolled offscreen)
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
      paperMaterial.uniforms.uResolution.value.set(nw, nh);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = (performance.now() - startTime) * 0.001;
      paperMaterial.uniforms.uTime.value = elapsedTime;

      // Smooth cursor interpolation (damping)
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      paperMaterial.uniforms.uMouse.value.set(mouse.x, mouse.y);

      // Controlled mechanical orientation response
      artifactGroup.rotation.y = -0.30 + mouse.x * 0.14;
      artifactGroup.rotation.x = 0.24 - mouse.y * 0.10;
      
      // Floating oscillation
      artifactGroup.position.y = Math.sin(elapsedTime * 0.65) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      planeGeo.dispose();
      paperMaterial.dispose();
      borderGeo.dispose();
      borderMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      safeDisposeRenderer(renderer, container);
    };
  }, [interactive]);

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '440px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
          left: 0
        }} 
      />

      {/* Subtle Engineering Studio Annotations */}
      <div 
        style={{
          position: 'absolute',
          top: '16px',
          left: '20px',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          zIndex: 10
        }}
      >
        <span className="tech-coord" style={{ color: 'var(--text-accent)' }}>
          SYSTEM / 01 // WEBGL ENGINE
        </span>
        <span className="tech-coord">
          INTERACTIVE SURFACE · REV 01
        </span>
      </div>

      <div 
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '20px',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '3px',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="tech-status-dot" />
          <span className="tech-coord" style={{ color: 'var(--text-primary)' }}>
            SURFACE HARMONICS ACTIVE
          </span>
        </div>
        <span className="tech-coord">
          CALIBRATION: [X: 28.6139° / Y: 77.2090°]
        </span>
      </div>

      <div 
        style={{
          position: 'absolute',
          top: '14px',
          right: '18px',
          pointerEvents: 'none',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-dim)',
          letterSpacing: '0.1em'
        }}
      >
        +----+ STUDIO RENDER
      </div>
    </div>
  );
};
