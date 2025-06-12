import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

// =================================================================
// SHADER CODE (Không thay đổi)
// =================================================================

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D tDepth;
    uniform sampler2D tDudv;
    uniform vec3 foamColor;
    uniform vec3 waterColor;
    uniform float cameraNear;
    uniform float cameraFar;
    uniform float time;
    uniform float threshold;

    float readDepth(sampler2D depthSampler, vec2 coord) {
        float fragCoordZ = texture2D(depthSampler, coord).x;
        float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
        return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
    }

    void main() {
        vec2 distortedUv = texture2D(tDudv, vec2(vUv.x + time * 0.01, vUv.y)).rg * 0.1;
        distortedUv = vUv + vec2(distortedUv.x, distortedUv.y + time * 0.01);
        vec2
        distortedUv2 = texture2D(tDudv, vec2(vUv.x - time * 0.007, vUv.y + time * 0.005)).rg * 0.1;
        distortedUv2 = vUv + vec2(distortedUv2.x, distortedUv2.y - time * 0.003);

        float sceneDepth = readDepth(tDepth, gl_FragCoord.xy / gl_FragCoord.w);
        float waterDepth = gl_FragCoord.z;
        float depthDifference = abs(sceneDepth - waterDepth);

        vec3 finalColor;

        if (depthDifference < threshold) {
            finalColor = foamColor;
        } else {
            finalColor = waterColor;
        }
        
        gl_FragColor = vec4(finalColor, 1.0) + texture2D(tDudv, distortedUv) * 0.2 + texture2D(tDudv, distortedUv2) * 0.2;
        gl_FragColor.a = 1.0;
    }
`;


// =================================================================
// HÀM TIỆN ÍCH
// =================================================================
function roundedRect(shape, x, y, width, height, radius) {
    shape.moveTo(x, y + radius);
    shape.lineTo(x, y + height - radius);
    shape.quadraticCurveTo(x, y + height, x + radius, y + height);
    shape.lineTo(x + width - radius, y + height);
    shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    shape.lineTo(x + width, y + radius);
    shape.quadraticCurveTo(x + width, y, x + width - radius, y);
    shape.lineTo(x + radius, y);
    shape.quadraticCurveTo(x, y, x, y + radius);
}

// MỚI: Hàm tạo giá treo khăn tắm
/**
 * Creates a 3D model of a wall-mounted towel rack.
 * Based on the provided image, it includes two bars and a side hook.
 * @param {THREE.Material} material - The material to apply to the rack.
 * @returns {THREE.Group} - A group containing all parts of the towel rack.
 */
function createTowelRack(material) {
    const rackGroup = new THREE.Group();

    const barLength = 1.0;
    const barRadius = 0.015;
    const mountWidth = barLength + 0.05;

    const barGeometry = new THREE.CylinderGeometry(barRadius, barRadius, barLength, 32);

    const frontBar = new THREE.Mesh(barGeometry, material);
    frontBar.rotation.z = Math.PI / 2;
    frontBar.position.z = 0.1;
    rackGroup.add(frontBar);

    const backBar = new THREE.Mesh(barGeometry, material);
    backBar.rotation.z = Math.PI / 2;
    backBar.position.z = 0.2;
    backBar.position.y = 0.05;
    rackGroup.add(backBar);

    const mountGroup = new THREE.Group();
    const plateGeometry = new THREE.BoxGeometry(0.04, 0.2, 0.02);
    const armHolderGeometry = new THREE.BoxGeometry(0.1, 0.04, 0.04);

    const leftPlate = new THREE.Mesh(plateGeometry, material);
    const leftArmHolder = new THREE.Mesh(armHolderGeometry, material);
    leftArmHolder.position.z = 0.05;
    leftPlate.add(leftArmHolder);
    leftPlate.position.x = -mountWidth / 2;
    mountGroup.add(leftPlate);

    const rightPlate = leftPlate.clone();
    rightPlate.position.x = mountWidth / 2;
    mountGroup.add(rightPlate);
    rackGroup.add(mountGroup);

    const verticalArmGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 16);
    const arm1 = new THREE.Mesh(verticalArmGeometry, material);
    arm1.position.set(-mountWidth / 2, -0.05, 0.1);
    rackGroup.add(arm1);

    const arm2 = arm1.clone();
    arm2.position.x = mountWidth / 2;
    rackGroup.add(arm2);

    const arm3 = new THREE.Mesh(verticalArmGeometry, material);
    arm3.position.set(-mountWidth / 2, 0, 0.2);
    rackGroup.add(arm3);

    const arm4 = arm3.clone();
    arm4.position.x = mountWidth / 2;
    rackGroup.add(arm4);

    const hookGroup = new THREE.Group();
    const hookMaterial = material.clone();
    const hookStemGeo = new THREE.BoxGeometry(0.02, 0.08, 0.02);
    const hookArmGeo = new THREE.BoxGeometry(0.02, 0.02, 0.05);
    const hookStem = new THREE.Mesh(hookStemGeo, hookMaterial);
    const hookArm = new THREE.Mesh(hookArmGeo, hookMaterial);
    hookArm.position.y = -0.03;
    hookArm.position.z = 0.025;
    hookStem.add(hookArm);
    hookGroup.add(hookStem);
    hookGroup.position.set(-mountWidth / 2, -0.08, 0);
    rackGroup.add(hookGroup);

    return rackGroup;
}


// =================================================================
// HÀM INIT CHÍNH
// =================================================================
export async function init(container) {
    container.innerHTML = '';

    // GIAI ĐOẠN 0: THIẾT LẬP CƠ BẢN
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xE6F7FF);
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 5, 14);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1.2);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    container.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.5, 0);
    controls.enableDamping = true;

    // MỚI: THIẾT LẬP ÂM THANH
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // Tạo một div để yêu cầu người dùng tương tác để bật âm thanh
    const startButton = document.createElement('div');
    startButton.innerHTML = 'Click to Start';
    Object.assign(startButton.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px 40px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        border: '2px solid white',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '24px',
        fontFamily: 'sans-serif',
        textAlign: 'center'
    });
    container.appendChild(startButton);

    const audioLoader = new THREE.AudioLoader();

    // 1. Âm thanh môi trường (Nhạc nền)
    const backgroundMusic = new THREE.Audio(listener);
    audioLoader.load('../meditation.m4a', function(buffer) {
        backgroundMusic.setBuffer(buffer);
        backgroundMusic.setLoop(true);
        backgroundMusic.setVolume(0.8);
    });

    // 2. Âm thanh định vị (Tiếng nước)
    const waterSound = new THREE.PositionalAudio(listener);
    audioLoader.load('../bubbles.m4a', function(buffer) {
        waterSound.setBuffer(buffer);
        waterSound.setRefDistance(10);
        waterSound.setRolloffFactor(2);
        waterSound.setLoop(true);
        waterSound.setVolume(0.2);
    });
    
    // Sự kiện click để bật âm thanh (do chính sách của trình duyệt)
    startButton.addEventListener('click', () => {
        if(backgroundMusic.buffer && !backgroundMusic.isPlaying) backgroundMusic.play();
        if(waterSound.buffer && !waterSound.isPlaying) waterSound.play();
        startButton.style.display = 'none'; // Ẩn nút đi
    }, { once: true });


    // --- Chuẩn bị Vật liệu ---
    const textureLoader = new THREE.TextureLoader();
    const darkTileTexture = textureLoader.load('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');
    darkTileTexture.wrapS = darkTileTexture.wrapT = THREE.RepeatWrapping;
    darkTileTexture.repeat.set(2, 6);
    
    const pebbleTexture = textureLoader.load('../pebbles.jpeg');
    pebbleTexture.wrapS = pebbleTexture.wrapT = THREE.RepeatWrapping;
    pebbleTexture.repeat.set(10, 15);
    
    const dudvMap = textureLoader.load('../water_dudv.webp');
    dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;

    const materials = {
        ceiling: new THREE.MeshStandardMaterial({ color: 0xffffff }),
        darkWall: new THREE.MeshStandardMaterial({ map: darkTileTexture, roughness: 0.5 }),
        wallPanel: new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.7 }),
        glass: new THREE.MeshPhysicalMaterial({ roughness: 0.1, transmission: 1, thickness: 0.1 }),
        pebbles: new THREE.MeshStandardMaterial({ map: pebbleTexture, roughness: 0.8 }),
        steppingStone: new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.6 }),
        poolBody: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 }),
        planter: new THREE.MeshStandardMaterial({ color: 0xffffff }),
        plant: new THREE.MeshStandardMaterial({ color: 0x228B22 }),
        // MỚI: Vật liệu cho giá treo
        metalRack: new THREE.MeshStandardMaterial({
             color: 0xd0d0d0,
             metalness: 0.9,
             roughness: 0.4
         }),
    };


    // GIAI ĐOẠN 1: DỰNG KIẾN TRÚC PHÒNG
    const roomConfig = { roomLength: 20, roomWidth: 7, roomHeight: 4.5 };
    const { roomWidth, roomLength, roomHeight } = roomConfig;
    const architectureGroup = new THREE.Group();
    
    // THAY ĐỔI: Làm trần nhà dày hơn
    const ceilingThickness = 0.2; // Độ dày của trần nhà, bạn có thể thay đổi số này
    const ceiling = new THREE.Mesh(
        new THREE.BoxGeometry(roomWidth, ceilingThickness, roomLength), // Đổi từ PlaneGeometry thành BoxGeometry
        materials.ceiling // Sử dụng vật liệu đã có
    );
    // Điều chỉnh lại vị trí Y để mặt dưới của trần nhà đúng bằng roomHeight
    ceiling.position.y = roomHeight - (ceilingThickness / 2) + 0.2;
    ceiling.position.x = -0.1
    architectureGroup.add(ceiling);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomLength), new THREE.MeshStandardMaterial({color: 0x222222}));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.position.x = 0;
    architectureGroup.add(floor);
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, roomHeight, roomLength), materials.darkWall);
    leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0); leftWall.receiveShadow = true;
    architectureGroup.add(leftWall);
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, 0.2), materials.glass);
    backWall.position.set(0, roomHeight / 2, -roomLength / 2);
    backWall.renderOrder = 2;
    architectureGroup.add(backWall);
    const rightWall = new THREE.Group();
    const panelCount = 15, panelWidth = 0.5, gap = 0.2, totalSegmentWidth = panelWidth + gap;
    for (let i = 0; i < panelCount; i++) {
        const zPos = -roomLength / 2 + i * totalSegmentWidth + totalSegmentWidth / 2;
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.2, roomHeight*0.5, panelWidth), materials.wallPanel);
        panel.position.z = zPos;
        panel.position.y = 1.2;
        panel.position.x = -0.15
        rightWall.add(panel);
        if (i < panelCount - 1) {
            const rectLight = new THREE.RectAreaLight(0xffffff, 5, 0.1, roomHeight * 0.5);
            rectLight.position.set(0.15, roomHeight / 2, zPos + totalSegmentWidth / 2 - gap / 2);
            rectLight.lookAt(0, roomHeight / 2, zPos + totalSegmentWidth / 2 - gap / 2);
            rightWall.add(rectLight);
        }
    }
    rightWall.position.x = roomWidth / 2;
    architectureGroup.add(rightWall);
    scene.add(architectureGroup);

    
    // GIAI ĐOẠN 2: BỐ TRÍ MẶT ĐẤT VÀ HỒ BƠI
    const groundGroup = new THREE.Group();
    groundGroup.position.set(1.5, 0, 0);
    const pebbleGround = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, 0.1, roomLength), materials.pebbles);
    pebbleGround.position.y = 0.05;
    pebbleGround.position.x = -1.5
    groundGroup.add(pebbleGround);
    const steppingStoneGeo = new THREE.BoxGeometry(1, 0.15, 1.5);
    for (let i = 0; i < 8; i++) {
        const stone = new THREE.Mesh(steppingStoneGeo, materials.steppingStone);
        stone.position.set(-3.5, 0.075, -roomLength / 2 + 3 + i * 2);
        groundGroup.add(stone);
    }
    const poolGroup = new THREE.Group();
    poolGroup.position.y = 0.1;
    groundGroup.add(poolGroup);
    // MỚI: Gắn âm thanh nước vào hồ bơi
    poolGroup.add(waterSound);

    const waterWidth = 3, waterLength = 12, waterDepth = 0.7;
    const wallThickness = 0.2, wallHeight = 1.0;
    const wallShape = new THREE.Shape();
    const outerWidth = waterWidth + wallThickness * 2;
    const outerLength = waterLength + wallThickness * 2;
    roundedRect(wallShape, -outerWidth / 2, -outerLength / 2, outerWidth, outerLength, 0.1);
    const innerWallPath = new THREE.Path();
    roundedRect(innerWallPath, -waterWidth / 2, -waterLength / 2, waterWidth, waterLength, 0.05);
    wallShape.holes.push(innerWallPath);
    const wallExtrudeSettings = { depth: wallHeight, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 };
    const wallGeometry = new THREE.ExtrudeGeometry(wallShape, wallExtrudeSettings);
    const poolWalls = new THREE.Mesh(wallGeometry, new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide}));
    poolWalls.rotation.x = -Math.PI / 2;
    poolWalls.position.y = 0;
    poolWalls.castShadow = true;
    poolWalls.receiveShadow = true;
    poolGroup.add(poolWalls);

    // === TẠO NHÓM BỌT KHÍ ===
    const bubbleCount = 30;
    const bubbles = [];
    const bubbleGroup = new THREE.Group();
    for (let i = 0; i < bubbleCount; i++) {
        const radius = Math.random() * 0.07 + 0.03;
        const bubble = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 12, 8),
            new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, roughness: 0.1, thickness: 0.2, transparent: true, opacity: 0.5 })
        );
        bubble.position.x = (Math.random() - 0.5) * waterWidth * 0.8;
        bubble.position.y = Math.random() * waterDepth * 0.2 + 0.1;
        bubble.position.z = (Math.random() - 0.5) * waterLength * 0.8;
        bubble.userData = { speed: Math.random() * 0.15 + 0.07 };
        bubbles.push(bubble);
        bubbleGroup.add(bubble);
    }
    poolGroup.add(bubbleGroup);

    // === TẠO QUẢ BÓNG NỔI TRÊN MẶT NƯỚC ===
    const ballRadius = 0.25;
    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(ballRadius, 64, 32),
        new THREE.MeshPhysicalMaterial({ color: 0xff4444, roughness: 0.15, metalness: 0.3, transmission: 0.6, thickness: 0.3, clearcoat: 1, clearcoatRoughness: 0.05, reflectivity: 0.7, ior: 1.4 })
    );
    ball.position.set(0, waterDepth + ballRadius, 0);
    poolGroup.add(ball);

    // GIAI ĐOẠN 3: TẠO HIỆU ỨNG NƯỚC
    const waterShape = new THREE.Shape();
    roundedRect(waterShape, -waterWidth / 2, -waterLength / 2, waterWidth, waterLength, 0.05);
    const waterGeometry = new THREE.ShapeGeometry(waterShape);
    
    const depthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, blending: THREE.NoBlending });
    const waterMaterial = new THREE.MeshPhysicalMaterial({ color: 0x24919B, transmission: 1, roughness: 0.05, thickness: 0.5, ior: 1.33, transparent: true, opacity: 0.8 });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = waterDepth;
    water.renderOrder = 1;
    water.material.depthWrite = false;
    water.material.depthTest = true;
    poolGroup.add(water);

    const basinFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(waterWidth, waterLength),
        new THREE.MeshStandardMaterial({ color: 0xADD8E6 })
    );
    basinFloor.rotation.x = -Math.PI / 2;
    basinFloor.position.y = 0.2;
    poolGroup.add(basinFloor);

    scene.add(groundGroup);

    // GIAI ĐOẠN 4: ÁNH SÁNG VÀ CHI TIẾT
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    for (let i = 0; i < 3; i++) {
        const spotLight = new THREE.SpotLight(0xffffff, 2.5, 18, Math.PI * 0.25, 0.3, 1);
        spotLight.position.set(0, roomHeight - 0.05, -roomLength / 2 + (i + 1) * (roomLength / 4));
        spotLight.target.position.set(0, 0, spotLight.position.z);
        scene.add(spotLight);
        scene.add(spotLight.target);

        const bulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 20, 8),
            new THREE.MeshStandardMaterial({ emissive: 0xffffff, color: 0xffffee })
        );
        bulb.position.copy(spotLight.position);
        scene.add(bulb);
    }
    const decorationsGroup = new THREE.Group();
    const planter = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, 1.2), materials.planter);
    planter.position.y = 0.6;
    decorationsGroup.add(planter);
    const loader = new GLTFLoader();
    try {
        const gltf = await loader.loadAsync('https://threejs.org/examples/models/gltf/PrimaryIonDrive.glb'); // Thay thế model
        const plantModel = gltf.scene;
        plantModel.scale.set(0.2, 0.2, 0.2); // Điều chỉnh scale cho phù hợp
        plantModel.position.y = 1.2;
        decorationsGroup.add(plantModel);
    } catch (error) { console.error("Không thể tải model.", error); }
    decorationsGroup.position.set(-2.8, 0, roomLength / 2 - 2);
    scene.add(decorationsGroup);

    const floorDecor = new THREE.Mesh(
        new THREE.PlaneGeometry(2, roomLength),
        new THREE.MeshStandardMaterial({color: 0xcccccc})
    );
    floorDecor.rotation.x = -Math.PI / 2;
    floorDecor.position.x = -2.5;
    floorDecor.position.y = 0.01;
    architectureGroup.add(floorDecor);

    // MỚI: TẠO VÀ ĐẶT GIÁ TREO KHĂN
    const towelRack = createTowelRack(materials.metalRack);
    towelRack.position.set(-roomWidth / 2 + 0.15, 2.2, -5);
    towelRack.rotation.y = Math.PI / 2;
    towelRack.scale.set(1.5, 1.5, 1.5); // Làm cho nó to hơn một chút
    scene.add(towelRack);


    // GIAI ĐOẠN CUỐI: VÒNG LẶP ANIMATION
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);

        for (const bubble of bubbles) {
            bubble.position.y += bubble.userData.speed * 0.01;
            if (bubble.position.y > waterDepth - 0.05) {
                bubble.position.x = (Math.random() - 0.5) * waterWidth * 0.8;
                bubble.position.y = 0.1;
                bubble.position.z = (Math.random() - 0.5) * waterLength * 0.8;
                bubble.userData.speed = Math.random() * 0.15 + 0.07;
                const newRadius = Math.random() * 0.07 + 0.03;
                bubble.geometry.dispose();
                bubble.geometry = new THREE.SphereGeometry(newRadius, 12, 8);
            }
        }

        const t = clock.getElapsedTime();
        const floatCenterX = waterWidth * 0.25;
        const floatRange = waterWidth * 0.18;
        ball.position.x = floatCenterX + Math.sin(t * 0.5) * floatRange;
        ball.position.z = 0;
        ball.position.y = waterDepth + ballRadius * 0.5 + Math.sin(t * 0.7) * 0.03;

        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}
