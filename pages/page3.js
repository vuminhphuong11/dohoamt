//Vũ Minh Phương 20224290
import * as THREE from 'three';
import { OrbitControls } from '/OrbitControls.js';
import { TeapotGeometry } from "/TeapotGeometry.js";
// phòng khách
export function init(container) {
    container.innerHTML = ''; // Xóa nội dung cũ
    //tạo Scene
    const scene = new THREE.Scene();
    //camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(7, 7, 7);
    camera.lookAt(0,4,0);
    //renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    //điều khiển camera bằng chuột(orbitcontrol trong three)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.5, 0);
    controls.update();
    //ánh sáng
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 5, 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 10;
    scene.add(directionalLight);
    //background
    const textureLoader2 = new THREE.TextureLoader();
    textureLoader2.load('./background.jpg', (texture) => {
        scene.background = texture;
    });
    // ================Sàn nhà===============
    const texLoader = new THREE.TextureLoader()
    // thêm sàn nhà
    const woodTex = texLoader.load('sannha1.jpg');
    woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
    woodTex.repeat.set(4, 4);
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(13, 13),
        new THREE.MeshStandardMaterial({ map: woodTex })
    )
    floor.rotation.x = -Math.PI/2;
    floor.receiveShadow = true;
    scene.add(floor);
    // =================Tường===============
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xCCCCCC,
        side: THREE.DoubleSide
    });
    const wallGeometry = new THREE.PlaneGeometry(13, 6.5);
    const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
    frontWall.position.set(0,3.25, -6.5);
    scene.add(frontWall);
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-6.5, 3.25, 0);
    scene.add(leftWall);
//     // =================Bàn===================
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const tableGeometry = new THREE.BoxGeometry(3.3, 0.35, 1.9);
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(0, 1, 0);
    table.castShadow = true;
    table.receiveShadow = true;
    const undertableGeometry = new THREE.BoxGeometry(2.5, 0.1, 1.5);
    const undertable = new THREE.Mesh(undertableGeometry, tableMaterial);
    undertable.position.set(0, 0.4, 0);
    undertable.castShadow = true;
    undertable.receiveShadow = true;
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1);
    const legs = [];
    for (let i of [-1.2, 1.2]) {
        for (let j of [-0.7, 0.7]) {
            const leg = new THREE.Mesh(legGeometry, tableMaterial);
            leg.position.set(i, 0.5, j);
            leg.castShadow = true;
            legs.push(leg);
        }
    }
    const tableGroup = new THREE.Group();
    tableGroup.add(table);
    tableGroup.add(undertable);
    legs.forEach(leg => tableGroup.add(leg));
    tableGroup.position.set(1.5, 0, 2.5);//0.3,0,0.5
    scene.add(tableGroup);
//     // =====================Sofa==========================
    const sofaMaterial = new THREE.MeshStandardMaterial({color: 0xf5f5f5, roughness: 0.3, metalness: 0.05});
    const cushionMaterial = new THREE.MeshStandardMaterial({ color: 0xd19c73, roughness: 0.5, metalness: 0.05 });
    const seatGeometry = new THREE.BoxGeometry(3.8, 0.6, 1.6);
    const seat = new THREE.Mesh(seatGeometry, cushionMaterial);
    seat.position.set(0, 0.5, 0);
    seat.castShadow = true;
    seat.receiveShadow = true;
    const backRestGeometry = new THREE.BoxGeometry(3.8, 1, 0.3);
    const backRest = new THREE.Mesh(backRestGeometry, cushionMaterial);
    backRest.position.set(0, 1.3, 0.65);
    backRest.castShadow = true;
    backRest.receiveShadow = true;
    const armRestGeometry = new THREE.BoxGeometry(0.3, 1, 1.8);
    const armRestLeft = new THREE.Mesh(armRestGeometry, cushionMaterial);
    armRestLeft.position.set(-2, 0.7, 0);
    armRestLeft.castShadow = true;
    armRestLeft.receiveShadow = true;
    const armRestRight = new THREE.Mesh(armRestGeometry, cushionMaterial);
    armRestRight.position.set(2, 0.7, 0);
    armRestRight.castShadow = true;
    armRestRight.receiveShadow = true;
    const legGeometry1 = new THREE.CylinderGeometry(0.1, 0.1, 0.2);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2F4F4F });
    const legFrontLeft = new THREE.Mesh(legGeometry1, legMaterial);
    legFrontLeft.position.set(-1.5, 0.1, 0.7);
    legFrontLeft.castShadow = true;
    legFrontLeft.receiveShadow = false; 
    const legFrontRight = new THREE.Mesh(legGeometry1, legMaterial);
    legFrontRight.position.set(1.5, 0.1, 0.7);
    legFrontRight.castShadow = true;
    legFrontRight.receiveShadow = false; 
    const legBackLeft = new THREE.Mesh(legGeometry1, legMaterial);
    legBackLeft.position.set(-1.5, 0.1, -0.7);
    legBackLeft.castShadow = true;
    legBackLeft.receiveShadow = false; 
    const legBackRight = new THREE.Mesh(legGeometry1, legMaterial);
    legBackRight.position.set(1.5, 0.1, -0.7);
    legBackRight.castShadow = true;
    legBackRight.receiveShadow = false; 
    const cushionGeometry = new THREE.BoxGeometry(1.6, 0.2, 1.1);
    const cushionLeft = new THREE.Mesh(cushionGeometry, cushionMaterial);
    cushionLeft.position.set(-0.85, 0.9, -0.15);
    cushionLeft.castShadow = true;
    cushionLeft.receiveShadow = true;
    const cushionRight = new THREE.Mesh(cushionGeometry, cushionMaterial);
    cushionRight.position.set(0.85, 0.9, -0.15);
    cushionRight.castShadow = true;
    cushionRight.receiveShadow = true;
    const sofa = new THREE.Group();
    sofa.add(seat, backRest, armRestLeft, armRestRight,
             legFrontLeft, legFrontRight, legBackLeft, legBackRight,
             cushionLeft, cushionRight);
    sofa.position.set(1.5, 0, 5.5);
    scene.add(sofa);
    // ===================Sofa nhỏ====================
    const seatGeometry2 = new THREE.BoxGeometry(1.9, 0.6, 1.6);
    const seat2 = new THREE.Mesh(seatGeometry2, cushionMaterial);
    seat2.position.set(0, 0.5, 0);
    seat2.castShadow = true;
    seat2.receiveShadow = true;
    const backRestGeometry2 = new THREE.BoxGeometry(1.9, 1, 0.3);
    const backRest2 = new THREE.Mesh(backRestGeometry2, cushionMaterial);
    backRest2.position.set(0, 1.3, 0.65);
    backRest2.castShadow = true;
    backRest2.receiveShadow = true;
    const armRestLeft2 = new THREE.Mesh(armRestGeometry, cushionMaterial);
    armRestLeft2.position.set(-1, 0.7, 0);
    armRestLeft2.castShadow = true;
    armRestLeft2.receiveShadow = true;
    const armRestRight2 = new THREE.Mesh(armRestGeometry, cushionMaterial);
    armRestRight2.position.set(1, 0.7, 0);
    armRestRight2.castShadow = true;
    armRestRight2.receiveShadow = true;
    const legFrontLeft2 = new THREE.Mesh(legGeometry1, legMaterial);
    legFrontLeft2.position.set(-1, 0.1, 0.7);
    legFrontLeft2.castShadow = true;
    legFrontLeft2.receiveShadow = false;
    const legFrontRight2 = new THREE.Mesh(legGeometry1, legMaterial);
    legFrontRight2.position.set(1, 0.1, 0.7);
    legFrontRight2.castShadow = true;
    legFrontRight2.receiveShadow = false; 
    const legBackLeft2 = new THREE.Mesh(legGeometry1, legMaterial);
    legBackLeft2.position.set(-1, 0.1, -0.7);
    legBackLeft2.castShadow = true;
    legBackLeft2.receiveShadow = false;
    const legBackRight2 = new THREE.Mesh(legGeometry1, legMaterial);
    legBackRight2.position.set(1, 0.1, -0.7);
    legBackRight2.castShadow = true;
    legBackRight2.receiveShadow = false; 
    const cushion = new THREE.Mesh(cushionGeometry, cushionMaterial);
    cushion.position.set(0, 0.9, -0.15);
    cushion.castShadow = true;
    cushion.receiveShadow = true;
    const sofa2 = new THREE.Group();
    sofa2.add(seat2, backRest2, armRestLeft2, armRestRight2,
              legFrontLeft2, legFrontRight2, legBackLeft2, legBackRight2,
              cushion);
    sofa2.rotateY(Math.PI / 2);
    sofa2.position.set(5.5, 0, 2.7);
    scene.add(sofa2);
    // =======================Quạt trần================
    const fanMaterial = new THREE.MeshStandardMaterial({ color: 0xCCCCCC });
    const fanBody = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3), fanMaterial);
    fanBody.position.set(0, 6, 0);
    fanBody.castShadow = true;
    fanBody.receiveShadow = false;
    scene.add(fanBody);
    const bladeGeometry = new THREE.BoxGeometry(4, 0.05, 0.4);
    for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(bladeGeometry, fanMaterial);
        blade.rotation.y = (i * Math.PI) / 2;
        blade.castShadow = true;
        blade.receiveShadow = false;
        fanBody.add(blade);
    }
    // ================= tivi ====================
    const tvGroup = new THREE.Group();
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.5, metalness: 0.3 });
    const standMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7, metalness: 0.2 });
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.7, metalness: 0.3 });
    const screenGeometry = new THREE.BoxGeometry(2.5, 1.5, 0.05);
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.castShadow = true;
    screen.receiveShadow = true;
    tvGroup.add(screen);
    const frontBezelGeometry = new THREE.BoxGeometry(2.7, 1.7, 0.02);
    const frontBezel = new THREE.Mesh(frontBezelGeometry, new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.5 }));
    frontBezel.position.set(0, 0, 0.035);
    frontBezel.castShadow = true;
    frontBezel.receiveShadow = true;
    tvGroup.add(frontBezel);
    const poleGeometry = new THREE.BoxGeometry(0.2, 1, 0.06);
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(0, -0.6, -0.055);
    pole.castShadow = true;
    pole.receiveShadow = false; 
    tvGroup.add(pole);
    const standGeometry = new THREE.CylinderGeometry(1.5, 1, 0.05, 32);
    standGeometry.scale(0.5, 1, 0.2);
    const standMesh = new THREE.Mesh(standGeometry, standMaterial);
    standMesh.rotation.x = Math.PI
    standMesh.position.set(0, -1.125, 0);
    standMesh.castShadow = true;
    standMesh.receiveShadow = false; 
    tvGroup.add(standMesh);
    tvGroup.position.set(1.5, 2.25, -6);
    scene.add(tvGroup);

    // =============tủ kê tivi============== giữ lại chú thích để sau cải thiện thêm cái tủ kê ti vi
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.1 });
    const knobMaterial = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.3, metalness: 0.6 });
    const woodMaterial = new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.6, metalness: 0.2 });
    const tvStand = new THREE.Group();
    // mặt tủ trên cùng
    const topGeometry = new THREE.BoxGeometry(4, 0.2, 1);
    const topMesh = new THREE.Mesh(topGeometry, woodMaterial);
    topMesh.position.set(0, 1, 0);
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    tvStand.add(topMesh);
    //  hai cái hộp bên cạnh
    const cabinetGeometry = new THREE.BoxGeometry(1.2, 0.8, 1);
    const leftCabinet = new THREE.Mesh(cabinetGeometry, woodMaterial);
    leftCabinet.position.set(-1.4, 0.4, 0);
    leftCabinet.castShadow = true;
    leftCabinet.receiveShadow = true;
    tvStand.add(leftCabinet);
    const rightCabinet = new THREE.Mesh(cabinetGeometry, woodMaterial);
    rightCabinet.position.set(1.4, 0.4, 0);
    rightCabinet.castShadow = true;
    rightCabinet.receiveShadow = true;
    tvStand.add(rightCabinet);
    // cửa
    const doorGeometry = new THREE.PlaneGeometry(1.1, 0.7);
    const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    leftDoor.position.set(-1.4, 0.4, 0.51);
    tvStand.add(leftDoor);
    const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    rightDoor.position.set(1.4, 0.4, 0.51);
    tvStand.add(rightDoor);
    // tay đấm cửa tủ
    const knobGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const leftKnob = new THREE.Mesh(knobGeometry, knobMaterial);
    leftKnob.position.set(-1.15, 0.4, 0.55);
    leftKnob.castShadow = true;
    tvStand.add(leftKnob);
    const rightKnob = new THREE.Mesh(knobGeometry, knobMaterial);
    rightKnob.position.set(1.15, 0.4, 0.55);
    rightKnob.castShadow = true;
    tvStand.add(rightKnob);
    // tấm nói ở giữa các hộp
    const middleShelfGeometry = new THREE.BoxGeometry(1.7, 0.1, 0.8);
    const middleShelf = new THREE.Mesh(middleShelfGeometry, woodMaterial);
    middleShelf.position.set(0, 0.6, 0);
    middleShelf.castShadow = true;
    middleShelf.receiveShadow = true;
    tvStand.add(middleShelf);
    // kê
    const baseGeometry = new THREE.BoxGeometry(4, 0.2, 1);
    const baseMesh = new THREE.Mesh(baseGeometry, woodMaterial);
    baseMesh.position.set(0, 0.1, 0);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    tvStand.add(baseMesh);
    //nối các hộp với nhau
    const supportGeometry = new THREE.BoxGeometry(0.2, 0.4, 0.7);
    const leftSupport = new THREE.Mesh(supportGeometry, woodMaterial);
    leftSupport.position.set(-1.4, 0.8, 0);
    leftSupport.castShadow = true;
    leftSupport.receiveShadow = true;
    tvStand.add(leftSupport);
    const rightSupport = new THREE.Mesh(supportGeometry, woodMaterial);
    rightSupport.position.set(1.4, 0.8, 0);
    rightSupport.castShadow = true;
    rightSupport.receiveShadow = true;
    tvStand.position.set(1.5,0,-5.93);
    scene.add(tvStand);
    //=========bình hoa cỡ lớn trang trí==============
    const textureLoader = new THREE.TextureLoader();
    const patternTexture = textureLoader.load('wood.jpg');
    const vaseMaterial = new THREE.MeshStandardMaterial({
        map: patternTexture,
        roughness: 0.5,
        metalness: 0.05,
        side: THREE.DoubleSide,
    });
    const vasePoints = [
        new THREE.Vector2(0.5, 0.0),new THREE.Vector2(0.4, 0.05),new THREE.Vector2(0.35, 0.17),
        new THREE.Vector2(0.33, 0.22),new THREE.Vector2(0.33, 0.27),new THREE.Vector2(0.35, 0.32),
        new THREE.Vector2(0.4, 0.44),new THREE.Vector2(0.9, 1.0),new THREE.Vector2(0.95, 1.1),
        new THREE.Vector2(0.97, 1.15),new THREE.Vector2(0.99, 1.2),new THREE.Vector2(0.99, 1.23),
        new THREE.Vector2(0.97, 1.28),new THREE.Vector2(0.95, 1.33),new THREE.Vector2(0.9, 1.43),
        new THREE.Vector2(0.82, 1.6),new THREE.Vector2(0.75, 1.7),new THREE.Vector2(0.45, 1.99),
        new THREE.Vector2(0.38, 2.14),new THREE.Vector2(0.33, 2.3),new THREE.Vector2(0.3, 2.5),
        new THREE.Vector2(0.29, 2.6),new THREE.Vector2(0.28, 2.68),new THREE.Vector2(0.32, 2.73),
        new THREE.Vector2(0.36, 2.78),new THREE.Vector2(0.42, 2.83),new THREE.Vector2(0.46, 2.89),
        new THREE.Vector2(0.5, 2.92),new THREE.Vector2(0.58, 2.96),new THREE.Vector2(0.59, 2.95),
        new THREE.Vector2(0.6, 2.94),new THREE.Vector2(0.615, 2.93),new THREE.Vector2(0.63, 2.92)
    ];
    const vaseGeometry = new THREE.LatheGeometry(vasePoints, 128);
    const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
    vase.castShadow = true;
    vase.receiveShadow = true;
    const bottomGeometry = new THREE.CircleGeometry(0.5, 64); // cùng bán kính đáy
    const bottom = new THREE.Mesh(bottomGeometry, vaseMaterial);
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = 0; 
    const vaseGroup = new THREE.Group();
    vaseGroup.add(vase);
    vaseGroup.add(bottom);
    vaseGroup.position.set(5.4, 0, 5.4);
    scene.add(vaseGroup);
    // ================== ấm trà =======================
    const geometry = new TeapotGeometry(0.1, 1, true, true, true, true, false);
    const material = new THREE.MeshStandardMaterial({ color: 0xFFFFF0 });
    const teapot = new THREE.Mesh(geometry, material);
    teapot.position.set(2.5, 1.265, 2.8);
    teapot.castShadow = true;
    teapot.receiveShadow = true;
    scene.add(teapot);
    //======= có ấm trà thì phải có cốc trà chứ===============
    const cupMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFF0 , roughness: 0.5, metalness: 0.1, side: THREE.DoubleSide });
    const cupPoints = [
        new THREE.Vector2(0.025, 0.0),
        new THREE.Vector2(0.05, 0.003),
        new THREE.Vector2(0.055, 0.004),
        new THREE.Vector2(0.0575, 0.005),
        new THREE.Vector2(0.05875, 0.006),
        new THREE.Vector2(0.060, 0.007),
        new THREE.Vector2(0.06, 0.1),
    ];
    const cupGeometry = new THREE.LatheGeometry(cupPoints, 32);
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cup.castShadow = true;
    cup.receiveShadow = true;
    const bottomGeometry1 = new THREE.CircleGeometry(0.025); // bán kính đáy của cốc
    const bottom1 = new THREE.Mesh(bottomGeometry1, cupMaterial);
    bottom1.rotation.x = -Math.PI / 2; // xoay đáy cốc theo trục
    //group cho cốc
    const cupGroup = new THREE.Group();
    cupGroup.add(cup);
    cupGroup.add(bottom1);
    const numCups = 6;
    const radius = 0.3; // bán kính vòng tròn sắp xếp cốc

    for (let i = 0; i < numCups; i++) {
        const angle = (i / numCups) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const cupClone = cupGroup.clone();
        cupClone.position.set(x+1.6, 1.18, z+2.7);
        cupClone.children.forEach(child => {
            child.castShadow = true;
            child.receiveShadow = true;
        });
        scene.add(cupClone);
    }
    //===============ddoongf hồ====================
    const clockGroup = new THREE.Group();
    const clockRadius = 0.5;
    const clockDepth = 0.05;
    const clockGeometry = new THREE.CylinderGeometry(clockRadius, clockRadius, clockDepth, 64);
    const clockMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const clockFace = new THREE.Mesh(clockGeometry, clockMaterial);
    clockFace.position.set(0, 3, -5);
    clockFace.rotation.x = Math.PI / 2;
    clockFace.castShadow = true;
    clockFace.receiveShadow = true;
    clockGroup.add(clockFace);
    // === Nhóm chứa kim, vạch số===
    const clockDetails = new THREE.Group();
    clockDetails.position.copy(clockFace.position);
    clockGroup.add(clockDetails);
    //tạo một tick
    const tickMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const tickLength = 0.05;
    const tickDepth = 0.01;
    const tickGeometry = new THREE.BoxGeometry(0.02, tickLength, tickDepth);
    tickGeometry.translate(0, tickLength / 2, 0);
    const baseTick = new THREE.Mesh(tickGeometry, tickMaterial);
    const tickGroup = new THREE.Group();
    tickGroup.add(baseTick);
    //tạo 12 tick quay tròn đều quanh mặt đồng hồ
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * clockRadius * 0.9;
        const y = Math.sin(angle) * clockRadius * 0.9;
        const tickClone = tickGroup.clone();
        tickClone.position.set(x, y, clockDepth / 2 + 0.001);
        // Điều chỉnh để vạch số luôn hướng vào tâm
        const rotationAngle = angle + Math.PI / 2;
        tickClone.rotation.z = rotationAngle;
        tickClone.children.forEach(child => {
            child.castShadow = true;
        });
        clockDetails.add(tickClone);
    }

    // === Kim giờ ===
    const hourHandGeometry = new THREE.BoxGeometry(0.02, 0.3, 0.01);
    const hourHandMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const hourHand = new THREE.Mesh(hourHandGeometry, hourHandMaterial);
    hourHand.geometry.translate(0, 0.125, 0.05);
    // === Kim phút ===
    const minuteHandGeometry = new THREE.BoxGeometry(0.01, 0.35, 0.01);
    const minuteHandMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const minuteHand = new THREE.Mesh(minuteHandGeometry, minuteHandMaterial);
    minuteHand.geometry.translate(0, 0.2, 0.04);
    clockDetails.add(minuteHand);
    // === Kim giây ===
    const secondHandGeometry = new THREE.BoxGeometry(0.01, 0.45, 0.05);
    const secondHandMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const secondHand = new THREE.Mesh(secondHandGeometry, secondHandMaterial);
    secondHand.geometry.translate(0, 0.225, 0.01);
    clockDetails.add(secondHand);
    function updateClockHands() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const hourAngle = - (Math.PI * 2) * (hours + minutes / 60) / 12;
        const minuteAngle = - (Math.PI * 2) * (minutes + seconds / 60) / 60;
        const secondAngle = - (Math.PI * 2) * (seconds / 60);
        hourHand.rotation.z = hourAngle;
        minuteHand.rotation.z = minuteAngle;
        secondHand.rotation.z = secondAngle;
    }
    clockGroup.rotation.y = Math.PI / 2;
    clockGroup.position.set(-1.5,2.3,0);
    scene.add(clockGroup);
    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        fanBody.rotation.y += 0.15;
        updateClockHands();
        controls.update(); // cập nhật điều khiển camera
        renderer.render(scene, camera);
    }
    animate();
    // 11. Add audio
    const listener = new THREE.AudioListener()
    camera.add(listener)
    const sound = new THREE.Audio(listener)
    const audioLoader = new THREE.AudioLoader()
    audioLoader.load('./music.mp3', (buffer) => {
        sound.setBuffer(buffer)
        sound.setLoop(true)
        sound.setVolume(0.5)
        sound.play()
    },
        (progress) => {
        console.log(`Audio: ${(progress.loaded / progress.total * 100).toFixed(1)}% loaded`)
        },
        (err) => console.error('Error loading ambient.mp3:', err)
    )

}