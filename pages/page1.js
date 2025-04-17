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
const leftwallMaterial = new THREE.MeshStandardMaterial({ color: 0xd0ccc9 });
const rightwallMaterial = new THREE.MeshStandardMaterial({ color: 0xd0ccc9 });
const backwallMaterial = new THREE.MeshStandardMaterial({ color: 0xe3dede });

const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5, 10), leftwallMaterial);
leftWall.position.set(-5, 2.5, 0);
scene.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5, 10), rightwallMaterial);
rightWall.position.set(5, 2.5, 0);  
scene.add(rightWall);

const backWall = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 0.1), backwallMaterial);
backWall.position.set(0, 2.5, -5);
scene.add(backWall);

// Tạo bức tường có cửa trước mặt
const frontWallMaterial = new THREE.MeshStandardMaterial({ color: 0xe3dede });
const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry(3, 5, 0.1), frontWallMaterial);
frontWallLeft.position.set(-3.5, 2.5, 5);
scene.add(frontWallLeft);

const frontWallRight = new THREE.Mesh(new THREE.BoxGeometry(4.5, 5, 0.1), frontWallMaterial);
frontWallRight.position.set(2.75, 2.5, 5);
scene.add(frontWallRight);

// Tạo phần tường trên cửa
const frontWallTop = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 0.1), frontWallMaterial);
frontWallTop.position.set(0, 4.5, 5);
scene.add(frontWallTop);

// Tạo cửa mở
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

// Tạo tường chia phòng bên phải 30-70
const partitionWallMaterial = new THREE.MeshStandardMaterial({ color: 0xd0ccc9 });
const partitionWall = new THREE.Mesh(new THREE.BoxGeometry(3, 5, 0.5), partitionWallMaterial);
partitionWall.position.set(3.5, 2.5, -1);
scene.add(partitionWall);

// Tạo trần nhà
const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xbbb9b5 });
const ceiling = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 10), ceilingMaterial);
ceiling.position.y = 5;
scene.add(ceiling);

// Tạo bồn tắm
const bathtubLength = 4.5;
const bathtubWidth = 2.0;
const bathtubHeight = 0.8;
const bathtubDepth = 0.6; // Độ sâu của vùng trũng bên trong

const bathtubShape = new THREE.Shape();
const radius = 0.3;
bathtubShape.moveTo(-bathtubWidth / 2 + radius, -bathtubLength / 2);
bathtubShape.lineTo(bathtubWidth / 2 - radius, -bathtubLength / 2);
bathtubShape.quadraticCurveTo(bathtubWidth / 2, -bathtubLength / 2, bathtubWidth / 2, -bathtubLength / 2 + radius);
bathtubShape.lineTo(bathtubWidth / 2, bathtubLength / 2 - radius);
bathtubShape.quadraticCurveTo(bathtubWidth / 2, bathtubLength / 2, bathtubWidth / 2 - radius, bathtubLength / 2);
bathtubShape.lineTo(-bathtubWidth / 2 + radius, bathtubLength / 2);
bathtubShape.quadraticCurveTo(-bathtubWidth / 2, bathtubLength / 2, -bathtubWidth / 2, bathtubLength / 2 - radius);
bathtubShape.lineTo(-bathtubWidth / 2, -bathtubLength / 2 + radius);
bathtubShape.quadraticCurveTo(-bathtubWidth / 2, -bathtubLength / 2, -bathtubWidth / 2 + radius, -bathtubLength / 2);

const extrudeSettings = { 
    depth: bathtubHeight, 
    bevelEnabled: true, 
    bevelSize: 0.1, 
    bevelThickness: 0.1 
};

const bathtubGeometry = new THREE.ExtrudeGeometry(bathtubShape, extrudeSettings);
const bathtubMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.1 });
const bathtub = new THREE.Mesh(bathtubGeometry, bathtubMaterial);
bathtub.rotation.set(-Math.PI / 2, -Math.PI, 0);
bathtub.position.set(3.5, 1, 2);

// Tạo vùng trũng bên trong
const innerShape = new THREE.Shape();
innerShape.moveTo(-bathtubWidth / 2 + 0.2, -bathtubLength / 2 + 0.2);
innerShape.lineTo(bathtubWidth / 2 - 0.2, -bathtubLength / 2 + 0.2);
innerShape.lineTo(bathtubWidth / 2 - 0.2, bathtubLength / 2 - 0.2);
innerShape.lineTo(-bathtubWidth / 2 + 0.2, bathtubLength / 2 - 0.2);
innerShape.lineTo(-bathtubWidth / 2 + 0.2, -bathtubLength / 2 + 0.2);

const innerExtrudeSettings = { depth: bathtubDepth, bevelEnabled: false };
const innerGeometry = new THREE.ExtrudeGeometry(innerShape, innerExtrudeSettings);
const innerMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
const innerBathtub = new THREE.Mesh(innerGeometry, innerMaterial);
innerBathtub.rotation.set(-Math.PI / 2, -Math.PI, 0);
innerBathtub.position.set(3.5, 1.1, 2); // Đặt vùng trũng vào trong bồn

scene.add(bathtub);
scene.add(innerBathtub);

// Thêm ánh sáng
const ambientLight = new THREE.AmbientLight(0xffffff, 3); // Tăng cường độ sáng
scene.add(ambientLight);

// Đặt vị trí camera
camera.position.set(0, 2, 12);// Đặt camera cách xa để nhìn thấy toàn bộ căn phòng
camera.lookAt(0, 2, 0);

// Biến điều khiển
const moveSpeed = 0.1;
const keys = {};
let isMouseDown = false;
let prevMouseX = 0;
let prevMouseY = 0;
const sensitivity = 0.002;
const maxPitch = Math.PI / 2.5; // Giới hạn góc nhìn lên xuống
const minPitch = -Math.PI / 2.5;

// Xử lý phím bấm
document.addEventListener('keydown', (event) => { keys[event.key.toLowerCase()] = true; });
document.addEventListener('keyup', (event) => { keys[event.key.toLowerCase()] = false; });

// Xử lý chuột
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

    camera.rotation.y -= deltaX * sensitivity; // Quay trái/phải
    camera.rotation.x = Math.max(minPitch, Math.min(maxPitch, camera.rotation.x - deltaY * sensitivity)); // Giới hạn góc nhìn

    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
});

// Cập nhật vị trí camera theo phím bấm
function updateCameraPosition() {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; // Giữ camera không bị nhấc lên/xuống khi đi
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
