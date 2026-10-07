import * as THREE from 'three';

/**
 * Creates a soft radial contact shadow texture for grounding physical 3D models.
 * Eliminates floating-object syndrome with realistic ambient occlusion falloff.
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 512);

  // Core tight contact shadow
  const coreGrad = ctx.createRadialGradient(256, 256, 12, 256, 256, 140);
  coreGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
  coreGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.70)');
  coreGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.25)');
  coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = coreGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Soft ambient occlusion bleed
  const bleedGrad = ctx.createRadialGradient(256, 256, 60, 256, 256, 240);
  bleedGrad.addColorStop(0, 'rgba(0, 0, 0, 0.40)');
  bleedGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
  bleedGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bleedGrad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a procedural brushed metal normal map for machined aluminum surfaces.
 */
export function createBrushedMetalNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgb(128, 128, 255)'; // Neutral flat normal
  ctx.fillRect(0, 0, 256, 256);

  // Subtle directional brushed grain lines
  ctx.fillStyle = 'rgba(140, 128, 255, 0.25)';
  for (let i = 0; i < 60; i++) {
    const y = Math.random() * 256;
    const h = 1 + Math.random() * 2;
    ctx.fillRect(0, y, 256, h);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a ground plane with realistic contact shadow and subtle laboratory floor grid.
 */
export function createStudioGround(
  scene: THREE.Scene,
  width: number = 6,
  height: number = 6,
  yPos: number = 0,
  shadowRadius: number = 2.4
): { ground: THREE.Mesh; shadowPlane: THREE.Mesh; grid: THREE.GridHelper } {
  // 1. Soft Ambient Contact Shadow
  const shadowGeo = new THREE.PlaneGeometry(shadowRadius * 2, shadowRadius * 2);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowTex = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.88,
    depthWrite: false
  });
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.position.y = yPos + 0.003;
  scene.add(shadowPlane);

  // 2. Matte Studio Floor Plane
  const floorGeo = new THREE.PlaneGeometry(width * 2, height * 2);
  floorGeo.rotateX(-Math.PI / 2);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x090b10,
    roughness: 0.85,
    metalness: 0.15
  });
  const ground = new THREE.Mesh(floorGeo, floorMat);
  ground.position.y = yPos;
  ground.receiveShadow = true;
  scene.add(ground);

  // 3. Subtle Technical Studio Grid
  const grid = new THREE.GridHelper(width, 16, 0x38bdf8, 0x1e293b);
  grid.position.y = yPos + 0.001;
  scene.add(grid);

  return { ground, shadowPlane, grid };
}

/**
 * Standard Realistic High-Visibility Studio Lighting Rig for Engineering Products.
 */
export function setupStudioLighting(scene: THREE.Scene): {
  keyLight: THREE.DirectionalLight;
  fillLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  ambLight: THREE.AmbientLight;
  hemiLight: THREE.HemisphereLight;
} {
  // Primary bright key light (crisp, warm white)
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
  keyLight.position.set(4.5, 7.5, 5.0);
  scene.add(keyLight);

  // Subtle cool fill light
  const fillLight = new THREE.DirectionalLight(0xbae6fd, 2.2);
  fillLight.position.set(-5.0, 4.0, 3.5);
  scene.add(fillLight);

  // Electric blue rim light for physical silhouette definition
  const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
  rimLight.position.set(0, 2.5, -4.5);
  scene.add(rimLight);

  // Front camera-facing soft fill (prevents dark front silhouettes)
  const frontLight = new THREE.DirectionalLight(0xf8fafc, 1.8);
  frontLight.position.set(0, 1.5, 5.5);
  scene.add(frontLight);

  // Hemisphere light for natural sky/ground environmental bounce
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 2.0);
  scene.add(hemiLight);

  // Ambient base
  const ambLight = new THREE.AmbientLight(0x64748b, 1.4);
  scene.add(ambLight);

  return { keyLight, fillLight, rimLight, ambLight, hemiLight };
}

/**
 * Safely creates a WebGLRenderer with automatic retry and error handling.
 */
export function safeCreateRenderer(
  parameters: THREE.WebGLRendererParameters = {}
): THREE.WebGLRenderer | null {
  try {
    return new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      ...parameters
    });
  } catch (err) {
    console.warn('WebGL context creation failed on first attempt, trying fallback:', err);
    try {
      return new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'default',
        ...parameters
      });
    } catch {
      return null;
    }
  }
}

/**
 * Forcefully and cleanly destroys a WebGLRenderer, ensuring the browser immediately
 * frees the hardware WebGL context back to the global pool.
 */
export function safeDisposeRenderer(
  renderer: THREE.WebGLRenderer | null,
  container?: HTMLElement | null
) {
  if (!renderer) return;

  try {
    if (container && renderer.domElement && container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }

    renderer.dispose();
    renderer.forceContextLoss();

    const gl = renderer.getContext();
    if (gl) {
      const loseContextExt = gl.getExtension('WEBGL_lose_context');
      if (loseContextExt) {
        loseContextExt.loseContext();
      }
    }
  } catch (e) {
    console.warn('Error during WebGL context disposal:', e);
  }
}

