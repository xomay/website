import * as THREE from 'three';
import {buildCharacter} from './character.js';
import {buildAnatomy} from './anatomy.js';

const stage = document.querySelector('#stage');
const hero = stage.closest('.hero');
const svg = hero.querySelector('.connections');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width:800px)');

function start() {
  const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
  renderer.setClearColor(0xffffff,0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  stage.append(renderer.domElement);
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff,0xabc6ec,1.95));
  for (const [x,y,z,intensity,color] of [[3,5,4,2.35,0xfff1de],[-3,2,3,1.1,0xc3dcff],[0,3,-3,2.25,0xd6efff]]) {
    const light = new THREE.DirectionalLight(color,intensity);
    light.position.set(x,y,z);scene.add(light);
  }
  const person = buildCharacter(THREE);
  const {group,targets} = buildAnatomy(THREE);
  person.add(group);
  scene.add(person);

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .01, 30);
  camera.position.set(0, 1.31, 5);
  camera.lookAt(0, 1.31, 0);
  const characterMeshes = [];
  person.traverse(object => { if (object.isMesh) characterMeshes.push(object); });
  let selectedZone = null;
  let pointerOnCharacter = false;
  let revealed = false;
  function reveal(value) {
    if (revealed === value) return;
    revealed = value;
    stage.dataset.revealed = String(value);
    person.userData.setRevealed?.(value);
    for (const key of ['brain', 'heart', 'lungs']) targets[key].visible = value;
    queue();
  }
  for (const key of ['brain', 'heart', 'lungs']) targets[key].visible = false;
  stage.dataset.revealed = 'false';
  const anchors = {}, lines = {}, ends = {}, materials = {};
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pickables = [];
  for(const [key,obj] of Object.entries(targets)){
    anchors[key] = new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3());
    if(key==='lungs') anchors[key].x=-.088;
    anchors[key].z+=.035;
    const unique = new Map();
    obj.traverse(mesh=>{
      if (!mesh.isMesh) return;
      mesh.userData.zone = key;
      pickables.push(mesh);
      if(!unique.has(mesh.material)) unique.set(mesh.material,mesh.material.clone());
      mesh.material=unique.get(mesh.material);
    });
    materials[key]=[...unique.values()].filter(m=>m.emissive).map(m=>({m,color:m.emissive.clone(),intensity:m.emissiveIntensity}));
    const ns='http://www.w3.org/2000/svg';
    const path=document.createElementNS(ns,'path'), dot=document.createElementNS(ns,'circle');
    dot.setAttribute('r','3');svg.append(path,dot);lines[key]=[path,dot];
  }

  let width,height,offsetY,offsetX,desired=-.12,frame=0;
  person.rotation.y=desired;
  function render(){
    frame=0;
    person.rotation.y += (desired-person.rotation.y)*.13;
    renderer.render(scene,camera);
    if (!renderer.getContext().isContextLost()) stage.classList.add('ready');
    for(const [key,anchor] of Object.entries(anchors)){
      const p=person.localToWorld(anchor.clone()).project(camera);
      const x=offsetX+(p.x+1)*width/2,y=offsetY+(1-p.y)*height/2;
      const [endX,endY]=ends[key];
      const [line,dot]=lines[key];
      line.setAttribute('d', 'M '+x+' '+y+' L '+(x+(endX-x)*.5)+' '+y+' L '+(endX-15)+' '+endY+' H '+endX);
      dot.setAttribute('cx',x);dot.setAttribute('cy',y);
    }
    if(Math.abs(desired-person.rotation.y)>.0004) queue();
  }
  function queue(){if(!frame)frame=requestAnimationFrame(render);}
  function resize(){
    const rect=stage.getBoundingClientRect(), base=hero.getBoundingClientRect();
    width=rect.width;height=rect.height;offsetX=rect.left-base.left;offsetY=rect.top-base.top;
    renderer.setSize(width,height,false);
    const halfH = mobile.matches ? .58 : .495;
    const halfW = halfH * width / height;
    const cx = mobile.matches ? .51 : .565;
    hero.querySelector('.explorer').style.top = mobile.matches ? (offsetY + height * .13) + 'px' : '';
    camera.left=-2*cx*halfW;camera.right=2*(1-cx)*halfW;camera.top=halfH;camera.bottom=-halfH;
    camera.updateProjectionMatrix();
    for(const key of Object.keys(targets)){
      const r=hero.querySelector('[data-zone="'+key+'"]').getBoundingClientRect();
      ends[key]=[r.left-base.left,r.top-base.top+r.height/2];
    }
    queue();
  }
  function pointerRay(event) {
    const rect = stage.getBoundingClientRect();
    pointer.set(2 * (event.clientX - rect.left) / rect.width - 1, 1 - 2 * (event.clientY - rect.top) / rect.height);
    raycaster.setFromCamera(pointer, camera);
  }
  function zoneAtPointer() {
    const visibleTargets = pickables.filter(mesh => revealed || mesh.userData.zone === 'clipboard');
    return raycaster.intersectObjects(visibleTargets, false)[0]?.object.userData.zone ?? null;
  }
  hero.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    if (!motion.matches) {
      desired = -.1 + THREE.MathUtils.clamp(2 * (event.clientX - hero.getBoundingClientRect().left) / hero.clientWidth - 1, -1, 1) * .38;
      queue();
    }
    if (event.target === renderer.domElement) {
      pointerRay(event);
      pointerOnCharacter = raycaster.intersectObjects(characterMeshes, false).length > 0;
      reveal(pointerOnCharacter || !!selectedZone);
      const zone = zoneAtPointer();
      stage.style.cursor = zone ? 'pointer' : 'default';
      window.dispatchEvent(new CustomEvent('organ-hover', { detail: zone }));
    }
  });
  renderer.domElement.addEventListener('pointerleave', () => {
    pointerOnCharacter = false;
    reveal(!!selectedZone);
    window.dispatchEvent(new CustomEvent('organ-hover', { detail: null }));
  });
  hero.addEventListener('pointerleave', () => {
    desired = -.12;
    pointerOnCharacter = false;
    reveal(!!selectedZone);
    queue();
  });
  renderer.domElement.addEventListener('click', event => {
    pointerRay(event);
    pointerOnCharacter = raycaster.intersectObjects(characterMeshes, false).length > 0;
    reveal(pointerOnCharacter || !!selectedZone);
    window.dispatchEvent(new CustomEvent('organ-pick', { detail: zoneAtPointer() }));
  });
  window.addEventListener('highlight',e=>{
    selectedZone = e.detail;
    reveal(pointerOnCharacter || !!selectedZone);
    for(const [key,mats] of Object.entries(materials)){
      for(const {m,color,intensity} of mats){
        if(key===e.detail){m.emissive.setHex(0x2868ed);m.emissiveIntensity=.28;}
        else{m.emissive.copy(color);m.emissiveIntensity=intensity;}
      }
    }
    queue();
  });
  renderer.domElement.addEventListener('webglcontextlost', () => {
    stage.classList.remove('ready');
    stage.classList.add('unavailable');
    svg.style.display='none';
  });
  new ResizeObserver(resize).observe(hero);
  window.addEventListener('annotations-resize',resize);document.fonts.ready.then(resize);resize();
}
try { start(); }
catch(error) { console.error('Avatar renderer',error);stage.classList.add('unavailable');svg.style.display='none'; }
