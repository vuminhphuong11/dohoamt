import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// Khởi tạo scene, camera và renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFAB785);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Tạo sàn nhà
const floorGeometry = new THREE.BoxGeometry(10, 0.1, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xb0aeaa });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.05;
scene.add(floor);

// Tạo tường
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xd0ccc9 });
const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5, 10), wallMaterial);
leftWall.position.set(-5, 2.5, 0);
scene.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5, 10), wallMaterial);
rightWall.position.set(5, 2.5, 0);  
scene.add(rightWall);

const backWall = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 0.1), wallMaterial);
backWall.position.set(0, 2.5, -5);
scene.add(backWall);

// Tạo tường trước với cửa
const frontWallMaterial = new THREE.MeshStandardMaterial({ color: 0xe3dede });
const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry(3, 5, 0.1), frontWallMaterial);
frontWallLeft.position.set(-3.5, 2.5, 5);
scene.add(frontWallLeft);

const frontWallRight = new THREE.Mesh(new THREE.BoxGeometry(4.5, 5, 0.1), frontWallMaterial);
frontWallRight.position.set(2.75, 2.5, 5);
scene.add(frontWallRight);

const frontWallTop = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 0.1), frontWallMaterial);
frontWallTop.position.set(0, 4.5, 5);
scene.add(frontWallTop);

// Tạo cửa
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const door = new THREE.Mesh(new THREE.BoxGeometry(2.75, 4, 0.1), doorMaterial);
door.position.set(-0.2, 2, 5.5);
door.rotation.y = Math.PI / 4; // Cửa mở 45 độ
scene.add(door);

let doorOpen = false;
function toggleDoor() {
    doorOpen = !doorOpen;
    door.rotation.y = doorOpen ? Math.PI / 4 : 0;
    door.position.set(doorOpen ? -0.1 : -0.8, 2, doorOpen ? 5.5 : 5.1);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'e' || event.key === 'E') {
        toggleDoor();
    }
});

// Tạo tường phân chia
const partitionWall = new THREE.Mesh(new THREE.BoxGeometry(3, 5, 0.5), wallMaterial);
partitionWall.position.set(3.5, 2.5, -1);
scene.add(partitionWall);

// Tạo toilet
const toiletMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.1 });
const toiletBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.7, 0.8), toiletMaterial);
toiletBase.position.set(3.5, 0.5, -3);
scene.add(toiletBase);


const toiletTank = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 0.8), toiletMaterial);
toiletTank.position.set(4.5, 1.2, -3);
scene.add(toiletTank);

// Tạo bồn tắm
const bathtubGeometry = new THREE.BoxGeometry(2.0, 0.8, 4.5);
const bathtubMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.1 });
const bathtub = new THREE.Mesh(bathtubGeometry, bathtubMaterial);
bathtub.position.set(3.5, 0.4, 2);
scene.add(bathtub);

// Thêm mặt phẳng nước để mô phỏng độ sâu
const waterGeometry = new THREE.PlaneGeometry(1.8, 4.3);
const waterMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEFA, transparent: true, opacity: 0.5 });
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2; // Đặt mặt phẳng nằm ngang
water.position.set(3.5, 0.6, 2); // Đặt bên trong bồn tắm
scene.add(water);

// Tạo vòi nước và định vị lại
const faucetMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
const faucetBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 32), faucetMaterial);
faucetBase.position.set(3.5, 0.8, -0.25); // Giữa chiều rộng, cạnh sau gần tường
scene.add(faucetBase);

const faucetHandle1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.05), faucetMaterial);
faucetHandle1.position.set(3.3, 0.85, -0.25);
faucetHandle1.rotation.z = Math.PI / 4;
scene.add(faucetHandle1);

const faucetHandle2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.05), faucetMaterial);
faucetHandle2.position.set(3.7, 0.85, -0.25);
faucetHandle2.rotation.z = -Math.PI / 4;
scene.add(faucetHandle2);

// Create light brown cabinet
const cabinetGeometry = new THREE.BoxGeometry(0.8, 2, 4.5); // Width: 2, Height: 1.5, Depth: 0.5
const cabinetMaterial = new THREE.MeshStandardMaterial({ color: 0xD2B48C }); // Light brown color
const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
cabinet.position.set(-4.5, 0, 0); // Positioned against the left wall (x = -4.5), centered at y = 0.75, z = 0
scene.add(cabinet);

// Create mirror above the cabinet
const mirrorGeometry = new THREE.PlaneGeometry(4, 0.5); // Width: 1.5, Height: 1
const mirrorMaterial = new THREE.MeshStandardMaterial({ color: 0xE0E0E0, metalness: 0.9, roughness: 0.1 }); // Reflective material
const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
mirror.position.set(-4.95, 2, 0); // Positioned slightly in front of the wall (x = -4.95), at y = 2, z = 0
mirror.rotation.y = Math.PI; // Rotate to face the room
scene.add(mirror);

// Thêm ánh sáng
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

// Đặt vị trí camera
camera.position.set(0, 2, 12);
camera.lookAt(0, 2, 0);

// Điều khiển camera
const moveSpeed = 0.1;
const keys = {};
let isMouseDown = false;
let prevMouseX = 0;
let prevMouseY = 0;
const sensitivity = 0.002;
const maxPitch = Math.PI / 2.5;
const minPitch = -Math.PI / 2.5;

document.addEventListener('keydown', (event) => { keys[event.key.toLowerCase()] = true; });
document.addEventListener('keyup', (event) => { keys[event.key.toLowerCase()] = false; });

document.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
        isMouseDown = true;
        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }
});

document.addEventListener('mouseup', () => { isMouseDown = false; });

document.addEventListener('mousemove', (event) => {
    if (!isMouseDown) return;

    const deltaX = event.clientX - prevMouseX;
    const deltaY = event.clientY - prevMouseY;

    camera.rotation.y -= deltaX * sensitivity;
    camera.rotation.x = Math.max(minPitch, Math.min(maxPitch, camera.rotation.x - deltaY * sensitivity));

    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
});

function updateCameraPosition() {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, forward).normalize();

    if (keys['w']) camera.position.addScaledVector(forward, moveSpeed);
    if (keys['s']) camera.position.addScaledVector(forward, -moveSpeed);
    if (keys['d']) camera.position.addScaledVector(right, -moveSpeed);
    if (keys['a']) camera.position.addScaledVector(right, moveSpeed);
}

// Vòng lặp render
function animate() {
    requestAnimationFrame(animate);
    updateCameraPosition();
    renderer.render(scene, camera);
}
animate();
