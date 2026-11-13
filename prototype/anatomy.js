// Measurements are in metres. The character faces +Z.
export function buildAnatomy(THREE) {
  const group = new THREE.Group();
  const targets = {};
  const point = (x, y, z) => new THREE.Vector3(x, y, z);
  const material = (color, options) => new THREE.MeshStandardMaterial({
    color, roughness: 0.52, ...options,
  });

  function target(name, position) {
    const item = new THREE.Group();
    item.name = name;
    item.position.copy(position);
    group.add(item);
    targets[name] = item;
    return item;
  }

  function mesh(parent, geometry, surface) {
    const item = new THREE.Mesh(geometry, surface);
    parent.add(item);
    return item;
  }

  function tube(parent, coordinates, radius, surface, segments = 24) {
    const curve = new THREE.CatmullRomCurve3(coordinates.map(([x, y, z]) => point(x, y, z)));
    return mesh(parent, new THREE.TubeGeometry(curve, segments, radius, 7, false), surface);
  }

  function ellipsoid(parent, center, radii, surface) {
    const item = mesh(parent, new THREE.SphereGeometry(1, 20, 14), surface);
    item.position.set(...center);
    item.scale.set(...radii);
    return item;
  }

  // Sculpt each surface from a continuous mesh. The colour in a fold is baked in,
  // so its shape remains readable under the scene's soft lighting.
  function sculpt(parent, surface, deform, longitude = 64, latitude = 40) {
    const geometry = new THREE.SphereGeometry(1, longitude, latitude);
    const vertices = geometry.attributes.position;
    const colors = [];
    for (let i = 0; i < vertices.count; i++) {
      const [x, y, z, shade] = deform(vertices.getX(i), vertices.getY(i), vertices.getZ(i));
      vertices.setXYZ(i, x, y, z);
      colors.push(shade, shade, shade);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    return mesh(parent, geometry, surface);
  }

  const brain = target('brain', point(0, 1.634, 0.006));
  const cortex = material(0xe99a91, { vertexColors: true, roughness: .64 });
  for (const side of [-1, 1]) {
    sculpt(brain, cortex, (x, y, z) => {
      const lateral = side * x;
      const wave = Math.sin(11 * z + 3.5 * Math.sin(3.4 * y + 1.8 * lateral)
        + 1.8 * Math.sin(4.3 * lateral - 3 * y));
      const transverse = Math.sin(10.5 * y + 2.1 * Math.sin(4 * z + lateral)
        + 2.2 * Math.cos(3.6 * lateral + z));
      const sulcus = Math.exp(-10 * wave * wave);
      const secondary = Math.exp(-15 * transverse * transverse) *
        (.34 + .25 * Math.sin(4 * lateral + 4 * z));
      const crease = Math.min(1, sulcus + secondary);
      const relief = 1 - .075 * crease;
      return [
        side * (.002 + Math.max(lateral * .004, lateral * .062) * relief),
        y * .051 * relief - .005 * z,
        z * .075 * relief,
        1 - .32 * crease,
      ];
    }, 96, 68);
  }

  const lungs = target('lungs', point(0, 1.245, .011));
  const lungMaterial = material(0xe39e9b, { vertexColors: true, roughness: .63 });
  for (const side of [-1, 1]) {
    sculpt(lungs, lungMaterial, (x, y, z) => {
      const base = (1 - y) * .5;
      const outer = side * x;
      const cardiacNotch = side === 1
        ? .013 * Math.exp(-9 * (y + .27) ** 2) * Math.max(0, -outer)
        : 0;
      const slope = y + .34 + .56 * outer + .18 * z;
      const mainFissure = Math.exp(-150 * slope * slope);
      const minorFissure = side === -1 ? .66 * Math.exp(-200 * (y - .05 + .12 * outer) ** 2) : 0;
      const crease = Math.max(mainFissure, minorFissure);
      const relief = 1 - .045 * crease;
      return [
        side * (.061 + .012 * base + cardiacNotch) + x * (.036 + .047 * base) * relief,
        y * .109 + .008 * (1 - y * y) * outer + .009 * Math.min(0, y) ** 2,
        z * (.041 + .034 * base) * relief - .012 * y,
        1 - .18 * crease,
      ];
    });
  }
  const airway = material(0xd9a8a3);
  const rings = material(0xf0cfba);
  tube(lungs, [[0,.153,-.003],[0,.114,.002],[0,.078,.013],[0,.042,.022]], .009, airway);
  for (let i = 0; i < 6; i++) {
    const ring = mesh(lungs, new THREE.TorusGeometry(.009, .0016, 6, 18), rings);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0,.144-i*.014,-.002+i*.0034);
  }
  for (const side of [-1, 1]) {
    const s = side;
    tube(lungs, [[0,.042,.022],[s*.021,.027,.026],[s*.043,.014,.032],[s*.054,.005,.043]], .0068, airway);
    tube(lungs, [[s*.051,.008,.041],[s*.059,.004,.051],[s*.069,-.013,.057],[s*.082,-.033,.058]], .003, airway);
    tube(lungs, [[s*.058,.004,.049],[s*.074,.018,.047],[s*.087,.035,.041]], .0024, airway);
  }

  const heart = target('heart', point(.044, 1.227, .073));
  const myocardium = material(0xbd434d, { vertexColors: true, roughness: .43 });
  sculpt(heart, myocardium, (x, y, z) => {
    const apex = (1 - y) * .5;
    return [
      x * .041 * (.62 + .65 * (1 - apex)) + .022 * apex * apex,
      y * .05 - .003 * x,
      z * .029 * (1 - .35 * apex) + .006 * apex,
      .9 + .1 * (1 + z) / 2,
    ];
  }, 48, 32);
  const artery = material(0xad3844);
  const arteryTip = material(0xdc6770);
  const vein = material(0x6a83a4);
  const ridge = material(0xe3a08c);
  ellipsoid(heart, [-.022,.024,.004], [.021,.017,.019], artery);
  ellipsoid(heart, [.019,.029,-.004], [.019,.014,.018], arteryTip);
  tube(heart, [[-.009,.027,-.003],[-.01,.049,.002],[-.007,.064,.002],[.005,.07,-.003],[.015,.063,-.015],[.015,.039,-.022]], .0092, artery);
  for (let i = 0; i < 3; i++) {
    const x = -.007 + i*.007;
    tube(heart, [[x,.06,-.003],[x-.001,.069,-.004],[x-.002,.078-i*.001,-.004]], .0037, arteryTip);
  }
  tube(heart, [[.004,.022,.016],[.003,.039,.015],[.001,.046,.012],[-.018,.051,.005]], .0082, vein);
  tube(heart, [[-.022,.014,-.004],[-.03,.032,-.006],[-.032,.051,-.006]], .0065, vein);
  tube(heart, [[-.021,.028,.019],[-.007,.016,.028],[.004,.001,.031],[.009,-.017,.029],[.014,-.032,.021]], .0017, ridge);
  tube(heart, [[.004,.001,.031],[.017,.004,.027],[.028,.015,.021]], .0012, ridge);

  const clipboard = target('clipboard', point(-.33,.98,.105));
  clipboard.rotation.set(-.07, .18, .10);
  function roundedPlate(parent, w, h, radius, depth, surface, z) {
    const shape = new THREE.Shape();
    const a = -w/2, b = -h/2;
    shape.moveTo(a+radius,b);
    shape.lineTo(-a-radius,b);
    shape.quadraticCurveTo(-a,b,-a,b+radius);
    shape.lineTo(-a,-b-radius);
    shape.quadraticCurveTo(-a,-b,-a-radius,-b);
    shape.lineTo(a+radius,-b);
    shape.quadraticCurveTo(a,-b,a,-b-radius);
    shape.lineTo(a,b+radius);
    shape.quadraticCurveTo(a,b,a+radius,b);
    const face = mesh(parent, new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelSegments: 2, bevelSize: .0012,
      bevelThickness: .001, curveSegments: 4,
    }), surface);
    face.position.z = z;
    return face;
  }
  roundedPlate(clipboard,.191,.267,.011,.008,material(0x1848c1),-.004);
  roundedPlate(clipboard,.162,.228,.004,.002,material(0xf0f4ff),.005);
  const steel = material(0xb0bccb,{metalness:.65,roughness:.32});
  const clip = roundedPlate(clipboard,.071,.025,.006,.004,steel,.008);
  clip.position.y=.112;
  const clipLip = mesh(clipboard, new THREE.BoxGeometry(.06,.004,.004),material(0x52647c));
  clipLip.position.set(0,.1,.014);
  const ink = material(0x9aafcf);
  const blueInk = material(0x3465bb);
  const line = (w,h,x,y,surface) => {
    const rule = mesh(clipboard,new THREE.BoxGeometry(w,h,.0007),surface);
    rule.position.set(x,y,.009);
  };
  line(.064,.005,-.034,.074,blueInk);
  for (let i=0; i<4; i++) {
    line(.119-.009*(i%2),.002,-.006,.053-i*.012,ink);
  }
  // An engraved pulse line lends the board a medical cue at small screen sizes.
  tube(clipboard,[[-.06,-.041,.009],[-.031,-.041,.009],[-.021,-.036,.009],[-.014,-.046,.009],[-.006,-.016,.009],[.001,-.062,.009],[.013,-.034,.009],[.023,-.041,.009],[.061,-.041,.009]],.0015,blueInk,36);
  return {group,targets};
}
