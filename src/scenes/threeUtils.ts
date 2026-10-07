import * as THREE from 'three';

/**
 * Creates a soft radial contact shadow texture for grounding physical 3D models.
 * Avoids floating-object syndrome with zero external asset dependencies.
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  gradient.addColorStop(0.25, 'rgba(0, 0, 0, 0.60)');
  gradient.addColorStop(0.55, 'rgba(0, 0, 0, 0.25)');
  gradient.addColorStop(0.85, 'rgba(0, 0, 0, 0.06)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a ground plane with realistic contact shadow and optional subtle studio grid.
 */
export function createStudioGround(
  scene: THREE.Scene,
  width: number = 6,
  height: number = 6,
  yPos: number = 0,
  shadowRadius: number = 2.5
): { ground: THREE.Mesh; shadowPlane: THREE.Mesh; grid?: THREE.GridHelper } {
  // 1. Soft Contact Shadow Plane
  const shadowGeo = new THREE.PlaneGeometry(shadowRadius * 2, shadowRadius * 2);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowTex = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.85,
    depthWrite: false
  });
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.position.y = yPos + 0.002;
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
  const grid = new THREE.GridHelper(width, 16, 0x1e2433, 0x0f131c);
  grid.position.y = yPos + 0.001;
  scene.add(grid);

  return { ground, shadowPlane, grid };
}

/**
 * Standard Realistic Studio Lighting Rig
 */
export function setupStudioLighting(scene: THREE.Scene): {
  keyLight: THREE.DirectionalLight;
  fillLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  ambLight: THREE.AmbientLight;
} {
  // Primary soft key light
  const keyLight = new THREE.DirectionalLight(0xfff6ea, 2.2);
  keyLight.position.set(4, 7, 5);
  scene.add(keyLight);

  // Cool subtle fill light
  const fillLight = new THREE.DirectionalLight(0x90b4ce, 1.0);
  fillLight.position.set(-5, 3, -3);
  scene.add(fillLight);

  // Precision rim light (electric blue/cyan accent)
  const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
  rimLight.position.set(0, -2, -5);
  scene.add(rimLight);

  // Ambient fill
  const ambLight = new THREE.AmbientLight(0x0e111a, 1.2);
  scene.add(ambLight);

  return { keyLight, fillLight, rimLight, ambLight };
}
