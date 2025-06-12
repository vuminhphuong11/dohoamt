import * as THREE from 'three';
import { OrbitControls } from '/OrbitControls.js';
import { TeapotGeometry } from "/TeapotGeometry.js";
export function init(container) {
    container.innerHTML = '';
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(7, 7, 7);
    camera.lookAt(0, 0, 0);
    const renderer =new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0.5, 0);
    controls.update();
    // Ánh sáng
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(2, 5, 3);
    scene.add(dirLight);
    // thêm nền cho ngôi nhà
    const betong = new THREE.MeshStandardMaterial({ 
       color: 0xCCCCCC, 
       side: THREE.DoubleSide 
    });
    const nengeo = new THREE.PlaneGeometry(35, 35);
    const nen = new THREE.Mesh(nengeo, betong);
    nen.rotation.x=-Math.PI / 2
    nen.position.y=-0.01;
    scene.add(nen);
    // móng cho ngôi nhà
    const monggeo = new THREE.BoxGeometry(26,2,30);
    const mong =new THREE.Mesh(monggeo,betong);
    mong.position.y=1;
    scene.add(mong);
    // bậc thang cho ngôi nhà
    const thang= new THREE.BoxGeometry(1,0.7,4);
    const thang2= new THREE.BoxGeometry(2,0.7,4);
    const thang3= new THREE.BoxGeometry(3,0.7,4);
    const bac1=new THREE.Mesh(thang,betong);
    const bac2=new THREE.Mesh(thang2,betong);
    const bac3= new THREE.Mesh(thang3,betong);
    bac1.position.set(13.5,0,13);
    bac1.position.y=1.7;
    scene.add(bac1);
    bac2.position.set(14,0,13);
    bac2.position.y=1.1;
    scene.add(bac2);
    bac3.position.set(14.5,0,13);
    bac3.position.y=0.4;
    scene.add(bac3);
    // Sàn nhà
    const texLoader = new THREE.TextureLoader();
    const woodTex = texLoader.load('sannha1.jpg');
    woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
    woodTex.repeat.set(6, 6);
    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(26, 0.2, 30), 
        new THREE.MeshStandardMaterial({ map: woodTex })
    );
    floor.position.y = 2.1;
    scene.add(floor);
    // hiên nhà
    const texLoader1 = new THREE.TextureLoader()
    const woodTex1 = texLoader1.load('wood.jpg')
    woodTex1.wrapS = woodTex1.wrapT = THREE.RepeatWrapping
    const floor2 = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 4),
        new THREE.MeshStandardMaterial({ map: woodTex1 })
    )
    floor2.rotation.x = -Math.PI / 2;
    floor2.rotation.z = -Math.PI / 2;
    floor2.position.set(11,2.21,13);
    floor2.receiveShadow = true
    scene.add(floor2)
    // -----------------phòng khách--------------
    // Tường 
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const wallHeight = 6.5;
    const wallThickness = 0.4;
    const Wall1 = new THREE.Mesh(new THREE.BoxGeometry(8, wallHeight, wallThickness), wallMaterial);
    Wall1.position.set(8.6, wallHeight / 2+2.1,2);
    scene.add(Wall1);
    const Wall2 = new THREE.Mesh(new THREE.BoxGeometry(13, wallHeight, wallThickness), wallMaterial);
    Wall2.position.set(0, wallHeight / 2+2.1,8.3);
    Wall2.rotation.y=-Math.PI / 2
    scene.add(Wall2);
    const Wall3 = new THREE.Mesh(new THREE.BoxGeometry(6, wallHeight, wallThickness), wallMaterial);
    Wall3.position.set(-1, wallHeight / 2+2.1,2);
    scene.add(Wall3);
    const Wall4 = new THREE.Mesh(new THREE.BoxGeometry(25, wallHeight-5, wallThickness), wallMaterial);
    Wall4.position.set(0, wallHeight / 2+2.1+2.5,2);
    scene.add(Wall4);
    const Wall5 = new THREE.Mesh(new THREE.BoxGeometry(13, wallHeight-4.4, wallThickness), wallMaterial);
    Wall5.position.set(6, wallHeight / 2+2.1+2.2,14.8);
    scene.add(Wall5);
    const Wall6 = new THREE.Mesh(new THREE.BoxGeometry(4, wallHeight, wallThickness), wallMaterial);
    Wall6.position.set(0, wallHeight / 2+2.1,14.8);
    scene.add(Wall6);
    const Wall7 = new THREE.Mesh(new THREE.BoxGeometry(8, wallHeight-5, wallThickness), wallMaterial);
    Wall7.position.set(5, (wallHeight-5) / 2+2.1,14.8);
    scene.add(Wall7);
    const Wall8 = new THREE.Mesh(new THREE.BoxGeometry(6, wallHeight, wallThickness), wallMaterial);
    Wall8.position.set(10, wallHeight / 2+2.1,14.8);
    scene.add(Wall8);
    const Wall9 = new THREE.Mesh(new THREE.BoxGeometry(4, wallHeight, wallThickness), wallMaterial);
    Wall9.position.set(11, wallHeight / 2+2.1,11.2);
    scene.add(Wall9);
    const Wall10 = new THREE.Mesh(new THREE.BoxGeometry(4, wallHeight, wallThickness), wallMaterial);
    Wall10.position.set(10.6, wallHeight / 2+2.1,-2);
    scene.add(Wall10);
    const Wall11 = new THREE.Mesh(new THREE.BoxGeometry(4, wallHeight, wallThickness), wallMaterial);
    Wall11.position.set(4, wallHeight / 2+2.1,-2);
    scene.add(Wall11);
    const Wall12 = new THREE.Mesh(new THREE.BoxGeometry(6, wallHeight, wallThickness), wallMaterial);
    Wall12.position.set(-3.5, wallHeight / 2+2.1,-2);
    scene.add(Wall12);
    const Wall13 = new THREE.Mesh(new THREE.BoxGeometry(3.5, wallHeight, wallThickness), wallMaterial);
    Wall13.position.set(-11, wallHeight / 2+2.1,-2);
    scene.add(Wall13);
    const Wall14 = new THREE.Mesh(new THREE.BoxGeometry(25.4, wallHeight-5, wallThickness), wallMaterial);
    Wall14.position.set(0, wallHeight / 2+2.1+2.5,-2);
    scene.add(Wall14);
    const Wall15 = new THREE.Mesh(new THREE.BoxGeometry(12.8, wallHeight, wallThickness), wallMaterial);
    Wall15.rotation.y=-Math.PI/2;
    Wall15.position.set(5, wallHeight / 2+2.1,-8.5);
    scene.add(Wall15);
    const Wall16 = new THREE.Mesh(new THREE.BoxGeometry(12.8, wallHeight, wallThickness), wallMaterial);
    Wall16.rotation.y=-Math.PI/2;
    Wall16.position.set(-4.5, wallHeight / 2+2.1,-8.5);
    scene.add(Wall16);
    const Wall17 = new THREE.Mesh(new THREE.BoxGeometry(1, wallHeight, wallThickness), wallMaterial);
    Wall17.position.set(-7, wallHeight / 2+2.1,2);
    scene.add(Wall17);
    const Wall18 = new THREE.Mesh(new THREE.BoxGeometry(1.5, wallHeight, wallThickness), wallMaterial);
    Wall18.position.set(-12, wallHeight / 2+2.1,2);
    scene.add(Wall18);
    const Wall19 = new THREE.Mesh(new THREE.BoxGeometry(4, wallHeight-4, wallThickness), wallMaterial);
    Wall19.position.set(-9.5, (wallHeight -5)/ 2+2.1,2);
    scene.add(Wall19);
    // bàn
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const tableGeometry = new THREE.BoxGeometry(3.3, 0.35, 1.9);
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(0, 1, 0);
    const undertableGeometry = new THREE.BoxGeometry(2.5, 0.1, 1.5);
    const undertable = new THREE.Mesh(undertableGeometry, tableMaterial);
    undertable.position.set(0, 0.4, 0);
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1);
    const legs = [];
    for (let i of [-1.2, 1.2]) {
        for (let j of [-0.7, 0.7]) {
            const leg = new THREE.Mesh(legGeometry, tableMaterial);
            leg.position.set(i, 0.5, j);
            legs.push(leg);
        }
    }
    const tableGroup = new THREE.Group();
    tableGroup.add(table);
    tableGroup.add(undertable);
    legs.forEach(leg => tableGroup.add(leg));
    tableGroup.rotation.y=-Math.PI / 2;
    tableGroup.position.set(9, 2.1, 7.5);
    scene.add(tableGroup);
    // sofa
    const sofaMaterial = new THREE.MeshStandardMaterial({color: 0xf5f5f5, roughness: 0.3, metalness: 0.05});
    const cushionMaterial = new THREE.MeshStandardMaterial({ color: 0xd19c73, roughness: 0.5, metalness: 0.05 });
    const seatGeometry = new THREE.BoxGeometry(3.8, 0.6, 1.6);
    const seat = new THREE.Mesh(seatGeometry, cushionMaterial);
    seat.position.set(0, 0.5, 0);
    const backRestGeometry = new THREE.BoxGeometry(3.8, 1, 0.3);
    const backRest = new THREE.Mesh(backRestGeometry, cushionMaterial);
    backRest.position.set(0, 1.3, 0.65);
    const armRestGeometry = new THREE.BoxGeometry(0.3, 1, 1.8);
    const armRestLeft = new THREE.Mesh(armRestGeometry, cushionMaterial);
    armRestLeft.position.set(-2, 0.7, 0);
    const armRestRight = new THREE.Mesh(armRestGeometry, cushionMaterial);
    armRestRight.position.set(2, 0.7, 0);
    const legGeometry1 = new THREE.CylinderGeometry(0.1, 0.1, 0.2);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2F4F4F });
    const legFrontLeft = new THREE.Mesh(legGeometry1, legMaterial);
    legFrontLeft.position.set(-1.5, 0.1, 0.7);
    const legFrontRight = new THREE.Mesh(legGeometry1, legMaterial);
    legFrontRight.position.set(1.5, 0.1, 0.7);
    const legBackLeft = new THREE.Mesh(legGeometry1, legMaterial);
    legBackLeft.position.set(-1.5, 0.1, -0.7);
    const legBackRight = new THREE.Mesh(legGeometry1, legMaterial);
    legBackRight.position.set(1.5, 0.1, -0.7);
    const cushionGeometry = new THREE.BoxGeometry(1.6, 0.2, 1.1);
    const cushionLeft = new THREE.Mesh(cushionGeometry, cushionMaterial);
    cushionLeft.position.set(-0.85, 0.9, -0.15);
    const cushionRight = new THREE.Mesh(cushionGeometry, cushionMaterial);
    cushionRight.position.set(0.85, 0.9, -0.15);
    const sofa = new THREE.Group();
    sofa.add(seat, backRest, armRestLeft, armRestRight,
             legFrontLeft, legFrontRight, legBackLeft, legBackRight,
             cushionLeft, cushionRight);
    sofa.rotation.y=Math.PI / 2;
    sofa.position.set(11.5, 2.1, 7.5);
    scene.add(sofa);
    // sofa nhỏ
    const seatGeometry2 = new THREE.BoxGeometry(1.9, 0.6, 1.6);
    const seat2 = new THREE.Mesh(seatGeometry2, cushionMaterial);
    seat2.position.set(0, 0.5, 0);
    const backRestGeometry2 = new THREE.BoxGeometry(1.9, 1, 0.3);
    const backRest2 = new THREE.Mesh(backRestGeometry2, cushionMaterial);
    backRest2.position.set(0, 1.3, 0.65);
    const armRestLeft2 = new THREE.Mesh(armRestGeometry, cushionMaterial);
    armRestLeft2.position.set(-1, 0.7, 0);
    const armRestRight2 = new THREE.Mesh(armRestGeometry, cushionMaterial);
    armRestRight2.position.set(1, 0.7, 0);
    const legFrontLeft2 = new THREE.Mesh(legGeometry1, legMaterial);
    legFrontLeft2.position.set(-1, 0.1, 0.7);
    const legFrontRight2 = new THREE.Mesh(legGeometry1, legMaterial);
    legFrontRight2.position.set(1, 0.1, 0.7);
    const legBackLeft2 = new THREE.Mesh(legGeometry1, legMaterial);
    legBackLeft2.position.set(-1, 0.1, -0.7);
    const legBackRight2 = new THREE.Mesh(legGeometry1, legMaterial);
    legBackRight2.position.set(1, 0.1, -0.7);
    const cushion = new THREE.Mesh(cushionGeometry, cushionMaterial);
    cushion.position.set(0, 0.9, -0.15);
    const sofa2 = new THREE.Group();
    sofa2.add(seat2, backRest2, armRestLeft2, armRestRight2,
              legFrontLeft2, legFrontRight2, legBackLeft2, legBackRight2,
              cushion);
    sofa2.rotateY(Math.PI );
    sofa2.position.set(9, 2.1, 3.5);
    scene.add(sofa2);
    // tủ kê ti vi
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.1 });
    const knobMaterial = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.3, metalness: 0.6 });
    const woodMaterial = new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.6, metalness: 0.2 });
    const tvStand = new THREE.Group();
    // mặt tủ trên cùng
    const topGeometry = new THREE.BoxGeometry(4, 0.2, 1);
    const topMesh = new THREE.Mesh(topGeometry, woodMaterial);
    topMesh.position.set(0, 1, 0);
    tvStand.add(topMesh);
    //  hai cái hộp bên cạnh
    const cabinetGeometry = new THREE.BoxGeometry(1.2, 0.8, 1);
    const leftCabinet = new THREE.Mesh(cabinetGeometry, woodMaterial);
    leftCabinet.position.set(-1.4, 0.4, 0);
    tvStand.add(leftCabinet);
    const rightCabinet = new THREE.Mesh(cabinetGeometry, woodMaterial);
    rightCabinet.position.set(1.4, 0.4, 0);
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
    tvStand.add(leftKnob);
    const rightKnob = new THREE.Mesh(knobGeometry, knobMaterial);
    rightKnob.position.set(1.15, 0.4, 0.55);
    tvStand.add(rightKnob);
    // tấm nói ở giữa các hộp
    const middleShelfGeometry = new THREE.BoxGeometry(1.7, 0.1, 0.8);
    const middleShelf = new THREE.Mesh(middleShelfGeometry, woodMaterial);
    middleShelf.position.set(0, 0.6, 0);
    tvStand.add(middleShelf);
    // kê
    const baseGeometry = new THREE.BoxGeometry(4, 0.2, 1);
    const baseMesh = new THREE.Mesh(baseGeometry, woodMaterial);
    baseMesh.position.set(0, 0.1, 0);
    tvStand.add(baseMesh);
    //nối các hộp với nhau
    const supportGeometry = new THREE.BoxGeometry(0.2, 0.4, 0.7);
    const leftSupport = new THREE.Mesh(supportGeometry, woodMaterial);
    leftSupport.position.set(-1.4, 0.8, 0);
    tvStand.add(leftSupport);
    const rightSupport = new THREE.Mesh(supportGeometry, woodMaterial);
    rightSupport.position.set(1.4, 0.8, 0);
    tvStand.add(rightSupport);
    tvStand.rotation.y=Math.PI/2
    tvStand.position.set(0.8,2.11,7.5);
    scene.add(tvStand);
    // tivi
    const tvGroup = new THREE.Group();
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.5, metalness: 0.3 });
    const standMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7, metalness: 0.2 });
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.7, metalness: 0.3 });
    const screenGeometry = new THREE.BoxGeometry(2.5, 1.5, 0.05);
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    tvGroup.add(screen);
    const frontBezelGeometry = new THREE.BoxGeometry(2.7, 1.7, 0.02);
    const frontBezel = new THREE.Mesh(frontBezelGeometry, new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.5 }));
    frontBezel.position.set(0, 0, 0.035);
    tvGroup.add(frontBezel);
    const poleGeometry = new THREE.BoxGeometry(0.2, 1, 0.06);
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(0, -0.6, -0.055);
    tvGroup.add(pole);
    const standGeometry = new THREE.CylinderGeometry(1.5, 1, 0.05, 32);
    standGeometry.scale(0.5, 1, 0.2);
    const standMesh = new THREE.Mesh(standGeometry, standMaterial);
    standMesh.rotation.x = Math.PI
    standMesh.position.set(0, -1.125, 0);
    tvGroup.add(standMesh);
    tvGroup.rotation.y=Math.PI/2
    tvGroup.position.set(0.8, 2.25+2.11, 7.5);
    scene.add(tvGroup);
    // bình hoa
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
    bottom.rotation.x = -Math.PI / 2; // úp xuống trục Y
    bottom.position.y = 0; // trùng với đáy bình để mà tạo đáy cho bình hoa
    const vaseGroup = new THREE.Group();
    vaseGroup.add(vase);
    vaseGroup.add(bottom);
    vaseGroup.position.set(11.5, 2.1, 3.5);
    scene.add(vaseGroup);
    // ấm trà
    const geometry = new TeapotGeometry(0.1, 1, true, true, true, true, false); 
    const material = new THREE.MeshStandardMaterial({ color: 0xFFFFF0 });  
    const teapot = new THREE.Mesh(geometry, material);
    teapot.position.set(9, 1.265+2.1, 7.5);  
    scene.add(teapot);
    // 6 cái chén uống trà
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
    const bottomGeometry1 = new THREE.CircleGeometry(0.025); // bán kính đáy của cốc
    const bottom1 = new THREE.Mesh(bottomGeometry1, cupMaterial);
    bottom1.rotation.x = -Math.PI / 2; // xoay đáy cốc theo trục 
    const cupGroup = new THREE.Group();
    cupGroup.add(cup);
    cupGroup.add(bottom1);
    const numCups = 6;
    const radius = 0.4; // Bán kính vòng tròn sắp xếp cốc
    for (let i = 0; i < numCups; i++) {
        const angle = (i / numCups) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius; 
        const cupClone = cupGroup.clone();
        cupClone.position.set(x+9, 1.18+2.1, z+7.5); 
        scene.add(cupClone);
    }
    // đồng hồ
    const clockGroup = new THREE.Group(); 
    const clockRadius = 0.5; 
    const clockDepth = 0.05;
    const clockGeometry = new THREE.CylinderGeometry(clockRadius, clockRadius, clockDepth, 64);
    const clockMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const clockFace = new THREE.Mesh(clockGeometry, clockMaterial);
    clockFace.position.set(0, 3, -5); 
    clockFace.rotation.x = Math.PI / 2; 
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
        clockDetails.add(tickClone);
    }
    // === Kim giờ ===
    const hourHandGeometry = new THREE.BoxGeometry(0.02, 0.3, 0.01); 
    const hourHandMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const hourHand = new THREE.Mesh(hourHandGeometry, hourHandMaterial);
    hourHand.geometry.translate(0, 0.125, 0.05);  
    clockDetails.add(hourHand);
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
    clockGroup.rotation.y = Math.PI;
    clockGroup.position.set(4.2,2.55+2.1,9.6);
    scene.add(clockGroup);
    //    quạt trần
    const fanMaterial = new THREE.MeshStandardMaterial({ color: 0xCCCCCC });
    const fanBody = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3), fanMaterial);
    fanBody.position.set(7.5, 6+2.1, 6.5);
    scene.add(fanBody);
    const bladeGeometry = new THREE.BoxGeometry(4, 0.05, 0.4);
    for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(bladeGeometry, fanMaterial);
        blade.rotation.y = (i * Math.PI) / 2;
        fanBody.add(blade);
    }
    // =======================phòng bếp=======================
    // tạo bàn 
    const tableGroup2 = new THREE.Group();
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 4), tableMaterial);
    tableTop.position.set(0, 1.5, 0);  // nâng mặt bàn lên y = 1.5
    tableGroup2.add(tableTop);
    const legPositions = [
        [-0.7, 0.85, -1.75],   // chân bàn đặt y = 0.85
        [0.7, 0.85, -1.75],
        [-0.7, 0.85, 1.75],
        [0.7, 0.85, 1.75]
    ];
    const tableLegs = legPositions.map(pos => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.5, 0.2), tableMaterial);
        leg.position.set(...pos);
        tableGroup2.add(leg);
        return leg;
    });
    tableGroup2.position.set(-6,2.1,9);
    scene.add(tableGroup2);
    // tạo ghế
    const chairMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    function createChair(x, z, rotationY) {
        // phần ngồi lên
        const seatWidth = 0.7;
        const seatDepth = 0.8;
        const seatHeight = 0.1;
        const seatY = 1;
        const seat = new THREE.Mesh(new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth), chairMaterial);
        seat.position.set(x, seatY+2.1, z);
        seat.rotation.y = rotationY;
        scene.add(seat);
        // phần dựa lưng
        const backrestWidth = seatWidth * 0.9;  
        const backrestHeight = 0.9;              
        const backrestDepth = 0.05;            
        const backrest = new THREE.Mesh(new THREE.BoxGeometry(backrestWidth, backrestHeight, backrestDepth), chairMaterial);
        backrest.position.set(
            x - (seatDepth / 2 - backrestDepth / 2) * Math.sin(rotationY),
            seatY + backrestHeight / 2+2.1,
            z - (seatDepth / 2 - backrestDepth / 2) * Math.cos(rotationY)
        );
        backrest.rotation.y = rotationY;
        scene.add(backrest);
        // 4 chân ghế
        const legHeight = seatY;
        const legWidth = 0.1;
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
            leg.position.set(x + offsetX, legHeight / 2+2.1, z + offsetZ);
            scene.add(leg);
        });
    }
    createChair(1-6, -1+9, -Math.PI/2);      
    createChair(1-6, 1+9, -Math.PI/2);
    createChair(-1-6, 1+9, Math.PI/2); 
    createChair(-1-6, -1+9, Math.PI/2);
    // tủ lạnh
    function createModernWhiteFridge() {
      const fridge = new THREE.Group();
      // Thân t lạnh chính (phông trắng sáng)
      const bodyGeometry = new THREE.BoxGeometry(1, 2.2, 0.7);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.3 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      fridge.add(body);
      // Cửa tủ lạnh (2 ngăn)
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
      // Tay nắm cửa dưới
      const lowerHandle = new THREE.Mesh(handleGeometry, handleMaterial);
      lowerHandle.position.set(0.4, -0.55, 0.4);
      lowerHandle.rotation.y = Math.PI / 2;
      fridge.add(lowerHandle);
      return fridge;
    }
    // Khởi tạo và thêm vào scene
    const fridge = createModernWhiteFridge();
    fridge.scale.set(1.5, 1.5, 1.5); 
    fridge.rotation.y=Math.PI/2;
    fridge.position.set(-12, 1.6+2.2,6);
    scene.add(fridge);
    // Add sink
    const sinkGeometry = new THREE.BoxGeometry(2.5, 1.7, 1.5);
    const sinkMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const sink = new THREE.Mesh(sinkGeometry, sinkMaterial);
    sink.position.set(2.25-13, 0.85+2.1,-4.2+18);
    scene.add(sink);
    // Add countertop to right corner
    const counterGeometry = new THREE.BoxGeometry(1.5, 1.7, 6);
    const counterMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const counter = new THREE.Mesh(counterGeometry, counterMaterial);
    counter.position.set(4.2-16, 0.85+2.1, -1.95+13.5);
    scene.add(counter);
    // bếp lửa
    // Tạo một group để chứa tất cả các bộ phận của bếp
    const stoveGroup = new THREE.Group();
    // Gas stove on countertop
    const stoveMaterial = new THREE.MeshStandardMaterial({ color: 0x123456 }); // Stainless steel
    // Stove base
    const stoveBaseGeometry = new THREE.BoxGeometry(1, 0.2, 1.5); // Adjusted depth for 2 burners
    const stoveBase = new THREE.Mesh(stoveBaseGeometry, stoveMaterial);
    stoveBase.position.set(4.25-7, 1.7+2.1, -1.8+9); // On countertop
    stoveBase.castShadow = true;
    stoveBase.receiveShadow = true;
    stoveGroup.add(stoveBase);

    // Burners (2, larger, side by side)
    const burnerGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.02, 64); // Larger radius
    const burnerPositions = [
        [0.1-7, 0.11+2.1, 0.4+9], // Right burner
        [0.1-7, 0.11+2.1, -0.4+9]   // Left burner
    ];
    burnerPositions.forEach(pos => {
        const burner = new THREE.Mesh(burnerGeometry, stoveMaterial);
        burner.position.set(4.25 + pos[0], 1.7 + pos[1], -1.8 + pos[2]);
        burner.castShadow = true;
        burner.receiveShadow = true;
        stoveGroup.add(burner);
    });
    // Knobs (2)
    const knobGeometry1 = new THREE.CylinderGeometry(0.06, 0.06, 0.06, 32); // Fixed duplicate definition
    const knobPositions = [
        [-0.35-7, 0.11+2.1, 0.4+9], // Right knob
        [-0.35-7, 0.11+2.1, -0.4+9]   // Left knob
    ];
    knobPositions.forEach(pos => {
        const knob = new THREE.Mesh(knobGeometry1, stoveMaterial);
        knob.position.set(4.2 + pos[0], 1.7 + pos[1], -1.8 + pos[2]);
        knob.castShadow = true;
        knob.receiveShadow = true;
        stoveGroup.add(knob);
    });
    // Flames (2 larger rings)
    const flameMaterial = new THREE.MeshBasicMaterial({
        color: 0xff4500, // Orange-red flame
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    const flameGeometry = new THREE.ConeGeometry(0.028, 0.18, 8); // Slightly larger flame
    const flameGroups = [];
    burnerPositions.forEach((pos, burnerIndex) => {
        const flameGroup = new THREE.Group();
        const numFlames = 20;
        const radius = 0.3; // Larger than burner radius (0.3)
        for (let i = 0; i < numFlames; i++) {
            const angle = (i / numFlames) * Math.PI * 2;
            const flame = new THREE.Mesh(flameGeometry, flameMaterial);
            flame.position.set(
                radius * Math.cos(angle),
                0.075, // Half flame height
                radius * Math.sin(angle)
            );
            flameGroup.add(flame);
        }
        flameGroup.position.set(4.25 + pos[0], 1.71+2.1, -1.8 + pos[2]); // Above burner
        stoveGroup.add(flameGroup);
        flameGroups.push(flameGroup);
    });
    // Frying pan on left burner
    const panMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const panBottomGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.05, 32); // Radius 0.28
    const panBottom = new THREE.Mesh(panBottomGeometry, panMaterial);
    panBottom.position.set(4.25 + 0.1-7, 1.81 + 0.025+2.1, -1.8 - 0.4+9); // Above left burner
    panBottom.castShadow = true;
    panBottom.receiveShadow = true;
    stoveGroup.add(panBottom);
    const panWallGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 32, 1, true); // Radius 0.28
    const panWall = new THREE.Mesh(panWallGeometry, panMaterial);
    panWall.position.set(4.25 + 0.1-7, 1.81 + 0.05+2.1, -1.8 - 0.4+9);
    panWall.castShadow = true;
    panWall.receiveShadow = true;
    stoveGroup.add(panWall);
    const handleGeometry = new THREE.BoxGeometry(0.3, 0.03, 0.05); // Handle
    const handle = new THREE.Mesh(handleGeometry, panMaterial);
    handle.position.set(4.25 + 0.1 - 0.3-7, 1.81 + 0.05+2.1, -1.8 - 0.2+9); // Attached at edge
    handle.rotation.y = Math.PI / 6;
    handle.castShadow = true;
    handle.receiveShadow = true;
    stoveGroup.add(handle);
    // Stock pot on right burner
    const potMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const potBottomGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.05, 32); // Radius 0.28
    const potBottom = new THREE.Mesh(potBottomGeometry, potMaterial);
    potBottom.position.set(4.25 + 0.1-7, 1.81 + 0.025+2.1, -1.8 + 0.4+9); // Above right burner
    potBottom.castShadow = true;
    potBottom.receiveShadow = true;
    stoveGroup.add(potBottom);
    const potWallGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.4, 32, 1, true); // Radius 0.28
    const potWall = new THREE.Mesh(potWallGeometry, potMaterial);
    potWall.position.set(4.25 + 0.1-7, 1.81 + 0.2+2.1, -1.8 + 0.4+9);
    potWall.castShadow = true;
    potWall.receiveShadow = true;
    stoveGroup.add(potWall);
    const handle1Geometry = new THREE.BoxGeometry(0.15, 0.05, 0.05); // Handle 1
    const handle1 = new THREE.Mesh(handle1Geometry, panMaterial);
    handle1.position.set(4.25 + 0.1-7, 1.81 + 0.3+2.1, -1.8 + 0.1+9); // Attached at edge
    handle1.castShadow = true;
    handle1.receiveShadow = true;
    stoveGroup.add(handle1);
    const handle2Geometry = new THREE.BoxGeometry(0.15, 0.05, 0.05); // Handle 2
    const handle2 = new THREE.Mesh(handle2Geometry, panMaterial);
    handle2.position.set(4.25 -7+ 0.1, 1.81 + 0.3+2.1, -1.8 + 0.7+9); // Attached at edge
    handle2.castShadow = true;
    handle2.receiveShadow = true;
    stoveGroup.add(handle2);
    // Steak in frying pan (rectangular with fat cap)
    const steakMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 }); // Red raw meat
    const steakGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.45); // Thicker rectangle
    const steak = new THREE.Mesh(steakGeometry, steakMaterial);
    steak.position.set(4.25 + 0.1-7, 1.81 + 0.09+2.1, -1.8 - 0.4+9); // Center of pan, above bottom
    steak.castShadow = true;
    steak.receiveShadow = true;
    stoveGroup.add(steak);
    const fatCapMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White fat
    const fatCapGeometry = new THREE.BoxGeometry(0.04, 0.08, 0.15); // Thin strip for fat cap
    const fatCap = new THREE.Mesh(fatCapGeometry, fatCapMaterial);
    fatCap.position.set(4.35  + 0.12-7, 1.81 + 0.09+2.1, -1.8 - 0.4+9); // Attached to right side of steak
    fatCap.castShadow = true;
    fatCap.receiveShadow = true;
    stoveGroup.add(fatCap);
    // Boiling water in stock pot
    const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x87ceeb, // Light blue
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    const waterGeometry = new THREE.CylinderGeometry(0.27, 0.27, 0.01, 32); // Slightly smaller than pot radius
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.set(4.35 -7, 1.81 + 0.35+2.1, -1.4+9); // Near top of pot
    water.castShadow = true;
    water.receiveShadow = true;
    stoveGroup.add(water);

    // Thêm group bếp vào scene
    stoveGroup.rotation.y=Math.PI;
    stoveGroup.position.set(-14.5,0.1,18);
    scene.add(stoveGroup);
    // Add fan
        const fanBody1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3), fanMaterial);
        fanBody1.position.set(-6, 6+2.1, 7);
        scene.add(fanBody1);
        const bladeGeometry1 = new THREE.BoxGeometry(4, 0.05, 0.4);
        for (let i = 0; i < 4; i++) {
            const blade = new THREE.Mesh(bladeGeometry1, fanMaterial);
            blade.rotation.y = (i * Math.PI) / 2;
            fanBody1.add(blade);
        }

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    // Animate
    function animate() {
        requestAnimationFrame(animate);
        fanBody.rotation.y += 0.15;
        fanBody1.rotation.y += 0.15;
        updateClockHands();
        flameGroups.forEach((group, index) => {
            group.children.forEach((flame, flameIndex) => {
                flame.scale.y = 1 + 0.1 * Math.sin(Date.now() * 0.005 + index + flameIndex * 0.2);
            });
        });
        // Boiling water effect
        water.position.y = 1.81 + 0.35+2.1 + 0.005 * Math.sin(Date.now() * 0.01); // Slight ripple
        controls.update(); // cập nhật điều khiển camera
        renderer.render(scene, camera);
    }
    animate();
}
