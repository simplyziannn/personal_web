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
