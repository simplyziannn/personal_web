import * as THREE from './node_modules/three/build/three.module.min.js';

export const SCULPT_MODULE_ID = 'unova-wealth-constellation';

const canvas = document.querySelector('.unova-globe');
if (canvas) {
  const stage = canvas.closest('.artifact-stage--unova');
  const readout = stage.querySelector('.unova-globe__readout');
  const controls = [...stage.querySelectorAll('[data-asset]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(31, 1, .1, 100);
  camera.position.set(0, .05, 8.2);
  scene.add(new THREE.HemisphereLight(0xfaf4e8, 0x121722, 2.05));
  const key = new THREE.DirectionalLight(0xe6f8ff, 3.8); key.position.set(-4,5,6); scene.add(key);
  const tealRim = new THREE.DirectionalLight(0x3ee3c9, 2.4); tealRim.position.set(5,1,-3); scene.add(tealRim);
  const amberFill = new THREE.PointLight(0xf0a342, 1.8, 10); amberFill.position.set(-3,-2,4); scene.add(amberFill);

  const rig = new THREE.Group(); rig.name='unova-wealth-constellation'; rig.rotation.set(-.12,-.28,.04); scene.add(rig);
  const coreMaterial = new THREE.MeshPhysicalMaterial({color:0x141a24,roughness:.62,metalness:.22,clearcoat:.42,clearcoatRoughness:.45,emissive:0x071319,emissiveIntensity:.34,flatShading:true});
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.18,3),coreMaterial); core.name='financial-wellness-core'; rig.add(core);
  const coreWire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.205,2),24),new THREE.LineBasicMaterial({color:0x8edbd3,transparent:true,opacity:.08})); coreWire.name='core-signal-lattice'; rig.add(coreWire);
  const innerHalo = new THREE.Mesh(new THREE.TorusGeometry(1.42,.014,8,160),new THREE.MeshBasicMaterial({color:0x7fd6d1,transparent:true,opacity:.2})); innerHalo.rotation.set(1.1,.3,.5); rig.add(innerHalo);

  function glowTexture() {
    const c=document.createElement('canvas'); c.width=c.height=128; const x=c.getContext('2d');
    const g=x.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.13,'rgba(255,255,255,.95)');g.addColorStop(.42,'rgba(255,255,255,.17)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
  }
  const glowMap=glowTexture();
  const assets=[
    {id:'equities',name:'Equities',value:'42%',detail:'Growth engine · global exposure',color:'#58a9ff',radius:1.78,tilt:[.28,.16,.04],speed:.16,phase:.1},
    {id:'bonds',name:'Bonds',value:'24%',detail:'Stability layer · income focus',color:'#9a7cff',radius:1.98,tilt:[1.08,-.3,.44],speed:-.12,phase:1.7},
    {id:'real-assets',name:'Real assets',value:'14%',detail:'Tangible value · inflation hedge',color:'#d27a58',radius:2.12,tilt:[-.62,.64,-.2],speed:.1,phase:3.1},
    {id:'digital',name:'Digital',value:'8%',detail:'Emerging network · higher volatility',color:'#35d6b7',radius:2.28,tilt:[.74,.82,1.02],speed:-.14,phase:4.4},
    {id:'commodities',name:'Commodities',value:'12%',detail:'Diversifier · cyclical protection',color:'#f5b51b',radius:2.42,tilt:[1.22,.18,-.72],speed:.09,phase:5.3}
  ];
  const nodeMeshes=[];
  for(const asset of assets){
    const orbit=new THREE.Group();orbit.name=`${asset.id}-orbit`;orbit.rotation.set(...asset.tilt);rig.add(orbit);asset.orbit=orbit;
    const ring=new THREE.Mesh(new THREE.TorusGeometry(asset.radius,.009,7,180),new THREE.MeshBasicMaterial({color:asset.color,transparent:true,opacity:.2,depthWrite:false}));ring.name=`${asset.id}-path`;orbit.add(ring);
    const node=new THREE.Group();node.name=`${asset.id}-node`;orbit.add(node);asset.node=node;
    const sphere=new THREE.Mesh(new THREE.SphereGeometry(.105,24,18),new THREE.MeshPhysicalMaterial({color:0xffffff,emissive:new THREE.Color(asset.color),emissiveIntensity:1.7,roughness:.2,metalness:.05}));sphere.userData.assetId=asset.id;sphere.name=`${asset.id}-selectable`;node.add(sphere);asset.mesh=sphere;nodeMeshes.push(sphere);
    const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowMap,color:asset.color,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false}));glow.scale.set(.58,.58,1);node.add(glow);
    for(const [radius,opacity] of [[.2,.45],[.31,.22]]){const pulse=new THREE.Mesh(new THREE.RingGeometry(radius-.008,radius,48),new THREE.MeshBasicMaterial({color:asset.color,transparent:true,opacity,side:THREE.DoubleSide,depthWrite:false}));pulse.name=`${asset.id}-signal-ring`;node.add(pulse)}
    const tetherCurve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(.1,0,0),new THREE.Vector3(asset.radius*.48,.22,0),new THREE.Vector3(asset.radius-.13,0,0));
    const tether=new THREE.Mesh(new THREE.TubeGeometry(tetherCurve,36,.006,5,false),new THREE.MeshBasicMaterial({color:asset.color,transparent:true,opacity:.13}));orbit.add(tether);
  }

  const dustPositions=[];for(let i=0;i<260;i++){const a=i*2.399,r=1.35+(i%31)/31*1.42,z=Math.sin(i*1.71)*.75;dustPositions.push(Math.cos(a)*r,Math.sin(a)*r,z)}
  const dustGeometry=new THREE.BufferGeometry();dustGeometry.setAttribute('position',new THREE.Float32BufferAttribute(dustPositions,3));
  rig.add(new THREE.Points(dustGeometry,new THREE.PointsMaterial({color:0x99b7c5,size:.018,transparent:true,opacity:.38,sizeAttenuation:true})));
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(1.4,64),new THREE.MeshBasicMaterial({color:0x4b3d34,transparent:true,opacity:.09,depthWrite:false}));shadow.scale.y=.2;shadow.position.set(0,-2.62,-.4);scene.add(shadow);

  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(2,2);
  let selected='equities',hovered=null,dragging=false,moved=false,lastX=0,lastY=0,targetYaw=-.28,targetPitch=-.12;
  function assetById(id){return assets.find(asset=>asset.id===id)}
  function selectAsset(id,lock=true){
    const asset=assetById(id);if(!asset)return;if(lock){selected=id;hovered=null}
    readout.style.setProperty('--readout-color',asset.color);readout.querySelector('strong').textContent=asset.name;readout.querySelector('b').textContent=asset.value;readout.querySelector('p').textContent=asset.detail;
    controls.forEach(button=>button.classList.toggle('is-active',button.dataset.asset===id));
  }
  function pointFromEvent(event){const rect=canvas.getBoundingClientRect();pointer.x=((event.clientX-rect.left)/rect.width)*2-1;pointer.y=-((event.clientY-rect.top)/rect.height)*2+1}
  function hitTest(){raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(nodeMeshes,false)[0]?.object?.userData?.assetId||null}
  function updateHover(event){pointFromEvent(event);const id=hitTest();if(id!==hovered){hovered=id;canvas.style.cursor=id?'pointer':'grab';if(id)selectAsset(id,false)}}
  controls.forEach(button=>{button.addEventListener('mouseenter',()=>selectAsset(button.dataset.asset,false));button.addEventListener('mouseleave',()=>selectAsset(selected,true));button.addEventListener('focus',()=>selectAsset(button.dataset.asset,false));button.addEventListener('blur',()=>selectAsset(selected,true));button.addEventListener('click',()=>selectAsset(button.dataset.asset,true))});
  canvas.addEventListener('pointerdown',event=>{dragging=true;moved=false;lastX=event.clientX;lastY=event.clientY;canvas.setPointerCapture(event.pointerId);canvas.style.cursor='grabbing'});
  canvas.addEventListener('pointermove',event=>{if(!dragging){updateHover(event);return}const dx=event.clientX-lastX,dy=event.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;targetYaw+=dx*.008;targetPitch=THREE.MathUtils.clamp(targetPitch+dy*.006,-.8,.55);lastX=event.clientX;lastY=event.clientY});
  canvas.addEventListener('pointerup',event=>{dragging=false;pointFromEvent(event);const id=hitTest();if(!moved&&id)selectAsset(id,true);canvas.style.cursor=id?'pointer':'grab'});
  canvas.addEventListener('pointerleave',()=>{if(!dragging){hovered=null;canvas.style.cursor='grab';selectAsset(selected,true)}});
  canvas.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const index=assets.findIndex(asset=>asset.id===selected),step=event.key==='ArrowRight'?1:-1;selectAsset(assets[(index+step+assets.length)%assets.length].id,true)});

  function resize(){const box=canvas.getBoundingClientRect(),w=Math.max(1,Math.round(box.width)),h=Math.max(1,Math.round(box.height));renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=camera.aspect<.78?9.3:8.45;camera.updateProjectionMatrix()}
  new ResizeObserver(resize).observe(canvas);resize();selectAsset(selected,true);
  const clock=new THREE.Clock();
  function frame(){
    const t=clock.getElapsedTime();rig.rotation.y+=(targetYaw-rig.rotation.y)*.055;rig.rotation.x+=(targetPitch-rig.rotation.x)*.055;
    assets.forEach((asset,index)=>{const angle=asset.phase+(reducedMotion?0:t*asset.speed);asset.node.position.set(Math.cos(angle)*asset.radius,Math.sin(angle)*asset.radius,0);asset.node.rotation.z=-angle;const active=(hovered||selected)===asset.id,scale=active?1.28:1;asset.node.scale.lerp(new THREE.Vector3(scale,scale,scale),.12);const pulse=1+Math.sin(t*2.2+index)*.1;asset.node.children.slice(2).forEach(child=>child.scale.setScalar(pulse))});
    if(!reducedMotion){core.rotation.y=t*.08;coreWire.rotation.y=-t*.05;rig.position.y=Math.sin(t*.7)*.025}renderer.render(scene,camera);requestAnimationFrame(frame)
  }
  frame();
}

const featuredStage = document.querySelector('[data-project-artifact]');
if (featuredStage) {
  const projectKey = featuredStage.dataset.projectArtifact;
  const sculptCanvas = featuredStage.querySelector('.project-sculpt');
  const readout = featuredStage.querySelector('.project-sculpt__readout');
  const signalButtons = [...featuredStage.querySelectorAll('[data-signal]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas: sculptCanvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 100);
  camera.position.set(0, .05, 8.25);
  scene.add(new THREE.HemisphereLight(0xfff6e8, 0x111827, 2.4));
  const keyLight = new THREE.DirectionalLight(0xffe2b6, 4.4); keyLight.position.set(-4, 6, 7); scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(projectKey === 'unclegowhere' ? 0x7dd7db : projectKey === 'ascent' ? 0x9bbcff : 0xd89d65, 2.8); rimLight.position.set(5, 2, -4); scene.add(rimLight);

  const palette = {
    hlf: { accent: 0xe2934b, accent2: 0xa95e38, dark: 0x28313b, pale: 0xf2dfc4, signal: '#e2934b' },
    ascent: { accent: 0xe0a448, accent2: 0x718bbd, dark: 0x222b3c, pale: 0xe8e3d8, signal: '#718bbd' },
    tarotcarrot: { accent: 0xe28b45, accent2: 0xa37eb3, dark: 0x292431, pale: 0xead8ba, signal: '#c582a6' },
    unclegowhere: { accent: 0xe6a04b, accent2: 0x4aa6a8, dark: 0x173642, pale: 0xf0e4cc, signal: '#4aa6a8' }
  }[projectKey];
  const mat = {
    dark: new THREE.MeshPhysicalMaterial({ color: palette.dark, roughness: .56, metalness: .24, clearcoat: .3, clearcoatRoughness: .5 }),
    bronze: new THREE.MeshStandardMaterial({ color: palette.accent, roughness: .48, metalness: .52, emissive: palette.accent, emissiveIntensity: .035 }),
    accent: new THREE.MeshPhysicalMaterial({ color: palette.accent2, roughness: .5, metalness: .16, clearcoat: .36 }),
    pale: new THREE.MeshStandardMaterial({ color: palette.pale, roughness: .76, metalness: .02 }),
    glow: new THREE.MeshBasicMaterial({ color: palette.signal, transparent: true, opacity: .72, depthWrite: false })
  };

  function mesh(geometry, material, name, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
    const node = new THREE.Mesh(geometry, material); node.name = name;
    node.position.set(...position); node.rotation.set(...rotation); node.scale.set(...scale);
    return node;
  }
  function roundedRect(w, h, radius, depth) {
    const s = new THREE.Shape(); s.moveTo(-w / 2 + radius, -h / 2); s.lineTo(w / 2 - radius, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + radius); s.lineTo(w / 2, h / 2 - radius); s.quadraticCurveTo(w / 2, h / 2, w / 2 - radius, h / 2); s.lineTo(-w / 2 + radius, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - radius); s.lineTo(-w / 2, -h / 2 + radius); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2); return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: .055, bevelThickness: .045, bevelSegments: 4, curveSegments: 10 });
  }
  function gearGeometry(radius, teeth, depth) {
    const s = new THREE.Shape();
    for (let i = 0; i <= teeth * 4; i++) { const a = i / (teeth * 4) * Math.PI * 2, phase = i % 4, r = phase === 0 || phase === 1 ? radius : radius * .82; const x = Math.cos(a) * r, y = Math.sin(a) * r; i ? s.lineTo(x, y) : s.moveTo(x, y); }
    const hole = new THREE.Path(); hole.absarc(0, 0, radius * .23, 0, Math.PI * 2, true); s.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: .045, bevelThickness: .04, bevelSegments: 3 }); geo.center(); return geo;
  }
  function tube(a, b, material, name, bend = .35, radius = .018) {
    const middle = a.clone().lerp(b, .5); middle.z += bend;
    return mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, middle, b), 42, radius, 7, false), material, name);
  }
  function ringMarker(color = palette.signal) {
    const group = new THREE.Group();
    group.add(mesh(new THREE.SphereGeometry(.09, 18, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: color, emissiveIntensity: 1.3, roughness: .18 }), 'signal-core'));
    group.add(mesh(new THREE.TorusGeometry(.18, .012, 7, 44), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .62 }), 'signal-ring'));
    return group;
  }

  function buildAutomation() {
    const root = new THREE.Group(); root.name = 'operations-automation-engine';
    root.add(mesh(new THREE.TorusGeometry(1.43, .035, 9, 110), mat.accent, 'workflow-boundary', [0, 0, -.16]));
    root.add(mesh(new THREE.TorusGeometry(1.18, .012, 7, 96), mat.glow, 'workflow-signal-loop', [0, 0, -.12], [.18, .08, 0]));
    const primary = mesh(gearGeometry(.88, 12, .22), mat.bronze, 'validation-gear', [-.28, .08, .05]);
    const secondary = mesh(gearGeometry(.58, 10, .2), mat.accent, 'routing-gear', [.76, -.43, .11]); root.add(primary, secondary);
    const nodes = [], labels = ['Webhook accepted', 'Rules checked', 'Work routed', 'Outcome logged'];
    [[-1.25,.82],[.75,1.12],[1.25,.25],[-.95,-1.02]].forEach(([x,y], index) => {
      const node = ringMarker(index % 2 ? '#e2934b' : '#c66c43'); node.name = `workflow-stage-${index + 1}`; node.position.set(x, y, .35); root.add(node); nodes.push(node);
      root.add(tube(new THREE.Vector3(x, y, .24), new THREE.Vector3(index < 2 ? -.25 : .42, index < 2 ? .12 : -.28, .22), mat.glow, `workflow-route-${index + 1}`, .25));
    });
    return { root, nodes, labels, update(t) { primary.rotation.z = t * .22; secondary.rotation.z = -t * .34; } };
  }

  function buildAscent() {
    const root = new THREE.Group(); root.name = 'ascent-pathfinding-compass';
    root.add(mesh(new THREE.TorusGeometry(1.42, .075, 14, 110), mat.bronze, 'compass-outer-ring'));
    root.add(mesh(new THREE.TorusGeometry(1.14, .018, 8, 100), mat.accent, 'compass-signal-ring'));
    const face = mesh(new THREE.CylinderGeometry(1.08, 1.08, .13, 64), mat.dark, 'career-map-face', [0, 0, -.18], [Math.PI / 2, 0, 0]); root.add(face);
    const arrowShape = new THREE.Shape(); arrowShape.moveTo(0, 1.13); arrowShape.lineTo(-.27, .35); arrowShape.lineTo(-.09, .45); arrowShape.lineTo(-.09, -.62); arrowShape.lineTo(.09, -.62); arrowShape.lineTo(.09, .45); arrowShape.lineTo(.27, .35); arrowShape.closePath();
    const arrowGeo = new THREE.ExtrudeGeometry(arrowShape, { depth: .16, bevelEnabled: true, bevelSize: .035, bevelThickness: .035, bevelSegments: 3 }); arrowGeo.center();
    const arrow = mesh(arrowGeo, mat.bronze, 'northbound-career-arrow', [-.18, .08, .18], [0, 0, -.16]); root.add(arrow);
    const nodes = [], labels = ['Resume profile assembled', 'Skill gaps mapped', 'Learning path refined', 'Role readiness reached'];
    for (let index = 0; index < 4; index++) {
      const step = mesh(new THREE.BoxGeometry(.42 + index * .055, .18, .44), index === 3 ? mat.bronze : mat.pale, `career-milestone-${index + 1}`, [.3 + index * .2, -.92 + index * .27, .35]); root.add(step); nodes.push(step);
    }
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; root.add(mesh(new THREE.BoxGeometry(.025, i % 3 ? .11 : .19, .025), mat.pale, `compass-tick-${i + 1}`, [Math.sin(a) * 1.24, Math.cos(a) * 1.24, .12], [0, 0, -a])); }
    return { root, nodes, labels, update(t) { arrow.rotation.z = -.16 + Math.sin(t * .65) * .055; } };
  }

  function buildTarot() {
    const root = new THREE.Group(); root.name = 'tarotcarrot-growth-oracle';
    const cardGeo = roundedRect(2.05, 3.05, .24, .18); cardGeo.center(); root.add(mesh(cardGeo, mat.dark, 'oracle-card'));
    const insetGeo = roundedRect(1.73, 2.72, .19, .055); insetGeo.center(); root.add(mesh(insetGeo, mat.accent, 'raised-oracle-inlay', [0, 0, .2]));
    root.add(mesh(new THREE.TorusGeometry(.57, .04, 9, 64), mat.bronze, 'growth-sun', [0, .62, .32]));
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; root.add(mesh(new THREE.CapsuleGeometry(.026, .24, 4, 8), mat.bronze, `sun-ray-${i + 1}`, [Math.cos(a) * .82, .62 + Math.sin(a) * .82, .31], [0, 0, -a])); }
    const carrot = mesh(new THREE.ConeGeometry(.34, .98, 28), mat.bronze, 'carrot-root', [0, -.68, .36], [0, 0, Math.PI]); root.add(carrot);
    const nodes = [], labels = ['An idea appears', 'The concept finds focus', 'The experiment grows', 'A product direction emerges'];
    [[-.27,-.13,1],[-.08,-.03,.25],[.1,-.02,-.18],[.28,-.12,-.55]].forEach(([x,y,r], index) => { const leaf = mesh(new THREE.CapsuleGeometry(.075, .48, 6, 12), index === 3 ? mat.bronze : mat.pale, `growth-symbol-${index + 1}`, [x, y, .37], [0, 0, r]); root.add(leaf); nodes.push(leaf); });
    [[-.67,-1.12],[.7,-1.05],[-.73,1.18],[.72,1.14]].forEach(([x,y], i) => { const star = mesh(new THREE.OctahedronGeometry(.09, 0), mat.bronze, `oracle-star-${i + 1}`, [x,y,.34]); root.add(star); });
    return { root, nodes, labels, update(t) { nodes.forEach((node, i) => { node.scale.setScalar(1 + Math.sin(t * 1.3 + i) * .035); }); } };
  }

  function buildTravel() {
    const root = new THREE.Group(); root.name = 'unclegowhere-agentic-atlas';
    const globe = mesh(new THREE.IcosahedronGeometry(1.18, 3), mat.dark, 'travel-world'); root.add(globe);
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.195, 2), 24), new THREE.LineBasicMaterial({ color: palette.accent2, transparent: true, opacity: .16 })); wire.name = 'agent-network-grid'; root.add(wire);
    root.add(mesh(new THREE.TorusGeometry(1.36, .025, 8, 120), mat.bronze, 'global-route-orbit', [0,0,0], [.92,.18,.2]));
    root.add(mesh(new THREE.TorusGeometry(1.28, .012, 7, 110), mat.accent, 'equator-signal', [0,0,0], [Math.PI / 2,0,0]));
    const nodes = [], labels = ['Flight agent comparing routes', 'Stay agent checking fit', 'Planner shaping the itinerary', 'Review agent validating choices'];
    const positions = [[-1.42,.84,.28],[1.35,.75,.35],[1.42,-.78,.18],[-1.28,-.9,.42]];
    positions.forEach((position, index) => { const node = ringMarker(index % 2 ? '#e6a04b' : '#4aa6a8'); node.name = `travel-agent-${index + 1}`; node.position.set(...position); root.add(node); nodes.push(node); root.add(tube(new THREE.Vector3(...position), new THREE.Vector3(index % 2 ? .45 : -.38, index < 2 ? .38 : -.36, .65), index % 2 ? mat.bronze : mat.glow, `agent-message-${index + 1}`, .32, .016)); });
    const planeShape = new THREE.Shape(); planeShape.moveTo(.42,0); planeShape.lineTo(-.03,.11); planeShape.lineTo(-.25,.36); planeShape.lineTo(-.38,.31); planeShape.lineTo(-.25,.05); planeShape.lineTo(-.46,-.04); planeShape.lineTo(-.43,-.13); planeShape.lineTo(-.2,-.08); planeShape.lineTo(-.3,-.3); planeShape.lineTo(-.17,-.33); planeShape.lineTo(.01,-.1); planeShape.closePath();
    const planeGeo = new THREE.ExtrudeGeometry(planeShape, { depth: .08, bevelEnabled: true, bevelSize: .02, bevelThickness: .018, bevelSegments: 2 }); planeGeo.center(); const plane = mesh(planeGeo, mat.pale, 'travelling-plane', [0, 1.48, .52], [0,0,.1], [.68,.68,.68]); root.add(plane);
    return { root, nodes, labels, update(t) { globe.rotation.y = t * .09; wire.rotation.y = t * .09; const a = t * .34; plane.position.set(Math.cos(a) * 1.48, Math.sin(a) * .72, .5 + Math.sin(a) * .22); plane.rotation.z = a + Math.PI / 2; } };
  }

  const artifact = ({ hlf: buildAutomation, ascent: buildAscent, tarotcarrot: buildTarot, unclegowhere: buildTravel })[projectKey]();
  artifact.root.rotation.set(-.08, -.22, projectKey === 'tarotcarrot' ? -.04 : .03); scene.add(artifact.root);
  const shadow = mesh(new THREE.CircleGeometry(1.55, 64), new THREE.MeshBasicMaterial({ color: 0x403229, transparent: true, opacity: .1, depthWrite: false }), 'contact-shadow', [0, -1.9, -.5], [-Math.PI / 2, 0, 0], [1, .36, 1]); scene.add(shadow);

  let selected = 0, hovered = null, dragging = false, moved = false, lastX = 0, lastY = 0, targetYaw = -.22, targetPitch = -.08;
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2(2, 2);
  function showSignal(index, lock = true) {
    index = Number(index); if (!artifact.nodes[index]) return; if (lock) { selected = index; hovered = null; }
    readout.querySelector('strong').textContent = signalButtons[index].textContent.trim(); readout.querySelector('p').textContent = artifact.labels[index];
    signalButtons.forEach((button, i) => button.classList.toggle('is-active', i === index));
  }
  function eventPoint(event) { const box = sculptCanvas.getBoundingClientRect(); pointer.x = (event.clientX - box.left) / box.width * 2 - 1; pointer.y = -(event.clientY - box.top) / box.height * 2 + 1; }
  function hitSignal() { raycaster.setFromCamera(pointer, camera); const hits = raycaster.intersectObjects(artifact.nodes, true); if (!hits[0]) return null; return artifact.nodes.findIndex(node => node === hits[0].object || node.getObjectById(hits[0].object.id)); }
  signalButtons.forEach(button => { button.addEventListener('click', () => showSignal(button.dataset.signal)); button.addEventListener('mouseenter', () => showSignal(button.dataset.signal, false)); button.addEventListener('mouseleave', () => showSignal(selected)); });
  sculptCanvas.addEventListener('pointerdown', event => { dragging = true; moved = false; lastX = event.clientX; lastY = event.clientY; sculptCanvas.setPointerCapture(event.pointerId); sculptCanvas.style.cursor = 'grabbing'; });
  sculptCanvas.addEventListener('pointermove', event => { if (dragging) { const dx = event.clientX - lastX, dy = event.clientY - lastY; if (Math.abs(dx) + Math.abs(dy) > 2) moved = true; targetYaw += dx * .008; targetPitch = THREE.MathUtils.clamp(targetPitch + dy * .006, -.7, .5); lastX = event.clientX; lastY = event.clientY; return; } eventPoint(event); const hit = hitSignal(); if (hit !== hovered) { hovered = hit; sculptCanvas.style.cursor = hit === null ? 'grab' : 'pointer'; if (hit !== null) showSignal(hit, false); } });
  sculptCanvas.addEventListener('pointerup', event => { dragging = false; eventPoint(event); const hit = hitSignal(); if (!moved && hit !== null) showSignal(hit); sculptCanvas.style.cursor = hit === null ? 'grab' : 'pointer'; });
  sculptCanvas.addEventListener('pointerleave', () => { if (!dragging) { hovered = null; sculptCanvas.style.cursor = 'grab'; showSignal(selected); } });
  sculptCanvas.addEventListener('keydown', event => { if (!['ArrowLeft','ArrowRight'].includes(event.key)) return; event.preventDefault(); showSignal((selected + (event.key === 'ArrowRight' ? 1 : -1) + artifact.nodes.length) % artifact.nodes.length); });

  function resize() { const box = sculptCanvas.getBoundingClientRect(), w = Math.max(1, Math.round(box.width)), h = Math.max(1, Math.round(box.height)); renderer.setSize(w, h, false); camera.aspect = w / h; camera.position.z = camera.aspect < .78 ? 9.25 : projectKey === 'tarotcarrot' ? 8.8 : 8; camera.updateProjectionMatrix(); }
  new ResizeObserver(resize).observe(sculptCanvas); resize(); showSignal(0);
  const clock = new THREE.Clock();
  function frame() { const t = clock.getElapsedTime(); artifact.root.rotation.y += (targetYaw - artifact.root.rotation.y) * .055; artifact.root.rotation.x += (targetPitch - artifact.root.rotation.x) * .055; if (!reducedMotion) { artifact.root.position.y = Math.sin(t * .7) * .035; artifact.update(t); artifact.nodes.forEach((node, index) => { const active = (hovered ?? selected) === index, scale = active ? 1.2 : 1; node.scale.lerp(new THREE.Vector3(scale, scale, scale), .12); }); } renderer.render(scene, camera); requestAnimationFrame(frame); }
  frame();
}
