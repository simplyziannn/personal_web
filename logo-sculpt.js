import * as THREE from './node_modules/three/build/three.module.min.js';

export const SCULPT_MODULE_ID = 'roman-portal-seal';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const targets = [...document.querySelectorAll('.static-brand i, .sw-brand__mark')];
const bronze = new THREE.MeshStandardMaterial({ color: 0x8b5426, roughness: 0.67, metalness: 0.38 });
const darkBronze = new THREE.MeshStandardMaterial({ color: 0x332a2b, roughness: 0.78, metalness: 0.2 });
const sandstone = new THREE.MeshStandardMaterial({ color: 0xf3d8aa, roughness: 0.88, metalness: 0.02 });
const gold = new THREE.MeshStandardMaterial({ color: 0xd79738, roughness: 0.47, metalness: 0.55 });
const glow = new THREE.MeshStandardMaterial({ color: 0xffd47a, emissive: 0xe08322, emissiveIntensity: 1.25, roughness: 0.38 });

function roundedBox(width, height, depth, radius = 0.06) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 2 });
}

function buildSeal() {
  const seal = new THREE.Group();
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 0.98, 0.2, 32), bronze);
  coin.rotation.x = Math.PI / 2;
  coin.position.z = -0.08;
  seal.add(coin);

  const inset = new THREE.Mesh(new THREE.CylinderGeometry(0.79, 0.79, 0.235, 32), darkBronze);
  inset.rotation.x = Math.PI / 2;
  inset.position.z = 0.01;
  seal.add(inset);

  const archShape = new THREE.Shape();
  archShape.moveTo(-0.49, -0.42);
  archShape.lineTo(-0.49, 0.1);
  archShape.absarc(0, 0.1, 0.49, Math.PI, 0, false);
  archShape.lineTo(0.49, -0.42);
  archShape.lineTo(0.31, -0.42);
  archShape.lineTo(0.31, 0.08);
  archShape.absarc(0, 0.08, 0.31, 0, Math.PI, true);
  archShape.lineTo(-0.31, -0.42);
  archShape.closePath();
  const arch = new THREE.Mesh(new THREE.ExtrudeGeometry(archShape, {
    depth: 0.13, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 3, curveSegments: 18
  }), sandstone);
  arch.position.z = 0.13;
  seal.add(arch);

  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 14), glow);
  sun.position.set(0, 0.23, 0.35);
  seal.add(sun);

  [0.68, 0.51, 0.34].forEach((width, index) => {
    const step = new THREE.Mesh(roundedBox(width, 0.095, 0.1, 0.045), index === 0 ? bronze : gold);
    step.position.set(0, -0.52 + index * 0.105, 0.19 + index * 0.035);
    seal.add(step);
  });
  seal.rotation.set(-0.08, -0.12, 0);
  return seal;
}

function mount(target) {
  target.classList.add('logo-sculpt');
  target.setAttribute('aria-hidden', 'true');
  const canvas = document.createElement('canvas');
  target.replaceChildren(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  target.classList.add('logo-sculpt--rendered');
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1.28, 1.28, 1.28, -1.28, 0.1, 12);
  camera.position.set(0, 0, 5);
  scene.add(new THREE.HemisphereLight(0xfff1d6, 0x2f2630, 2.15));
  const key = new THREE.DirectionalLight(0xffc36d, 4.2);
  key.position.set(-2.5, 3, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8aa7ce, 1.3);
  rim.position.set(3, -1, 2);
  scene.add(rim);
  const seal = buildSeal();
  scene.add(seal);

  let hover = false;
  target.closest('a')?.addEventListener('pointerenter', () => { hover = true; });
  target.closest('a')?.addEventListener('pointerleave', () => { hover = false; });
  const resize = () => {
    const rect = target.getBoundingClientRect();
    renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
  };
  resize();
  new ResizeObserver(resize).observe(target);

  const render = time => {
    const targetY = hover && !reduceMotion ? 0.08 : -0.12;
    seal.rotation.y += (targetY - seal.rotation.y) * 0.08;
    if (!reduceMotion) seal.position.y = Math.sin(time * 0.0018) * 0.025;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}

targets.forEach(mount);
