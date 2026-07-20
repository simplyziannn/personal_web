import * as THREE from 'three';

// Ownership marker required by the installed Object Sculptor workflow.
export const SCULPT_MODULE_ID = 'featured-artifacts';

const museum = document.getElementById('world');
if (!museum) throw new Error('Featured artifact layer requires #world');

const shell = document.createElement('aside');
shell.className = 'exhibit-plaque';
shell.setAttribute('aria-live', 'polite');
shell.innerHTML = `
  <span class="exhibit-plaque__edge" aria-hidden="true"></span>
  <div class="exhibit-plaque__face">
    <div class="exhibit-plaque__object"><canvas aria-hidden="true"></canvas><span class="exhibit-plaque__halo"></span></div>
    <div class="exhibit-plaque__copy">
      <span class="exhibit-plaque__count"></span>
      <span class="exhibit-plaque__eyebrow">FEATURED EXHIBIT</span>
      <h2></h2>
      <p class="exhibit-plaque__impact"></p>
      <p class="exhibit-plaque__description"></p>
      <a class="exhibit-plaque__link">View project <span aria-hidden="true">↗</span></a>
    </div>
  </div>`;
museum.appendChild(shell);

const canvas = shell.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
camera.position.set(0, 0.15, 6.4);
scene.add(new THREE.HemisphereLight(0xfff1d8, 0x44372f, 2.2));
const key = new THREE.DirectionalLight(0xffc77a, 5.4); key.position.set(4, 5, 6); scene.add(key);
const rim = new THREE.DirectionalLight(0x9db7c8, 2.2); rim.position.set(-5, 2, -3); scene.add(rim);

const bronze = new THREE.MeshStandardMaterial({ color: 0x9b6240, roughness: 0.6, metalness: 0.34 });
const bronzeDark = new THREE.MeshStandardMaterial({ color: 0x624538, roughness: 0.68, metalness: 0.24 });
const ivory = new THREE.MeshStandardMaterial({ color: 0xe9d8bd, roughness: 0.78, metalness: 0.02 });
const charcoal = new THREE.MeshStandardMaterial({ color: 0x3f383c, roughness: 0.72, metalness: 0.04 });
const terracotta = new THREE.MeshStandardMaterial({ color: 0xc76f3c, roughness: 0.68, metalness: 0.03 });
const jade = new THREE.MeshStandardMaterial({ color: 0x78946c, roughness: 0.62, metalness: 0.08 });
const gold = new THREE.MeshStandardMaterial({ color: 0xc9964f, roughness: 0.52, metalness: 0.45, emissive: 0x2a1303, emissiveIntensity: 0.08 });

const root = new THREE.Group();
root.name = 'featured-artifacts-root';
scene.add(root);

function mesh(geometry, material, name, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const node = new THREE.Mesh(geometry, material);
  node.name = name;
  node.position.set(...position); node.rotation.set(...rotation); node.scale.set(...scale);
  node.castShadow = node.receiveShadow = true;
  return node;
}

function group(name) { const g = new THREE.Group(); g.name = name; return g; }

function gear(radius, teeth, depth, material) {
  const shape = new THREE.Shape();
  const steps = teeth * 2;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const r = i % 2 ? radius * 0.83 : radius;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    i ? shape.lineTo(x, y) : shape.moveTo(x, y);
  }
  const hole = new THREE.Path(); hole.absarc(0, 0, radius * 0.24, 0, Math.PI * 2, true); shape.holes.push(hole);
  return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: 0.045, bevelThickness: 0.045, bevelSegments: 3, curveSegments: 4 });
}

function roundedCard(w, h, r, depth) {
  const s = new THREE.Shape();
  s.moveTo(-w/2+r, -h/2); s.lineTo(w/2-r, -h/2); s.quadraticCurveTo(w/2, -h/2, w/2, -h/2+r);
  s.lineTo(w/2, h/2-r); s.quadraticCurveTo(w/2, h/2, w/2-r, h/2); s.lineTo(-w/2+r, h/2);
  s.quadraticCurveTo(-w/2, h/2, -w/2, h/2-r); s.lineTo(-w/2, -h/2+r); s.quadraticCurveTo(-w/2, -h/2, -w/2+r, -h/2);
  return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: 0.07, bevelThickness: 0.06, bevelSegments: 4, curveSegments: 8 });
}

function buildUnova() {
  const g = group('unova-orb');
  g.add(mesh(new THREE.SphereGeometry(0.78, 40, 28), charcoal, 'unova-core'));
  [[0,0,0],[Math.PI/2,0.35,0],[0.7,Math.PI/2,0.2]].forEach((r,i) => g.add(mesh(new THREE.TorusGeometry(1.08-i*0.08, 0.072, 12, 72), i===0?gold:bronze, `unova-asset-ring-${i+1}`, [0,0,0], r)));
  const colors = [terracotta, jade, ivory, gold, bronze];
  for (let i=0;i<5;i++) { const a=i/5*Math.PI*2; g.add(mesh(new THREE.SphereGeometry(0.13,18,12), colors[i], `unova-asset-${i+1}`, [Math.cos(a)*1.06, Math.sin(a)*0.42, Math.sin(a)*0.72])); }
  return g;
}

function buildHlf() {
  const g = group('hlf-gears');
  const big = mesh(gear(0.82, 12, 0.2, bronze), bronze, 'hlf-primary-gear', [-0.35,0.1,-0.1], [0,0,0]); big.geometry.center(); g.add(big);
  const small = mesh(gear(0.56, 10, 0.18, gold), gold, 'hlf-secondary-gear', [0.7,-0.42,0.08]); small.geometry.center(); g.add(small);
  g.rotation.x = -0.16; return g;
}

function buildAscent() {
  const g = group('ascent-compass');
  g.add(mesh(new THREE.TorusGeometry(0.98,0.09,12,72), bronze,'ascent-compass-ring'));
  g.add(mesh(new THREE.CylinderGeometry(0.72,0.72,0.12,48), ivory,'ascent-face',[0,0,-0.03],[Math.PI/2,0,0]));
  const arrow = new THREE.Shape(); arrow.moveTo(0,1.05); arrow.lineTo(-0.25,0.42); arrow.lineTo(-0.09,0.48); arrow.lineTo(-0.09,-0.55); arrow.lineTo(0.09,-0.55); arrow.lineTo(0.09,0.48); arrow.lineTo(0.25,0.42); arrow.closePath();
  const arrowGeo = new THREE.ExtrudeGeometry(arrow,{depth:0.12,bevelEnabled:true,bevelSize:0.035,bevelThickness:0.035,bevelSegments:3}); arrowGeo.center();
  g.add(mesh(arrowGeo,gold,'ascent-arrow',[-0.22,0.05,0.24],[0,0,-0.18],[0.9,0.9,1.25]));
  for(let i=0;i<4;i++) g.add(mesh(new THREE.BoxGeometry(0.34+i*0.08,0.15,0.32),terracotta,`ascent-step-${i+1}`,[0.25+i*0.13,-0.7+i*0.22,0.2],[0,0,0.04]));
  return g;
}

function buildTarot() {
  const g = group('tarotcarrot-card');
  const card = mesh(roundedCard(1.35,2.05,0.18,0.14), charcoal, 'tarot-card'); card.geometry.center(); g.add(card);
  const inner = mesh(roundedCard(1.08,1.72,0.14,0.055), bronzeDark, 'tarot-raised-inner-rim', [0,0,0.16]); inner.geometry.center(); g.add(inner);
  g.add(mesh(new THREE.TorusGeometry(0.44,0.045,10,48),gold,'tarot-sun-ring',[0,0.28,0.24]));
  for(let i=0;i<8;i++) { const ray=mesh(new THREE.CapsuleGeometry(0.035,0.24,4,8),gold,`tarot-ray-${i+1}`,[Math.cos(i*Math.PI/4)*0.67,0.28+Math.sin(i*Math.PI/4)*0.67,0.22],[0,0,-i*Math.PI/4]); g.add(ray); }
  g.add(mesh(new THREE.ConeGeometry(0.25,0.72,24),terracotta,'tarot-carrot',[0,-0.48,0.28],[0,0,Math.PI]));
  [-0.18,0,0.18].forEach((x,i)=>g.add(mesh(new THREE.CapsuleGeometry(0.055,0.32,5,10),jade,`tarot-leaf-${i+1}`,[x,-0.03,0.27],[0,0,(i-1)*0.42])));
  return g;
}

function buildTravel() {
  const g = group('unclegowhere-country-flight');
  const atlas = new THREE.MeshStandardMaterial({color:0x233f49,roughness:0.76,metalness:0.09});
  const routeGlow = new THREE.MeshStandardMaterial({color:0xe0a34d,emissive:0x6e3308,emissiveIntensity:0.5,roughness:0.46,metalness:0.28});
  g.add(mesh(new THREE.CylinderGeometry(1.08,1.08,0.16,64),atlas,'travel-map-medallion',[0,0,-0.04],[Math.PI/2,0,0]));
  g.add(mesh(new THREE.TorusGeometry(1.08,0.035,10,96),bronze,'travel-map-rim',[0,0,0.05]));
  g.add(mesh(new THREE.TorusGeometry(0.79,0.012,7,72),gold,'travel-map-latitude',[0,0,0.06],[0,0,0],[1,0.42,1]));

  const originCountry = new THREE.Shape();
  originCountry.moveTo(-0.42,0.18);originCountry.lineTo(-0.18,0.36);originCountry.lineTo(0.13,0.31);originCountry.lineTo(0.36,0.1);originCountry.lineTo(0.28,-0.2);originCountry.lineTo(0.02,-0.36);originCountry.lineTo(-0.29,-0.27);originCountry.lineTo(-0.46,-0.03);originCountry.closePath();
  const originGeo=new THREE.ExtrudeGeometry(originCountry,{depth:0.1,bevelEnabled:true,bevelSize:0.035,bevelThickness:0.028,bevelSegments:3});originGeo.center();
  g.add(mesh(originGeo,jade,'travel-origin-country',[-0.49,-0.16,0.17],[0,0,-0.14],[0.92,0.92,1]));

  const destinationCountry = new THREE.Shape();
  destinationCountry.moveTo(-0.38,0.27);destinationCountry.lineTo(-0.09,0.38);destinationCountry.lineTo(0.18,0.27);destinationCountry.lineTo(0.43,0.05);destinationCountry.lineTo(0.25,-0.13);destinationCountry.lineTo(0.34,-0.37);destinationCountry.lineTo(0.02,-0.31);destinationCountry.lineTo(-0.21,-0.4);destinationCountry.lineTo(-0.43,-0.14);destinationCountry.closePath();
  const destinationGeo=new THREE.ExtrudeGeometry(destinationCountry,{depth:0.1,bevelEnabled:true,bevelSize:0.035,bevelThickness:0.028,bevelSegments:3});destinationGeo.center();
  g.add(mesh(destinationGeo,terracotta,'travel-destination-country',[0.52,-0.09,0.18],[0,0,0.18],[0.82,0.82,1]));

  const route = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.65,-0.03,0.34),new THREE.Vector3(-0.02,1.05,0.48),new THREE.Vector3(0.66,0.02,0.34));
  g.add(mesh(new THREE.TubeGeometry(route,64,0.025,8,false),routeGlow,'travel-flight-route'));
  for(let i=1;i<8;i++) g.add(mesh(new THREE.SphereGeometry(0.032,12,8),gold,`travel-route-marker-${i}`,route.getPoint(i/8).toArray()));
  const originPoint=route.getPoint(0),destinationPoint=route.getPoint(1);
  [originPoint,destinationPoint].forEach((point,i)=>{
    g.add(mesh(new THREE.TorusGeometry(0.14,0.018,8,40),i?terracotta:jade,`travel-${i?'arrival':'departure'}-beacon`,[point.x,point.y,0.32]));
    g.add(mesh(new THREE.SphereGeometry(0.07,18,12),ivory,`travel-${i?'arrival':'departure'}-pin`,[point.x,point.y,0.36]));
  });

  const plane = new THREE.Shape(); plane.moveTo(0.46,0); plane.lineTo(0.02,0.11); plane.lineTo(-0.18,0.42); plane.lineTo(-0.34,0.38); plane.lineTo(-0.24,0.08); plane.lineTo(-0.48,0.01); plane.lineTo(-0.48,-0.11); plane.lineTo(-0.24,-0.08); plane.lineTo(-0.34,-0.3); plane.lineTo(-0.2,-0.34); plane.lineTo(0.01,-0.1); plane.closePath();
  const planeGeo=new THREE.ExtrudeGeometry(plane,{depth:0.08,bevelEnabled:true,bevelSize:0.025,bevelThickness:0.02,bevelSegments:2}); planeGeo.center();
  const flightPlane=mesh(planeGeo,ivory,'travel-plane',route.getPoint(0.3).toArray(),[0,0,0],[0.55,0.55,0.72]);g.add(flightPlane);
  g.userData.flightPlane=flightPlane;g.userData.flightRoute=route;
  g.rotation.x=-0.06;
  return g;
}

const models = [buildUnova(), buildHlf(), buildAscent(), buildTarot(), buildTravel()];
models.forEach((model, i) => { model.visible = i === 0; root.add(model); });

let active = 0, targetYaw = 0.38, targetPitch = -0.06, visible = false;
function setExhibit(items, index) {
  if (!items?.length) return;
  index = Math.max(0, Math.min(items.length - 1, index));
  if (index !== active) { models[active].visible = false; active = index; models[active].visible = true; root.rotation.y = -0.45; }
  const item = items[index];
  shell.querySelector('.exhibit-plaque__count').textContent = `${String(index + 1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
  shell.querySelector('h2').textContent = item.name;
  shell.querySelector('.exhibit-plaque__impact').textContent = item.impact;
  shell.querySelector('.exhibit-plaque__description').textContent = item.description;
  const link = shell.querySelector('.exhibit-plaque__link'); link.href = item.href; link.setAttribute('aria-label', `View ${item.name} project`);
}

museum.addEventListener('scrollworld:progress', event => {
  const { section, progress } = event.detail;
  const items = section?.featuredExhibits;
  visible = !!items?.length && progress > 0.035 && progress < 0.985;
  shell.classList.toggle('is-visible', visible);
  if (visible) setExhibit(items, Math.min(items.length - 1, Math.floor(progress * items.length)));
});

shell.addEventListener('pointermove', e => {
  const r = shell.getBoundingClientRect();
  targetYaw = ((e.clientX-r.left)/r.width-.5)*0.85;
  targetPitch = ((e.clientY-r.top)/r.height-.5)*0.35;
});
shell.addEventListener('pointerleave', () => { targetYaw = 0.38; targetPitch = -0.06; });

function resize() {
  const box = shell.querySelector('.exhibit-plaque__object').getBoundingClientRect();
  const w = Math.max(1, Math.round(box.width)), h = Math.max(1, Math.round(box.height));
  renderer.setSize(w, h, false); camera.aspect = w/h; camera.position.z = camera.aspect < 0.7 ? 9.4 : 5.85; camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(shell.querySelector('.exhibit-plaque__object'));

const clock = new THREE.Clock();
function frame() {
  const t = clock.getElapsedTime();
  root.rotation.y += (targetYaw - root.rotation.y) * 0.045;
  root.rotation.x += (targetPitch - root.rotation.x) * 0.045;
  root.position.y = Math.sin(t * 1.35) * 0.06;
  const travelModel=models[4];
  if(travelModel.userData.flightPlane&&travelModel.userData.flightRoute){
    const u=(t*0.09)%1,point=travelModel.userData.flightRoute.getPoint(u),tangent=travelModel.userData.flightRoute.getTangent(u);
    travelModel.userData.flightPlane.position.copy(point);
    travelModel.userData.flightPlane.rotation.z=Math.atan2(tangent.y,tangent.x);
  }
  if (visible) renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
resize(); frame();
window.dispatchEvent(new Event('scroll'));
