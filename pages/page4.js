import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// === Create Scene ===
const scene = new THREE.Scene();

// === Create Primary Camera ===
const camera1 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera1.position.set(0, 2, 5);

// === Create Second Camera (Orbit View) ===
const camera2 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera2.position.set(15, 10, 15);
camera2.lookAt(0, 2.5, 0);

scene.add(camera1);
scene.add(camera2); // Optional, if using orbit view camera

const audioListener = new THREE.AudioListener();
camera1.add(audioListener); // Attach to main camera only

// === Create Renderer ===
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Add Lights ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// === Create Materials ===
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xb0c4de, side: THREE.DoubleSide });
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xE6E4D8, side: THREE.DoubleSide });
const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f5 });
const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5A2B });
const dishMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });   // white
const bowlMaterial = new THREE.MeshStandardMaterial({
  color: 0xdddddd,
  side: THREE.DoubleSide // <-- This makes both inside and outside visible
});



// === Create Room (Planes) ===
// Floor (Double-Sided)
const floor = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 10), floorMaterial);
floor.position.y = -0.05; 
scene.add(floor);

// Ceiling (One-Sided)
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), ceilingMaterial);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.set(0, 5, 0);
scene.add(ceiling);

// Back Wall
const backWall = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 0.1), wallMaterial);
backWall.position.set(0, 2.5, -4.95);
scene.add(backWall);

// Right Wall
const rightWall = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 0.1), wallMaterial);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(4.95, 2.5, 0);
scene.add(rightWall);

// Left Wall
const leftWall = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 0.1), wallMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-4.95, 2.5, 0);
scene.add(leftWall);

// =======================phòng bếp=======================
    // tạo bàn 
    const tableGroup2 = new THREE.Group();
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.15, 3), tableMaterial);
    tableTop.position.set(0, 1.2, 0);  // nâng mặt bàn lên y = 1.5
    tableGroup2.add(tableTop);
    const legPositions = [
        [-0.7, 0.55, -1.3],   // chân bàn đặt y = 0.85
        [0.7, 0.55, -1.3],
        [-0.7, 0.55, 1.3],
        [0.7, 0.55, 1.3]
    ];
    const tableLegs = legPositions.map(pos => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.1), tableMaterial);
        leg.position.set(...pos);
        tableGroup2.add(leg);
        return leg;
    });
    tableGroup2.position.set(0,0,0);
    scene.add(tableGroup2);

// === Chair Material ===
const chairMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });

// === Create Chair Function ===
function createChair(x, z, rotationY) {
  const seatWidth = 0.6;   // wider
  const seatDepth = 0.6;   // deeper
  const seatHeight = 0.1;
  const seatY = 0.9;       // lower to better height

  // Seat
  const seat = new THREE.Mesh(new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth), chairMaterial);
  seat.position.set(x, 0.8, z);
  seat.rotation.y = rotationY;
  scene.add(seat);

  // Backrest (lowered height)
  const backrestHeight = 0.8;
  const backrestDepth = 0.05;
  const backrest = new THREE.Mesh(
    new THREE.BoxGeometry(seatWidth * 0.9, backrestHeight, backrestDepth),
    chairMaterial
  );
  backrest.position.set(
    x - (seatDepth / 2 - backrestDepth / 2) * Math.sin(rotationY),
    seatY + (backrestHeight / 2)-0.1,
    z - (seatDepth / 2 - backrestDepth / 2) * Math.cos(rotationY)
  );
  backrest.rotation.y = rotationY;
  scene.add(backrest);

  // Chair Legs (shorter height)
  const legHeight = 0.8;
  const legWidth = 0.05;
  const legOffsets = [
    [-seatWidth / 2 + legWidth / 2, -seatDepth / 2 + legWidth / 2],
    [ seatWidth / 2 - legWidth / 2, -seatDepth / 2 + legWidth / 2],
    [-seatWidth / 2 + legWidth / 2,  seatDepth / 2 - legWidth / 2],
    [ seatWidth / 2 - legWidth / 2,  seatDepth / 2 - legWidth / 2]
  ];
  legOffsets.forEach(offset => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(legWidth, legHeight, legWidth), chairMaterial);
    const offsetX = offset[0] * Math.cos(rotationY) - offset[1] * Math.sin(rotationY);
    const offsetZ = offset[0] * Math.sin(rotationY) + offset[1] * Math.cos(rotationY);
    leg.position.set(x + offsetX, legHeight / 2, z + offsetZ);
    scene.add(leg);
  });
}

// === Place 2 Chairs on Each Long Side of Table ===
// Table is centered at (0, 0, 0), approx size 1.85 x 3 (width x depth)
const chairDistanceX = 1.1;   // to left/right of table
const chairOffsetZ = 0.6;     // chair separation along Z axis (long side)

createChair(chairDistanceX, -chairOffsetZ, -Math.PI / 2);  // right side front
createChair(chairDistanceX,  chairOffsetZ, -Math.PI / 2);  // right side back

createChair(-chairDistanceX, -chairOffsetZ, Math.PI / 2);  // left side front
createChair(-chairDistanceX,  chairOffsetZ, Math.PI / 2);  // left side back

function addDiningSet(x, z, rotationY) {
  const tableSurfaceY = 1.2 + 0.075;

  // Dish
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 32), dishMaterial);
  dish.position.set(x, tableSurfaceY + 0.01, z);
  dish.rotation.x = Math.PI;
  scene.add(dish);

  // Bowl
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), bowlMaterial);
  bowl.position.set(x, tableSurfaceY + 0.17, z);
  bowl.rotation.x = Math.PI; // Flip it upright
  bowl.rotation.y = rotationY; // Align with dish orientation
  scene.add(bowl);

}

addDiningSet(0.55, -0.6, -Math.PI / 2);  // right side front
addDiningSet(0.55,  0.6, -Math.PI / 2);  // right side back
addDiningSet(-0.55, -0.6, Math.PI / 2);  // left side front
addDiningSet(-0.55,  0.6, Math.PI / 2);  // left side back

// Add countertop to right corner
const counterGeometry = new THREE.BoxGeometry(1.5, 1.7, 6);
const counterMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const counter = new THREE.Mesh(counterGeometry, counterMaterial);
counter.position.set(4.2, 0.85, -1.95);
scene.add(counter);

// === Seasoning Jars (Right Side of Stove) ===
const seasoningGroup = new THREE.Group();

// Salt Jar (small cylinder)
const saltGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 32);
const saltMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const saltJar = new THREE.Mesh(saltGeometry, saltMaterial);
saltJar.position.set(0, 0.1, 0);
seasoningGroup.add(saltJar);

// Pepper Jar (darker)
const pepperGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 32);
const pepperMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const pepperJar = new THREE.Mesh(pepperGeometry, pepperMaterial);
pepperJar.position.set(0.15, 0.1, 0);
seasoningGroup.add(pepperJar);

// Soy Sauce Bottle (taller, thinner)
const soyGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 32);
const soyMaterial = new THREE.MeshStandardMaterial({ color: 0x442200 });
const soyBottle = new THREE.Mesh(soyGeometry, soyMaterial);
soyBottle.position.set(0.3, 0.175, 0);
seasoningGroup.add(soyBottle);

// Cooking Oil Bottle (tall, yellowish)
const oilGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.35, 32);
const oilMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
const oilBottle = new THREE.Mesh(oilGeometry, oilMaterial);
oilBottle.position.set(0.45, 0.175, 0);
seasoningGroup.add(oilBottle);

// Optional: Small tin can (box)
const canGeometry = new THREE.BoxGeometry(0.1, 0.15, 0.1);
const canMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
const can = new THREE.Mesh(canGeometry, canMaterial);
can.position.set(0.6, 0.075, 0);
seasoningGroup.add(can);

// Position the whole group to the right of the stove on countertop
seasoningGroup.position.set(4, 1.7, -0.5);  // X=right of stove, Y=on top, Z=back corner
scene.add(seasoningGroup);

// === Cutting Board ===
const boardGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.7);
const boardMaterial = new THREE.MeshStandardMaterial({ color: 0xdeb887 }); // Wood-like color
const cuttingBoard = new THREE.Mesh(boardGeometry, boardMaterial);
cuttingBoard.position.set(4, 1.72, -3.3); // Slightly to the left side of stove
cuttingBoard.castShadow = true;
cuttingBoard.receiveShadow = true;
scene.add(cuttingBoard);

    // fridge
    function createModernWhiteFridge() {
      const fridge = new THREE.Group();
    // body
      const bodyGeometry = new THREE.BoxGeometry(1, 2.2, 0.7);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.3 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      fridge.add(body);
      // door
      const doorThickness = 0.1;
      const doorHeight = 0.8;
      const doorGeometry = new THREE.BoxGeometry(0.98, doorHeight, doorThickness);
      const doorGeometry1 = new THREE.BoxGeometry(0.98, doorHeight + 0.4, doorThickness);
      const doorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.6, roughness: 0.2 });
      const upperDoor = new THREE.Mesh(doorGeometry, doorMaterial);
      upperDoor.position.set(0, 0.65, 0.36);
      fridge.add(upperDoor);
      const lowerDoor = new THREE.Mesh(doorGeometry1, doorMaterial);
      lowerDoor.position.set(0, -0.45, 0.36);
      fridge.add(lowerDoor);
      const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.55, 16);
      const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 1.0, roughness: 0.3 });
      const upperHandle = new THREE.Mesh(handleGeometry, handleMaterial);
      upperHandle.position.set(0.4, 0.55, 0.4);
      upperHandle.rotation.y = Math.PI / 2;
      fridge.add(upperHandle);
      // handle
      const lowerHandle = new THREE.Mesh(handleGeometry, handleMaterial);
      lowerHandle.position.set(0.4, -0.55, 0.4);
      lowerHandle.rotation.y = Math.PI / 2;
      fridge.add(lowerHandle);
      return fridge;
    }

const fridge = createModernWhiteFridge();
fridge.scale.set(1.5, 1.5, 1.5); 
fridge.position.set(1, 1.6,-4.4);
scene.add(fridge);

// Add sink
const sinkGeometry = new THREE.BoxGeometry(1, 1.5, 0.7);
const sinkMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const sink = new THREE.Mesh(sinkGeometry, sinkMaterial);
sink.position.set(3, 0.75,-4.55);
scene.add(sink);

// === Sink Basin Walls (on top of sink base) ===
const basinWallMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
const wallThickness = 0.05;
const wallHeight = 0.15;

// Rear wall of basin (against the back edge of sink)
const basinRear = new THREE.Mesh(
  new THREE.BoxGeometry(1, wallHeight, wallThickness),
  basinWallMaterial
);
basinRear.position.set(3, 1.5 + wallHeight / 2, -4.9 + wallThickness / 2);
scene.add(basinRear);

// Front wall of basin (front edge of sink)
const basinFront = new THREE.Mesh(
  new THREE.BoxGeometry(1, wallHeight, wallThickness),
  basinWallMaterial
);
basinFront.position.set(3, 1.5 + wallHeight / 2, -4.2 - wallThickness / 2);
scene.add(basinFront);

// Left edge of basin
const basinLeftEdge = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, wallHeight, 0.7),
  basinWallMaterial
);
basinLeftEdge.position.set(2.5 + wallThickness / 2, 1.5 + wallHeight / 2, -4.55);
scene.add(basinLeftEdge);

// Right edge of basin
const basinRightEdge = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, wallHeight, 0.7),
  basinWallMaterial
);
basinRightEdge.position.set(3.45 - wallThickness / 2, 1.5 + wallHeight / 2, -4.55);
scene.add(basinRightEdge);

const loader = new GLTFLoader();

loader.load('models/faucet_2.glb', (gltf) => {
  const faucet = gltf.scene;

  faucet.scale.set(0.1, 0.1, 0.1);
  faucet.position.set(0, 3, 0);

  faucet.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(faucet);
});


// Add fan
const fanMaterial = new THREE.MeshStandardMaterial({ color: 0xCCCCCC });
    const fanBody = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3), fanMaterial);
    fanBody.position.set(0, 4.85, 0);
    scene.add(fanBody);
    const bladeGeometry = new THREE.BoxGeometry(4, 0.05, 0.4);
    for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(bladeGeometry, fanMaterial);
        blade.rotation.y = (i * Math.PI) / 2;
        fanBody.add(blade);
    }

    // === Create Bulb Fixture ===

// Bulb base
const bulbBaseGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.25, 32);
const bulbBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const bulbBase = new THREE.Mesh(bulbBaseGeometry, bulbBaseMaterial);
bulbBase.rotation.z = Math.PI / 2;
bulbBase.position.set(4.85, 3.8, -1.5); 
scene.add(bulbBase);

const bulbGeometry = new THREE.SphereGeometry(0.18, 16, 64);
const bulbMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffa0, // Warm yellow tint
  transparent: true,
  opacity: 0.9,
  transmission: 0.95, // High transmission for glass-like effect
  roughness: 0.1, // Smooth surface
  metalness: 0.0, // Non-metallic
  clearcoat: 0.5, // Subtle coating
  emissive: 0xffffa0, // Soft glow
  emissiveIntensity: 0.3,
  side: THREE.DoubleSide
});
const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
bulb.position.set(4.65, 3.8, -1.5);
scene.add(bulb);

// Update PointLight
const bulbLight = new THREE.PointLight(0xffffa0, 4, 25, 1);
bulbLight.position.set(4, 3.8, -1.5);
bulbLight.castShadow = true;
bulbLight.shadow.mapSize.set(2048, 2048);
bulbLight.shadow.bias = -0.001;
bulbLight.shadow.camera.near = 0.1;
bulbLight.shadow.camera.far = 30;
scene.add(bulbLight);

// receives shadows
floor.receiveShadow = true;
floor.receiveShadow = true;
backWall.receiveShadow = true;
rightWall.receiveShadow = true;
leftWall.receiveShadow = true;
ceiling.receiveShadow = true;

// cast shadows
tableTop.castShadow = true;
tableLegs.forEach(leg => leg.castShadow = true);

fridge.castShadow = true;
sink.castShadow = true;
counter.castShadow = true;

scene.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


// === Orbit Controls for Camera 2 ===
const controls = new OrbitControls(camera2, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.maxPolarAngle = Math.PI;
controls.enabled = false;

// === Active Camera ===
let activeCamera = camera1;

window.addEventListener('keydown', (event) => {
  if (event.key === 'c') {
    // Detach listener from current camera
    activeCamera.remove(audioListener);

    // Switch active camera
    if (activeCamera === camera1) {
      activeCamera = camera2;
      controls.enabled = true;
    } else {
      activeCamera = camera1;
      controls.enabled = false;
    }

    // Attach listener to new active camera
    activeCamera.add(audioListener);

    console.log(`Switched to ${activeCamera === camera1 ? 'inside' : 'outside'} camera`);
  }
});

// === Resize Handler ===
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera1.aspect = window.innerWidth / window.innerHeight;
  camera1.updateProjectionMatrix();
  camera2.aspect = window.innerWidth / window.innerHeight;
  camera2.updateProjectionMatrix();
});

// Gas stove on countertop
const stoveMaterial = new THREE.MeshStandardMaterial({ color: 0x123456 });

// Stove base
const stoveBaseGeometry = new THREE.BoxGeometry(1, 0.2, 1.5); 
const stoveBase = new THREE.Mesh(stoveBaseGeometry, stoveMaterial);
stoveBase.position.set(4.25, 1.7, -1.8); // On countertop
stoveBase.castShadow = true;
stoveBase.receiveShadow = true;
scene.add(stoveBase);

// Burners 
const burnerGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.02, 64);
const burnerPositions = [
  [0.1, 0.11, 0.4], // Right burner
  [0.1, 0.11, -0.4]   // Left burner
];
burnerPositions.forEach(pos => {
  const burner = new THREE.Mesh(burnerGeometry, stoveMaterial);
  burner.position.set(4.25 + pos[0], 1.7 + pos[1], -1.8 + pos[2]);
  burner.castShadow = true;
  burner.receiveShadow = true;
  scene.add(burner);
});

// Knobs (2)
const knobGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.06, 32);
const knobPositions = [
  [-0.35, 0.11, 0.4], // Right knob
  [-0.35, 0.11, -0.4]   // Left knob
];
knobPositions.forEach(pos => {
  const knob = new THREE.Mesh(knobGeometry, stoveMaterial);
  knob.position.set(4.2 + pos[0], 1.7 + pos[1], -1.8 + pos[2]);
  knob.castShadow = true;
  knob.receiveShadow = true;
  scene.add(knob);
});

// Flames 
const flameMaterial = new THREE.MeshBasicMaterial({
  color: 0xff4500, // Orange-red flame
  transparent: true,
  opacity: 0.7,
  side: THREE.DoubleSide
});
const flameGeometry = new THREE.ConeGeometry(0.028, 0.18, 8); 
const flameGroups = [];
burnerPositions.forEach((pos, burnerIndex) => {
  const flameGroup = new THREE.Group();
  const numFlames = 20;
  const radius = 0.3; 
  for (let i = 0; i < numFlames; i++) {
    const angle = (i / numFlames) * Math.PI * 2;
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.position.set(
      radius * Math.cos(angle),
      0.075, 
      radius * Math.sin(angle)
    );
    flameGroup.add(flame);
  }
  flameGroup.position.set(4.25 + pos[0], 1.71, -1.8 + pos[2]); // Above burner
  scene.add(flameGroup);
  flameGroups.push(flameGroup);
});

// === Frying Pan Group ===
const panGroup = new THREE.Group();

// Create pan material
const panMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide });

// Bottom
const panBottomGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.05, 32); 
const panBottom = new THREE.Mesh(panBottomGeometry, panMaterial);
panBottom.position.set(0, 0, 0);
panBottom.castShadow = true;
panBottom.receiveShadow = true;
panGroup.add(panBottom);

// Wall
const panWallGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 32, 1, true); 
const panWall = new THREE.Mesh(panWallGeometry, panMaterial);
panWall.position.set(0, 0.025, 0);
panWall.castShadow = true;
panWall.receiveShadow = true;
panGroup.add(panWall);

// Handle
const handleGeometry = new THREE.BoxGeometry(0.3, 0.03, 0.05); 
const handle = new THREE.Mesh(handleGeometry, panMaterial);
handle.position.set(-0.3, 0.025, 0.2);
handle.rotation.y = Math.PI / 6;
handle.castShadow = true;
handle.receiveShadow = true;
panGroup.add(handle);

// Position entire pan group above the burner
panGroup.position.set(4.35, 1.835, -2.2);
scene.add(panGroup);

const sizzleSound = new THREE.PositionalAudio(audioListener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load('sounds/sizzlingSound.mp3', function(buffer) {
  sizzleSound.setBuffer(buffer);
  sizzleSound.setLoop(true);
  sizzleSound.setVolume(3);
  sizzleSound.setRefDistance(1.5); // How fast it fades with distance
  sizzleSound.play();
});

// Attach to pan group so it follows pan position
panGroup.add(sizzleSound);

// Stock pot on right burner
const potMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide });
const potBottomGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.05, 32); 
const potBottom = new THREE.Mesh(potBottomGeometry, potMaterial);
potBottom.position.set(4.25 + 0.1, 1.81 + 0.025, -1.8 + 0.4); // Above right burner
potBottom.castShadow = true;
potBottom.receiveShadow = true;
scene.add(potBottom);
const potWallGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.4, 32, 1, true); 
const potWall = new THREE.Mesh(potWallGeometry, potMaterial);
potWall.position.set(4.25 + 0.1, 1.81 + 0.2, -1.8 + 0.4);
potWall.castShadow = true;
potWall.receiveShadow = true;
scene.add(potWall);
const handle1Geometry = new THREE.BoxGeometry(0.15, 0.05, 0.05); // Handle 1
const handle1 = new THREE.Mesh(handle1Geometry, panMaterial);
handle1.position.set(4.25 + 0.1, 1.81 + 0.3, -1.8 + 0.1); // Attached at edge
handle1.castShadow = true;
handle1.receiveShadow = true;
scene.add(handle1);
const handle2Geometry = new THREE.BoxGeometry(0.15, 0.05, 0.05); // Handle 2
const handle2 = new THREE.Mesh(handle2Geometry, panMaterial);
handle2.position.set(4.25 + 0.1, 1.81 + 0.3, -1.8 + 0.7); // Attached at edge
handle2.castShadow = true;
handle2.receiveShadow = true;
scene.add(handle2);

// === Boiling Sound for Stock Pot ===
const boilingSound = new THREE.PositionalAudio(audioListener);
const boilingLoader = new THREE.AudioLoader();
boilingLoader.load('sounds/boiling.mp3', (buffer) => {
  boilingSound.setBuffer(buffer);
  boilingSound.setRefDistance(1);  // Audible range
  boilingSound.setLoop(true);
  boilingSound.setVolume(2);     // Adjust volume as needed
  boilingSound.play();
});

// Attach to the pot (use one part, like potWall)
potWall.add(boilingSound);


// === Steak Shape ===
const steakShape = new THREE.Shape();
steakShape.moveTo(0, 0);
steakShape.bezierCurveTo(1.2, 1.5, 2.5, 1, 2.2, 0);
steakShape.bezierCurveTo(2, -1.2, 1, -1.5, 0, -1);
steakShape.bezierCurveTo(-1, -1.2, -1.5, -0.5, -1.4, 0);
steakShape.bezierCurveTo(-1.5, 1, -0.5, 1.8, 0, 0);

// === Extrude to 3D ===
const steakSettings = {
  depth: 0.1,
  bevelEnabled: true,
  bevelThickness: 0.01,
  bevelSize: 0.01,
  bevelSegments: 2
};

const steakGeometry = new THREE.ExtrudeGeometry(steakShape, steakSettings);

// === Material (raw steak) ===
const steakMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
const steak = new THREE.Mesh(steakGeometry, steakMaterial);

steak.scale.set(0.09, 0.09, 0.045); 
steak.rotation.x = -Math.PI / 2;
steak.rotation.z = Math.PI /2;
steak.position.set(4.35, 1.90, -2.15);

steak.castShadow = true;
steak.receiveShadow = true;
scene.add(steak);

// === Fat Cap ===
const fatCapShape = new THREE.Shape();

// Outer edge 
fatCapShape.moveTo(2.2, 0);
fatCapShape.bezierCurveTo(2, -1.2, 1, -1.5, 0, -1);
fatCapShape.bezierCurveTo(-1, -1.2, -1.5, -0.5, -1.4, 0);

// Inner edge 
fatCapShape.lineTo(-1.4 + 0.1, 0);  // small inward offset
fatCapShape.bezierCurveTo(-1.5 + 0.1, -0.5, -1 + 0.1, -1.2, 0 + 0.1, -1);
fatCapShape.bezierCurveTo(1 + 0.1, -1.5, 2 + 0.1, -1.2, 2.2 - 0.1, 0);

// Close the loop
fatCapShape.lineTo(2.2, 0);

const fatCapSettings = {
  depth: 0.1,
  bevelEnabled: false
};

const fatCapGeometry = new THREE.ExtrudeGeometry(fatCapShape, fatCapSettings);
const fatCapMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const fatCap = new THREE.Mesh(fatCapGeometry, fatCapMaterial);

fatCap.scale.set(0.09, 0.09, 0.045);
fatCap.rotation.x = -Math.PI / 2;
fatCap.rotation.z = Math.PI / 2;
fatCap.position.set(4.36, 1.90, -2.15);

fatCap.castShadow = true;
fatCap.receiveShadow = true;
scene.add(fatCap);





// Boiling water in stock pot
const waterMaterial = new THREE.MeshStandardMaterial({
  color: 0x87ceeb, // Light blue
  transparent: true,
  opacity: 0.8,
  side: THREE.DoubleSide
});
const waterGeometry = new THREE.CylinderGeometry(0.27, 0.27, 0.01, 32); 
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.position.set(4.25 + 0.1, 1.81 + 0.3, -1.8 + 0.4); 
water.castShadow = true;
water.receiveShadow = true;
scene.add(water);

// === Vegetable Chunks in Stock Pot ===
const vegetables = []; // Track for animation

// Carrot slice 
const carrotMaterial = new THREE.MeshStandardMaterial({ color: 0xff8c00 });
const carrotGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.01, 16);
for (let i = 0; i < 4; i++) {
  const slice = new THREE.Mesh(carrotGeometry, carrotMaterial);
  slice.rotation.x = Math.random() * Math.PI; 
  slice.position.set(
    4.35 + (Math.random() - 0.5) * 0.4,
    2.12,
    -1.4 + (Math.random() - 0.5) * 0.4
  );
  slice.castShadow = true;
  slice.receiveShadow = true;
  scene.add(slice);
  vegetables.push(slice);
}

// Celery bit 
const celeryMaterial = new THREE.MeshStandardMaterial({ color: 0x6b8e23 });
const celeryGeometry = new THREE.BoxGeometry(0.04, 0.01, 0.02);
for (let i = 0; i < 3; i++) {
  const chunk = new THREE.Mesh(celeryGeometry, celeryMaterial);
  chunk.rotation.y = Math.random() * Math.PI;
  chunk.position.set(
    4.35 + (Math.random() - 0.5) * 0.35,
    2.12,
    -1.4 + (Math.random() - 0.5) * 0.35
  );
  chunk.castShadow = true;
  chunk.receiveShadow = true;
  scene.add(chunk);
  vegetables.push(chunk);
}

// Onion wedge 
const onionMaterial = new THREE.MeshStandardMaterial({ color: 0xf8f8ff });
const onionGeometry = new THREE.SphereGeometry(0.05, 16, 8, 0, Math.PI / 2, 0, Math.PI / 2);
const onion = new THREE.Mesh(onionGeometry, onionMaterial);
onion.rotation.set(-Math.PI / 2, 0, Math.PI / 4);
onion.position.set(4.35, 2.12, -1.4);
onion.castShadow = true;
onion.receiveShadow = true;
scene.add(onion);
vegetables.push(onion);


        // === Animation loop ===
const animate = () => {
  requestAnimationFrame(animate);

  // Spin the fan
  fanBody.rotation.y += 0.25;

  // Flicker flames
  flameGroups.forEach((group, index) => {
    group.children.forEach((flame, flameIndex) => {
      flame.scale.y = 1 + 0.1 * Math.sin(Date.now() * 0.005 + index + flameIndex * 0.2);
    });
  });

  // Boiling water effect
  const t = Date.now() * 0.003;
  water.position.y = 1.81 + 0.3 + 0.015 * Math.sin(t);

  

  // Bob vegetables 
  vegetables.forEach((veg, i) => {
    const float = 0.005 * Math.sin(t + i); //offset
    veg.position.y = 2.12 + float;
  });

  if (activeCamera === camera2) {
    controls.update();
  }
  renderer.render(scene, activeCamera);
};

animate();
