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
const signalBlue = new THREE.MeshStandardMaterial({ color: 0x718bbd, roughness: 0.5, metalness: 0.16 });
const signalTeal = new THREE.MeshStandardMaterial({ color: 0x4aa6a8, roughness: 0.5, metalness: 0.14, emissive: 0x0d4041, emissiveIntensity: 0.18 });
const carrotOrange = new THREE.MeshPhysicalMaterial({ color: 0xf59b31, roughness: 0.52, clearcoat: 0.28 });
const carrotGreen = new THREE.MeshPhysicalMaterial({ color: 0x67b77f, roughness: 0.56, clearcoat: 0.22 });
const blush = new THREE.MeshStandardMaterial({ color: 0xf5a9b4, roughness: 0.72 });
const textureLoader = new THREE.TextureLoader();
const tarotCardBack = textureLoader.load('./public/assets/projects/tarotcarrot/card-back.png', texture => { texture.colorSpace = THREE.SRGBColorSpace; });
const loversCard = textureLoader.load('./public/assets/projects/tarotcarrot/the-lovers.png', texture => { texture.colorSpace = THREE.SRGBColorSpace; });
const tarotBackMaterial = new THREE.MeshBasicMaterial({ map: tarotCardBack, color: 0xffffff, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
const loversMaterial = new THREE.MeshBasicMaterial({ map: loversCard, color: 0xffffff, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });

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
  const g = group('unova-wealth-constellation');
  const unovaCoreMaterial=new THREE.MeshPhysicalMaterial({color:0x141a24,roughness:.62,metalness:.22,clearcoat:.38,clearcoatRoughness:.45,emissive:0x071319,emissiveIntensity:.3,flatShading:true});
  const core = mesh(new THREE.IcosahedronGeometry(0.78, 2), unovaCoreMaterial, 'unova-financial-core'); g.add(core);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.8, 2), 24), new THREE.LineBasicMaterial({ color: 0x8edbd3, transparent: true, opacity: 0.16 })); wire.name = 'unova-core-lattice'; g.add(wire);
  [[0.3,0.1,0],[1.05,-0.28,0.45],[-0.62,0.66,-0.2]].forEach((r,i) => g.add(mesh(new THREE.TorusGeometry(1.08+i*0.08, 0.025, 9, 90), i===1?signalTeal:gold, `unova-asset-ring-${i+1}`, [0,0,0], r)));
  const colors = [new THREE.MeshStandardMaterial({color:0x58a9ff,emissive:0x173d66,emissiveIntensity:.35}),new THREE.MeshStandardMaterial({color:0x9a7cff,emissive:0x261a68,emissiveIntensity:.35}),terracotta,signalTeal,gold];
  for (let i=0;i<5;i++) { const a=.35+i/5*Math.PI*2; g.add(mesh(new THREE.SphereGeometry(0.115,18,12), colors[i], `unova-asset-${i+1}`, [Math.cos(a)*1.18, Math.sin(a)*.78, Math.sin(a)*.5])); }
  g.userData.core=core;g.userData.wire=wire;
  return g;
}

function buildHlf() {
  const g = group('operations-automation-engine');
  g.add(mesh(new THREE.TorusGeometry(1.2,0.035,9,90),terracotta,'workflow-boundary'));
  g.add(mesh(new THREE.TorusGeometry(0.96,0.012,7,80),gold,'workflow-signal-loop',[0,0,-.05],[.18,.08,0]));
  const big = mesh(gear(0.82, 12, 0.2, bronze), bronze, 'hlf-primary-gear', [-0.35,0.1,-0.1], [0,0,0]); big.geometry.center(); g.add(big);
  const small = mesh(gear(0.56, 10, 0.18, gold), gold, 'hlf-secondary-gear', [0.7,-0.42,0.08]); small.geometry.center(); g.add(small);
  [[-1.02,.66],[.72,.92],[1.05,.18],[-.78,-.9]].forEach(([x,y],i)=>{g.add(mesh(new THREE.TorusGeometry(.12,.018,7,30),i%2?gold:terracotta,`workflow-stage-ring-${i+1}`,[x,y,.26]));g.add(mesh(new THREE.SphereGeometry(.055,14,9),ivory,`workflow-stage-${i+1}`,[x,y,.29]));});
  g.userData.big=big;g.userData.small=small;
  g.rotation.x = -0.16; return g;
}

function buildAscent() {
  const g = group('ascent-pathfinding-compass');
  g.add(mesh(new THREE.TorusGeometry(1.08,0.075,12,82), gold,'ascent-compass-ring'));
  g.add(mesh(new THREE.TorusGeometry(.88,.018,8,72),signalBlue,'ascent-signal-ring'));
  g.add(mesh(new THREE.CylinderGeometry(0.82,0.82,0.12,48), charcoal,'ascent-face',[0,0,-0.08],[Math.PI/2,0,0]));
  const arrow = new THREE.Shape(); arrow.moveTo(0,1.05); arrow.lineTo(-0.25,0.42); arrow.lineTo(-0.09,0.48); arrow.lineTo(-0.09,-0.55); arrow.lineTo(0.09,-0.55); arrow.lineTo(0.09,0.48); arrow.lineTo(0.25,0.42); arrow.closePath();
  const arrowGeo = new THREE.ExtrudeGeometry(arrow,{depth:0.12,bevelEnabled:true,bevelSize:0.035,bevelThickness:0.035,bevelSegments:3}); arrowGeo.center();
  const ascentArrow=mesh(arrowGeo,gold,'ascent-arrow',[-0.2,0.05,0.24],[0,0,-0.18],[0.82,0.82,1.25]);g.add(ascentArrow);
  for(let i=0;i<4;i++) g.add(mesh(new THREE.BoxGeometry(0.34+i*0.08,0.15,0.32),i===3?gold:ivory,`ascent-step-${i+1}`,[0.22+i*0.13,-0.68+i*0.22,0.2],[0,0,0.04]));
  g.userData.arrow=ascentArrow;
  return g;
}

function buildTarot() {
  const g = group('tarotcarrot-cheerful-oracle');
  const cardGroup=group('tarot-custom-card');cardGroup.position.set(-.3,.12,-.42);cardGroup.rotation.z=-.12;g.add(cardGroup);
  const card = mesh(roundedCard(1.22,1.85,0.16,0.11), charcoal, 'tarot-card-frame'); card.geometry.center(); cardGroup.add(card);
  const cardArtwork=mesh(new THREE.PlaneGeometry(1.05,1.58),tarotBackMaterial,'tarot-card-back',[0,0,.17]);cardArtwork.renderOrder=2;cardGroup.add(cardArtwork);
  const mascot=group('tarot-carrot-mascot');mascot.position.set(.34,-.28,.28);g.add(mascot);
  mascot.add(mesh(new THREE.SphereGeometry(.45,32,22),carrotOrange,'carrot-head',[0,.08,0],[0,0,0],[1,.78,.78]));
  mascot.add(mesh(new THREE.ConeGeometry(.4,.9,30),carrotOrange,'carrot-root',[0,-.42,0],[0,0,Math.PI],[1,1,.78]));
  [-.18,0,.19].forEach((x,i)=>mascot.add(mesh(new THREE.CapsuleGeometry(.085,.34,6,12),carrotGreen,`carrot-leaf-${i+1}`,[x,.52,0],[0,0,(i-1)*.38])));
  mascot.add(mesh(new THREE.SphereGeometry(.05,14,9),charcoal,'carrot-left-eye',[-.15,.1,.36],[0,0,0],[.7,1.15,.45]));
  mascot.add(mesh(new THREE.SphereGeometry(.05,14,9),charcoal,'carrot-right-eye',[.15,.1,.36],[0,0,0],[.7,1.15,.45]));
  mascot.add(mesh(new THREE.SphereGeometry(.07,14,9),blush,'carrot-left-cheek',[-.26,-.02,.35],[0,0,0],[1,.55,.34]));
  mascot.add(mesh(new THREE.SphereGeometry(.07,14,9),blush,'carrot-right-cheek',[.26,-.02,.35],[0,0,0],[1,.55,.34]));
  const smile=new THREE.QuadraticBezierCurve3(new THREE.Vector3(-.1,-.01,.4),new THREE.Vector3(0,-.13,.44),new THREE.Vector3(.1,-.01,.4));mascot.add(mesh(new THREE.TubeGeometry(smile,20,.018,6,false),charcoal,'carrot-smile'));
  mascot.add(mesh(new THREE.CapsuleGeometry(.07,.38,5,10),carrotOrange,'carrot-left-arm',[-.46,.0,.0],[0,0,-1.05]));mascot.add(mesh(new THREE.CapsuleGeometry(.07,.38,5,10),carrotOrange,'carrot-right-arm',[.46,.0,.0],[0,0,1.05]));
  const soil=mesh(new THREE.CylinderGeometry(.78,.86,.2,42),bronzeDark,'tarot-soil',[.15,-.82,.55],[0,0,0],[1,.42,.68]);g.add(soil);
  [[-1.0,.76,-.1,.18],[.96,.72,-.08,-.16]].forEach(([x,y,z,r],i)=>{const orbitCard=group(`tarot-orbit-card-${i+1}`);orbitCard.position.set(x,y,z);orbitCard.rotation.z=r;const frame=mesh(roundedCard(.45,.68,.06,.045),charcoal,`tarot-orbit-frame-${i+1}`);frame.geometry.center();orbitCard.add(frame);const orbitArtwork=mesh(new THREE.PlaneGeometry(.38,.58),i?loversMaterial:tarotBackMaterial,`tarot-orbit-art-${i+1}`,[0,0,.13]);orbitArtwork.renderOrder=2;orbitCard.add(orbitArtwork);g.add(orbitCard);});
  g.userData.mascot=mascot;
  return g;
}

function buildTravel() {
  const g = group('unclegowhere-agentic-atlas');
  const atlas = new THREE.MeshPhysicalMaterial({color:0x173642,roughness:.56,metalness:.22,clearcoat:.28});
  const globe=mesh(new THREE.IcosahedronGeometry(.92,3),atlas,'travel-world');g.add(globe);
  const wire=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(.94,2),24),new THREE.LineBasicMaterial({color:0x4aa6a8,transparent:true,opacity:.18}));wire.name='agent-network-grid';g.add(wire);
  g.add(mesh(new THREE.TorusGeometry(1.07,.025,8,90),gold,'global-route-orbit',[0,0,0],[.92,.18,.2]));
  g.add(mesh(new THREE.TorusGeometry(.99,.012,7,86),signalTeal,'equator-signal',[0,0,0],[Math.PI/2,0,0]));
  const positions=[[-1.12,.68,.28],[1.08,.62,.34],[1.12,-.64,.2],[-1.0,-.72,.4]];
  positions.forEach((position,index)=>{g.add(mesh(new THREE.TorusGeometry(.12,.018,7,34),index%2?gold:signalTeal,`travel-agent-ring-${index+1}`,position));g.add(mesh(new THREE.SphereGeometry(.06,15,10),ivory,`travel-agent-${index+1}`,[position[0],position[1],position[2]+.025]));const start=new THREE.Vector3(...position),end=new THREE.Vector3(index%2?.32:-.3,index<2?.3:-.28,.55),middle=start.clone().lerp(end,.5);middle.z+=.2;g.add(mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(start,middle,end),34,.014,6,false),index%2?gold:signalTeal,`agent-message-${index+1}`));});
  const route=new THREE.QuadraticBezierCurve3(new THREE.Vector3(-.68,-.08,.72),new THREE.Vector3(.05,1.15,1.0),new THREE.Vector3(.78,.08,.72));
  const plane = new THREE.Shape(); plane.moveTo(.4,0);plane.lineTo(-.02,.1);plane.lineTo(-.2,.31);plane.lineTo(-.34,.28);plane.lineTo(-.23,.05);plane.lineTo(-.42,-.03);plane.lineTo(-.4,-.12);plane.lineTo(-.19,-.08);plane.lineTo(-.27,-.27);plane.lineTo(-.15,-.3);plane.lineTo(.01,-.09);plane.closePath();
  const planeGeo=new THREE.ExtrudeGeometry(plane,{depth:.07,bevelEnabled:true,bevelSize:.018,bevelThickness:.016,bevelSegments:2});planeGeo.center();const flightPlane=mesh(planeGeo,ivory,'travel-plane',route.getPoint(.3).toArray(),[0,0,0],[.52,.52,.64]);g.add(flightPlane);
  g.userData.flightPlane=flightPlane;g.userData.flightRoute=route;g.userData.globe=globe;g.userData.wire=wire;
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
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const verticalHalfAngle = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const exhibitRadius = 1.48;
  const verticalFit = exhibitRadius / Math.tan(verticalHalfAngle);
  const horizontalFit = exhibitRadius / (Math.tan(verticalHalfAngle) * camera.aspect);
  camera.position.z = Math.max(5.85, verticalFit, horizontalFit);
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(shell.querySelector('.exhibit-plaque__object'));

const clock = new THREE.Clock();
function frame() {
  const t = clock.getElapsedTime();
  root.rotation.y += (targetYaw - root.rotation.y) * 0.045;
  root.rotation.x += (targetPitch - root.rotation.x) * 0.045;
  root.position.y = Math.sin(t * 1.35) * 0.06;
  const unovaModel=models[0];
  if(unovaModel.userData.core){unovaModel.userData.core.rotation.y=t*.08;unovaModel.userData.wire.rotation.y=-t*.05;}
  const automationModel=models[1];
  if(automationModel.userData.big){automationModel.userData.big.rotation.z=t*.22;automationModel.userData.small.rotation.z=-t*.34;}
  const ascentModel=models[2];
  if(ascentModel.userData.arrow)ascentModel.userData.arrow.rotation.z=-.18+Math.sin(t*.65)*.055;
  const tarotModel=models[3];
  if(tarotModel.userData.mascot)tarotModel.userData.mascot.position.y=-.28+Math.sin(t*1.1)*.035;
  const travelModel=models[4];
  if(travelModel.userData.flightPlane&&travelModel.userData.flightRoute){
    const u=(t*0.09)%1,point=travelModel.userData.flightRoute.getPoint(u),tangent=travelModel.userData.flightRoute.getTangent(u);
    travelModel.userData.flightPlane.position.copy(point);
    travelModel.userData.flightPlane.rotation.z=Math.atan2(tangent.y,tangent.x);
    travelModel.userData.globe.rotation.y=t*.09;
    travelModel.userData.wire.rotation.y=t*.09;
  }
  if (visible) renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
resize(); frame();
window.dispatchEvent(new Event('scroll'));
