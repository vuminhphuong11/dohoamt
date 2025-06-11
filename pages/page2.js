import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

// =================================================================
// SHADER CODE CHO HIỆU ỨNG NƯỚC NÂNG CAO
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

    // --- Chuẩn bị Vật liệu ---
    const textureLoader = new THREE.TextureLoader();
    const darkTileTexture = textureLoader.load('textures/stone_tiles.jpg');
    darkTileTexture.wrapS = darkTileTexture.wrapT = THREE.RepeatWrapping;
    darkTileTexture.repeat.set(2, 6);
    
    const pebbleTexture = textureLoader.load('textures/pebbles.jpeg');
    pebbleTexture.wrapS = pebbleTexture.wrapT = THREE.RepeatWrapping;
    pebbleTexture.repeat.set(10, 15);
    
    // Texture cho hiệu ứng gợn sóng nước
    const dudvMap = textureLoader.load('textures/water_dudv.webp');
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
    };


    // GIAI ĐOẠN 1: DỰNG KIẾN TRÚC PHÒNG
    // (Code giữ nguyên)
    const roomConfig = { roomLength: 20, roomWidth: 7, roomHeight: 4.5 };
    const { roomWidth, roomLength, roomHeight } = roomConfig;
    const architectureGroup = new THREE.Group();
    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomLength),
        new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = roomHeight;
    architectureGroup.add(ceiling);
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomLength),
        new THREE.MeshStandardMaterial({color: 0x222222})
    );
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
    const panelCount = 15, panelWidth = 0.4, gap = 0.2, totalSegmentWidth = panelWidth + gap;
    for (let i = 0; i < panelCount; i++) {
        const zPos = -roomLength / 2 + i * totalSegmentWidth + totalSegmentWidth / 2;
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.2, roomHeight, panelWidth), materials.wallPanel);
        panel.position.z = zPos;
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
    // (Code giữ nguyên)
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
    const waterWidth = 3, waterLength = 12, waterDepth = 0.7;
    const wallThickness = 0.2, wallHeight = 1.0;
    const islandWidth = 1.5, islandLength = 4, islandHeight = 0.5, islandRadius = 0.5;
    const wallShape = new THREE.Shape();
    const outerWidth = waterWidth + wallThickness * 2;
    const outerLength = waterLength + wallThickness * 2;
    roundedRect(wallShape, -outerWidth / 2, -outerLength / 2, outerWidth, outerLength, 0.1);
    const innerWallPath = new THREE.Path();
    roundedRect(innerWallPath, -waterWidth / 2, -waterLength / 2, waterWidth, waterLength, 0.05);
    wallShape.holes.push(innerWallPath);
    const wallExtrudeSettings = { depth: wallHeight, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 };
    const wallGeometry = new THREE.ExtrudeGeometry(wallShape, wallExtrudeSettings);
    const poolWalls = new THREE.Mesh(wallGeometry, new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    }));
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
            new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                transmission: 1,
                roughness: 0.1,
                thickness: 0.2,
                transparent: true,
                opacity: 0.5
            })
        );
        bubble.position.x = (Math.random() - 0.5) * waterWidth * 0.8;
        bubble.position.y = Math.random() * waterDepth * 0.2 + 0.1;
        bubble.position.z = (Math.random() - 0.5) * waterLength * 0.8;
        bubble.userData = {
            speed: Math.random() * 0.15 + 0.07
        };
        bubbles.push(bubble);
        bubbleGroup.add(bubble);
    }
    poolGroup.add(bubbleGroup);

    // === TẠO QUẢ BÓNG NỔI TRÊN MẶT NƯỚC ===
    const ballRadius = 0.25;
    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(ballRadius, 64, 32),
        new THREE.MeshPhysicalMaterial({
            color: 0xff4444,
            roughness: 0.15,
            metalness: 0.3,
            transmission: 0.6,
            thickness: 0.3,
            clearcoat: 1,
            clearcoatRoughness: 0.05,
            reflectivity: 0.7,
            ior: 1.4
        })
    );
    // Đặt bóng lên mặt nước, vị trí tuỳ ý trong vùng nước
    ball.position.set(0, waterDepth + ballRadius, 0);
    poolGroup.add(ball);

    // === TẠO HIỆU ỨNG GỢN SÓNG QUANH BÓNG ===
    // const waveGeometry = new THREE.RingGeometry(ballRadius * 1.1, ballRadius * 2.2, 64);
    // const waveMaterial = new THREE.MeshBasicMaterial({
    //     color: 0x66ccff,
    //     transparent: true,
    //     opacity: 0.4,
    //     side: THREE.DoubleSide,
    //     depthWrite: false
    // });
    // const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    // wave.rotation.x = -Math.PI / 2;
    // wave.position.set(ball.position.x, waterDepth + 0.01, ball.position.z);
    // poolGroup.add(wave);

    // const wave2 = new THREE.Mesh(waveGeometry.clone(), waveMaterial.clone());
    // wave2.rotation.x = -Math.PI / 2;
    // wave2.position.set(ball.position.x, waterDepth + 0.011, ball.position.z);
    // poolGroup.add(wave2);

    // GIAI ĐOẠN 3: TẠO HIỆU ỨNG NƯỚC ĐƠN GIẢN
    const waterShape = new THREE.Shape();
    roundedRect(waterShape, -waterWidth / 2, -waterLength / 2, waterWidth, waterLength, 0.05);
    const waterGeometry = new THREE.ShapeGeometry(waterShape);
    
    // Vật liệu để render depth pass
    const depthMaterial = new THREE.MeshDepthMaterial({
        depthPacking: THREE.RGBADepthPacking,
        blending: THREE.NoBlending,
    });

    // Vật liệu để render depth pass
    const waterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x24919B,
        transmission: 1,
        roughness: 0.05,
        thickness: 0.5,
        ior: 1.33,
        transparent: true,
        opacity: 0.8
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = waterDepth;
    water.renderOrder = 1;
    water.material.depthWrite = false;
    water.material.depthTest = true;
    poolGroup.add(water);

    const basinFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(waterWidth, waterLength),
        new THREE.MeshStandardMaterial({ color: 0xADD8E6 }) // hoặc vật liệu tiles
    );
    basinFloor.rotation.x = -Math.PI / 2;
    basinFloor.position.y = 0.01; // Đặt sát đáy bể, cao hơn sàn nhà một chút
    poolGroup.add(basinFloor);

    scene.add(groundGroup);

    // GIAI ĐOẠN 4: ÁNH SÁNG VÀ CHI TIẾT
    // (Code giữ nguyên)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    for (let i = 0; i < 3; i++) {
        const spotLight = new THREE.SpotLight(0xffffff, 2.5, 18, Math.PI * 0.25, 0.3, 1);
        spotLight.position.set(0, roomHeight - 0.05, -roomLength / 2 + (i + 1) * (roomLength / 4));
        spotLight.target.position.set(0, 0, spotLight.position.z); // Chiếu thẳng xuống sàn
        scene.add(spotLight);
        scene.add(spotLight.target);

        // (Tùy chọn) Thêm mesh Sphere nhỏ để nhìn vị trí đèn
        const bulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 16, 8),
            new THREE.MeshStandardMaterial({ emissive: 0xffffff, color: 0xffffee })
        );
        bulb.position.copy(spotLight.position);
        scene.add(bulb);
    }
    const decorationsGroup = new THREE.Group();
    const planter = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), materials.planter);
    planter.position.y = 0.6;
    decorationsGroup.add(planter);
    const loader = new GLTFLoader();
    try {
        const gltf = await loader.loadAsync('models/house_plant.glb');
        const plantModel = gltf.scene;
        plantModel.scale.set(1.5, 1.5, 1.5);
        plantModel.position.y = 1.2;
        decorationsGroup.add(plantModel);
    } catch (error) { console.error("Không thể tải model cây.", error); }
    decorationsGroup.position.set(-2.8, 0, roomLength / 2 - 2);
    scene.add(decorationsGroup);

    const floorDecor = new THREE.Mesh(
        new THREE.PlaneGeometry(2, roomLength),
        new THREE.MeshStandardMaterial({color: 0xcccccc})
    );
    floorDecor.rotation.x = -Math.PI / 2;
    floorDecor.position.x = -2.5; // lệch trái
    floorDecor.position.y = 0.01; // nổi lên một chút
    architectureGroup.add(floorDecor);

    // GIAI ĐOẠN CUỐI: VÒNG LẶP ANIMATION (ĐƠN GIẢN HÓA)
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);

        // Animation cho bọt khí
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

        // Bóng nổi lắc lư (chỉ sang trái-phải ở một phía, chuyển động chậm, chìm nửa)
        const t = clock.getElapsedTime();
        const floatCenterX = waterWidth * 0.25; // lệch về bên phải
        const floatRange = waterWidth * 0.18;   // biên độ nhỏ
        ball.position.x = floatCenterX + Math.sin(t * 0.5) * floatRange;
        ball.position.z = 0; // Giữ nguyên ở giữa theo trục z
        ball.position.y = waterDepth + ballRadius * 0.5 + Math.sin(t * 0.7) * 0.03;

        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}
