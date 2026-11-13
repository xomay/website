// All anatomical landmarks are in metres. The character faces +Z.
export function buildCharacter(THREE) {
  const character = new THREE.Group();
  character.name = 'Mathys';
  const tau = Math.PI * 2;
  const v = (x, y, z) => new THREE.Vector3(x, y, z);
  const standard = (color, roughness = .62, options = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness, ...options });
  const skin = standard(0xdca181, .62);
  const lip = standard(0xb87568);
  const hair = standard(0x352623, .88);
  const hairLight = standard(0x513830, .8);
  const brow = standard(0x453029);
  const knit = standard(0x15243b, .9);
  const collar = standard(0x223149, .85, { side: THREE.DoubleSide });
  const seam = standard(0x33425a, .85);
  const button = standard(0x283247,.46);

  function mesh(geometry, material, parent = character) {
    const obj = new THREE.Mesh(geometry, material);
    obj.castShadow = !material.transparent;
    obj.receiveShadow = !material.transparent;
    parent.add(obj);
    return obj;
  }

  function oval(parent, center, scale, mat) {
    const obj = mesh(new THREE.SphereGeometry(1, 32, 24), mat, parent);
    obj.position.copy(center);
    obj.scale.set(...scale);
    return obj;
  }

  // Hermite interpolation through cross-sections [height, x, z, x radius, z radius].
  function sample(rings, y) {
    let j = 1;
    while (j < rings.length - 1 && y > rings[j][0]) j++;
    const p = rings[j - 1], q = rings[j];
    const a = rings[Math.max(0, j - 2)], b = rings[Math.min(rings.length - 1, j + 1)];
    const h = q[0] - p[0], t = THREE.MathUtils.clamp((y-p[0]) / h, 0, 1);
    const t2 = t*t, t3 = t2*t;
    return p.slice(1).map((n,k) => {
      const i = k+1;
      const m0 = (q[i]-a[i]) * h / (q[0]-a[0]);
      const m1 = (b[i]-p[i]) * h / (b[0]-p[0]);
      return (2*t3-3*t2+1)*n + (t3-2*t2+t)*m0 + (3*t2-2*t3)*q[i] + (t3-t2)*m1;
    });
  }
  function surface(rows, columns, point) {
    const pos = [], indices = [];
    for (let j=0; j<=rows; j++) {
      for (let i=0; i<columns; i++) {
        const p = point(i*tau/columns,j/rows);
        pos.push(p.x,p.y,p.z);
        if(j < rows) {
          const k = j*columns+i, n = j*columns+(i+1)%columns;
          indices.push(k,n,k+columns,n,n+columns,k+columns);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    geo.setIndex(indices); geo.computeVertexNormals();
    return geo;
  }
  function loft(rings, material, warp, rows=48, columns=52, parent=character) {
    return mesh(surface(rows,columns,(angle,t) => {
      const y = THREE.MathUtils.lerp(rings[0][0],rings.at(-1)[0],t);
      const [cx,cz,rx,rz] = sample(rings,y);
      const p = v(cx+rx*Math.sin(angle),y,cz+rz*Math.cos(angle));
      if(warp) warp(p,angle);
      return p;
    }),material,parent);
  }
  function cord(points, radius, mat, parent = character) {
    return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),24,radius,8,false),mat,parent);
  }
  // Taper a swept tube at both ends, e.g. for eyelids and hair locks.
  function stroke(points, rad, mat, flatten = 1, parent = character) {
    const curve = new THREE.CatmullRomCurve3(points);
    return mesh(surface(24,12,(a,t) => {
      const p = curve.getPoint(t), tang = curve.getTangent(t);
      const side = v(0,0,1).cross(tang).normalize();
      const outward = tang.clone().cross(side).normalize();
      const r = rad * (.025 + .975*Math.pow(Math.sin(Math.PI*t),.58));
      return p.addScaledVector(side,Math.cos(a)*r).addScaledVector(outward,Math.sin(a)*r*flatten);
    }),mat,parent);
  }

  // Sculpted polo body, fitting over the lungs, shoulders and abdomen.
  const shirt = [[.801,0,-.008,.001,.001],[.805,0,-.008,.159,.104],
    [.823,0,-.008,.161,.107],[.87,0,-.008,.163,.108],[.93,0,-.008,.16,.105],
    [1.02,0,-.009,.153,.101],[1.105,0,-.005,.152,.105],
    [1.205,0,.001,.172,.118],[1.30,0,0,.194,.12],[1.353,0,-.010,.194,.104],
    [1.385,0,-.010,.175,.089],[1.402,0,-.009,.137,.076],[1.423,0,-.006,.060,.054]];
  function shirtFold(a,y){
    const fade = THREE.MathUtils.smoothstep(y,.803,.838) *
      (1-THREE.MathUtils.smoothstep(y,1.25,1.405));
    return fade * (.0021*Math.sin(9*a+.8*Math.sin(y*12)) +
       .0018*Math.cos(16*a+y*10) + .0024*Math.sin(21*a+y*5)*Math.exp(-((y-.87)**2)/.01));
  }
  loft(shirt,knit,(p,a)=>{
    const r=shirtFold(a,p.y); p.x+=r*Math.sin(a);p.z+=r*Math.cos(a);
  },88,100);
  function shirtZ(x,y){
    const [,cz,rx,rz]=sample(shirt,y), a=Math.asin(x/rx);
    return cz+(rz+shirtFold(a,y))*Math.cos(a);
  }
  // A folded collar wraps around the back of the neck and breaks into pointed leaves.
  loft([[1.407,0,-.009,.066,.056],[1.428,0,-.011,.054,.051],[1.483,0,-.002,.047,.049],
    [1.514,0,.002,.052,.055]],skin);
  loft([[1.405,0,-.006,.087,.072],[1.418,0,-.005,.074,.060],
    [1.434,0,-.006,.06,.054],[1.441,0,-.006,.059,.052]],collar,null,28);
  function fabricPatch(rows,cols,point,material){
    const points=[], indices=[];
    for(let j=0;j<=rows;j++) for(let i=0;i<=cols;i++) {
      const p=point(i/cols,j/rows);points.push(p.x,p.y,p.z);
      const k=j*(1+cols)+i;
      if(i<cols && j<rows) indices.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
    g.setIndex(indices);g.computeVertexNormals();
    return mesh(g,material);
  }
  for(const side of [-1,1]){
    const folded=(u,t)=>{
      const x=side*THREE.MathUtils.lerp(.009+.054*u,.048+.052*u,t);
      const y=THREE.MathUtils.lerp(1.419+.016*u,1.349+.040*u,t);
      const z=THREE.MathUtils.lerp(.055-.032*u,shirtZ(x,1.349+.040*u),t) +.011*Math.sin(t*Math.PI);
      return v(x,y,z+.003+.005*Math.sin(t*Math.PI));
    };
    fabricPatch(20,16,folded,collar);
    cord([folded(0,1),folded(.35,1),folded(.7,1),folded(1,1)],.0009,seam);
  }
  fabricPatch(24,6,(u,t)=>{
    const y=1.253+.149*t, x=(u-.5)*.021;
    return v(x,y,shirtZ(x,y)+.0018);
  },collar);
  for(const y of [1.277,1.319,1.361]) {
    const z=shirtZ(0,y);
    oval(character,v(0,y,z+.0049),[.005,.005,.0025],button);
    cord([v(-.0011,y+.0006,z+.0072),v(.0011,y-.0006,z+.0072)],.0006,seam);
  }
  for(const side of [-1,1]) {
    const board = side===-1;
    const arm=[[board?.984:.824,board?.235:.217,board?.104:.032,.025,.025],
      [board?1.025:.876,board?.251:.221,board?.084:.020,.031,.032],
      [board?1.06:.973,board?.265:.229,board?.030:.005,.039,.040],
      [board?1.084:1.083,board?.262:.221,board?-.025:-.018,.038,.043],
      [1.168,board?.238:.212,-.014,.045,.051],[1.235,.215,-.013,.050,.055]]
      .map(([y,x,z,rx,rz])=>[y,x*side,z,rx,rz]);
    loft(arm,skin);
    const sleeve=[[1.184,.228,-.012,.051,.058],[1.194,.228,-.013,.054,.060],
      [1.248,.211,-.014,.062,.066],[1.302,.194,-.015,.066,.07],
      [1.342,.181,-.015,.065,.066],[1.37,.166,-.014,.054,.057],[1.39,.151,-.014,.026,.033]]
      .map(([y,x,z,rx,rz])=>[y,x*side,z,rx,rz]);
    loft(sleeve,knit);
    loft(sleeve.slice(0,2),collar,null,8);
    const palmX=board?-.237:.216, palmY=board?.982:.816, palmZ=board?.115:.038;
    oval(character,v(palmX,palmY,palmZ),[.030,.052,.021],skin);
    for(let i=0;i<4;i++) {
      if(board){
        const y=.956+.013*i;
        stroke([v(-.236,y+.002,.116),v(-.247,y-.004,.137),v(-.265,y,.146),v(-.268+(i-2)**2*.002,y+.004,.142)],.0075,skin);
      } else {
        const x=palmX+(i-1.5)*.0132, dy=Math.abs(i-1.35)*.007;
        stroke([v(x,.806,.037),v(x+.002,.779,.039),v(x-.003,.748+dy,.048),v(x-.008,.745+dy,.052)],.0077,skin);
      }
    }
    stroke(board?[v(-.214,1.002,.113),v(-.220,1.020,.137),v(-.242,1.017,.151),v(-.253,1.009,.15)]:
      [v(.191,.836,.039),v(.185,.813,.056),v(.186,.793,.065)],.010,skin);
  }

  const head = [[1.474,0,.028,.006,.010],[1.484,0,.020,.040,.047],[1.505,0,.009,.067,.069],
    [1.537,0,.001,.083,.086],[1.575,0,.001,.094,.094],[1.612,0,.001,.094,.1],
    [1.649,0,-.001,.096,.101],[1.680,0,-.005,.092,.095],[1.709,0,-.008,.077,.083],
    [1.732,0,-.009,.048,.058],[1.744,0,-.011,.004,.005]];
  const bump=(x,y,cx,cy,sx,sy)=>Math.exp(-(((x-cx)/sx)**2+((y-cy)/sy)**2));
  function relief(x,y) {
    const ax=Math.abs(x);
    return .014*bump(x,y,0,1.524,.05,.021)+.006*bump(x,y,0,1.493,.035,.012)
      + .012*bump(ax,y,.055,1.552,.027,.023)-.010*bump(ax,y,.041,1.584,.028,.014)
      + .011*bump(ax,y,.042,1.606,.029,.012)+.027*bump(x,y,0,1.569,.012,.031)
      + .030*bump(x,y,0,1.551,.019,.012)+.013*bump(ax,y,.014,1.548,.009,.007);
  }
  function facialZ(x,y){
    const [,cz,rx,rz]=sample(head,y);
    const c=Math.sqrt(Math.max(0,1-(x/rx)**2));
    return cz+rz*c+relief(x,y)*c;
  }
  const face=loft(head,skin.clone(),(p,a)=>{p.z+=Math.max(0,Math.cos(a))*relief(p.x,p.y);},105,112);
  // A short beard follows the jaw and fades toward the cheeks. Baking its tone
  // into the face avoids a second shell intersecting the smile.
  const facialTones=[];
  const vertices=face.geometry.getAttribute('position');
  const color = new THREE.Color();
  for(let i=0;i<vertices.count;i++) {
    const x=vertices.getX(i), y=vertices.getY(i), z=vertices.getZ(i);
    const side=Math.min(1,Math.abs(x)/.086);
    const beardLine=1.502+.036*side**1.8;
    const grain=.68+.32*Math.sin(x*6470+y*8329)*Math.cos(z*5240-y*4320);
    const beard=(1-THREE.MathUtils.smoothstep(y,beardLine-.006,beardLine+.006))*grain;
    const moustache=bump(Math.abs(x),y,.013,1.537,.020,.0035)*.2;
    const tint=1-.36*beard-moustache;
    color.setRGB(tint, tint*.985, tint*.982);
    facialTones.push(color.r,color.g,color.b);
  }
  face.geometry.setAttribute('color', new THREE.Float32BufferAttribute(facialTones,3));
  face.material.vertexColors=true;
  for(const s of [-1,1]) {
    oval(character,v(s*.093,1.563,-.007),[.014,.025,.012],skin);
    oval(character,v(s*.103,1.563,-.001),[.005,.014,.007],lip);
    const x=s*.04,y=1.583,z=facialZ(x,y)+.002;
    const eye=new THREE.Group(); eye.position.set(x,y,z); eye.rotation.y=s*.33;character.add(eye);
    oval(eye,v(0,0,0),[.022,.0108,.0085],standard(0xfff5de,.4));
    oval(eye,v(-s*.001,0,.007),[.0086,.0094,.0032],standard(0x765338,.3));
    oval(eye,v(-s*.001,0,.0097),[.0046,.0060,.0017],standard(0x201e23,.23));
    oval(eye,v(-.003,.0037,.0112),[.0022,.0022,.0014],standard(0xffffff,.13));
    stroke([v(-.022,0,.001),v(-.012,.0085,.0045),v(0,.011,.005),v(.013,.008,.004),v(.022,.0004,0)],.0022,brow,.62,eye);
    const weights = [[.016,1.605],[.030,1.611],[.048,1.612],[.064,1.605]];
    stroke(weights.map(([u,w])=>v(u*s,w,facialZ(u*s,w)+.002)),.0047,hair,.52);
    oval(character,v(.011*s,1.546,facialZ(.011*s,1.546)),[.0039,.0019,.0016],standard(0xa8715d));
  }
  // Sample the smile directly on the curved muzzle to keep the lip contours continuous.
  function lipContour(offset){
    return Array.from({length:33},(_,i)=>{
      const t=i/16-1, x=.034*t;
      const y=1.523+.007*t*t + offset*(1-t*t);
      return v(x,y,facialZ(x,y)+.0025*(1-t*t)+.0005);
    });
  }
  // One curved strip for the mouth and one for the teeth keep the smile soft.
  function smileStrip(bottom,top,width,mat,lift) {
    fabricPatch(6,32,(u,t)=>{
      const k=(u-.5)*2,x=width*k;
      const y=1.523+.007*k*k+(1-k*k)*THREE.MathUtils.lerp(bottom,top,t);
      return v(x,y,facialZ(x,y)+lift);
    },mat);
  }
  smileStrip(-.0049,.0026,.034,standard(0x824648,.66,{side:THREE.DoubleSide}),.0019);
  smileStrip(-.0015,.0025,.030,standard(0xffe7d4,.51,{side:THREE.DoubleSide}),.0024);
  stroke(lipContour(.0027),.0016,standard(0xb77467),.65);
  stroke(lipContour(-.0047),.0024,lip,.74);

  // Short sides and a fuller, loose wave over the forehead.
  function capPoint(a,t) {
    const front=(1+Math.cos(a))*.5;
    const hairline=1.542+.100*front**1.45+.004*Math.sin(3*a)*front;
    const y=THREE.MathUtils.lerp(hairline,1.744,t);
    const [,cz,rx,rz]=sample(head,y);
    const quiff=Math.sin(t*Math.PI)**.8 * front**1.6;
    const roll=Math.cos(8*a+1.45*Math.sin(7*t-2*a))*.0022;
    const extra=.003+.011*quiff+roll;
    return v(Math.sin(a)*(rx+extra)+.004*t,
      y+.010*t+.012*quiff,
      cz+Math.cos(a)*(rz+extra));
  }
  const cap=mesh(surface(54,112,capPoint),hair);
  // Broad, overlapping swept locks have chunky silhouettes and scalloped ends.
  const chestnut=standard(0x443029,.76), brown=standard(0x392923,.77);
  for(let i=0;i<24;i++){
    const angle=i*tau/24, front=(1+Math.cos(angle))*.5;
    const points=[];
    for(let j=0;j<=12;j++){
      const t=j/12, q=.89-.91*t;
      const a=angle +.24*Math.sin(2*Math.PI*t+.5*angle)+.35*t;
      const p=capPoint(a,Math.max(0,q));
      const lift=front**1.3*(.003+.009*Math.sin(t*Math.PI)**2);
      p.x+=Math.sin(a)*lift; p.y+=.001+.007*front*Math.sin(t*Math.PI)-.004*t*t;
      p.z+=Math.cos(a)*lift;
      points.push(p);
    }
    stroke(points,.004+.006*front,i%3===0?chestnut:brown,.55);
  }
  for(let i=0;i<9;i++){
    const a=(i-4)*.27, points=[];
    for(let j=0;j<=10;j++){
      const t=j/10;
      const angle=a+.27*Math.sin(1.65*Math.PI*t-.38)+.18*t;
      const p=capPoint(angle,.64-.62*t);
      p.x+=Math.sin(angle)*.006; p.z+=Math.cos(angle)*(.012+.005*Math.sin(t*Math.PI));
      p.y+=.006*Math.sin(t*Math.PI)-.012*t*t + .003*Math.sin(a*7)*t;
      points.push(p);
    }
    stroke(points,.009,i%3===0?hairLight:chestnut,.56);
  }

  // Swap complete materials so the rest pose writes a fully opaque depth buffer.
  // Cache only the character meshes here: organs and clipboard attach afterwards.
  const shell=standard(0x80b0d2,.32,{transparent:true,opacity:.19,depthWrite:false});
  const skinShell=standard(0xf3c4a5,.47,{transparent:true,opacity:.16,depthWrite:false});
  const hairShell=standard(0x674b40,.77,{transparent:true,opacity:.085,depthWrite:false});
  const parts=[];
  character.traverse(obj=>{
    if(!obj.isMesh) return;
    const original=obj.material;
    const scan=original===knit || original===collar ? shell :
      original===skin || obj===face ? skinShell : obj===cap ? hairShell : null;
    parts.push({obj,original,scan});
  });
  let revealed=false;
  character.userData.setRevealed=(active)=>{
    if(revealed===active) return;
    revealed=active;
    for(const {obj,original,scan} of parts){
      obj.visible=!active || !!scan;
      obj.material=active && scan ? scan : original;
      obj.castShadow=!active;
    }
  };
  return character;
}
