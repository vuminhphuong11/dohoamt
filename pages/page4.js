import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
export function init(container) {
    container.innerHTML = ''; // Xóa nội dung cũ
    // tạo Scene
    const scene = new THREE.Scene();
    //tạo camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(7, 7, 7);
    camera.lookAt(0,4,0);
    //tạo renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    // điều khiển camera bằng chuột(orbitcontrol trong three)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.5, 0);
    controls.update();
    // thêm ánh sáng
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 5, 3);
    scene.add(directionalLight);
    // === Create Materials ===
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xb0c4de, side: THREE.DoubleSide });
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xE6E4D8, side: THREE.DoubleSide });
    const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f5 });
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5A2B });
    const chairMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    // Floor 
    const floor = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 10), floorMaterial);
    floor.position.y = -0.05; // half thickness below Y=0
    scene.add(floor);
    // // tạo cái bàn
    const tableGroup2 = new THREE.Group();
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 4), tableMaterial);
    tableTop.position.set(0, 1, 0);
    tableGroup2.add(tableTop);
    const legPositions = [
        [-0.7, 0.4, -1.75],
        [0.7, 0.4, -1.75],
        [-0.7, 0.4, 1.75],
        [0.7, 0.4, 1.75]
    ];
    const tableLegs = legPositions.map(pos => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1, 0.2), tableMaterial);
        leg.position.set(...pos);
        tableGroup2.add(leg); // Thêm chân bàn vào nhóm
        return leg;
    });
    scene.add(tableGroup2);
    // tạo ghế
    function createChair(x, z, rotationY) {
        // phần ngồi lên
        const seatWidth = 0.7;
        const seatDepth = 0.8;
        const seatHeight = 0.1;
        const seatY = 0.6;
        const seat = new THREE.Mesh(new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth), chairMaterial);
        seat.position.set(x, seatY, z);
        seat.rotation.y = rotationY;
        scene.add(seat);
        // phần dựa lưng
        const backrestWidth = seatWidth * 0.9;  
        const backrestHeight = 0.9;              
        const backrestDepth = 0.05;            
        const backrest = new THREE.Mesh(new THREE.BoxGeometry(backrestWidth, backrestHeight, backrestDepth), chairMaterial);
        backrest.position.set(
            x - (seatDepth / 2 - backrestDepth / 2) * Math.sin(rotationY),
            seatY + backrestHeight / 2,
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
            leg.position.set(x + offsetX, legHeight / 2, z + offsetZ);
            scene.add(leg);
        });
    }
    createChair(1, -1, -Math.PI/2);      
    createChair(1, 1, -Math.PI/2);
    createChair(-1, 1, Math.PI/2); 
    createChair(-1, -1, Math.PI/2);

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
    fridge.rotation.y=-Math.PI/2;
    fridge.position.set(4.3, 1.6, 2);
    scene.add(fridge);
    // Add sink
    const sinkGeometry = new THREE.BoxGeometry(2.5, 1.7, 1.5);
    const sinkMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const sink = new THREE.Mesh(sinkGeometry, sinkMaterial);
    sink.position.set(2.25, 0.85,-4.2);
    scene.add(sink);
    // Add countertop to right corner
    const counterGeometry = new THREE.BoxGeometry(1.5, 1.7, 6);
    const counterMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const counter = new THREE.Mesh(counterGeometry, counterMaterial);
    counter.position.set(4.2, 0.85, -1.95);
    scene.add(counter);
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
    // // Bulb base (cylinder)
    const bulbBaseGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.25, 32);
    const bulbBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const bulbBase = new THREE.Mesh(bulbBaseGeometry, bulbBaseMaterial);
    bulbBase.rotation.z = Math.PI / 2;
    bulbBase.position.set(4.85, 3.8, -1.5); // Right wall above countertop
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
    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    // Gas stove on countertop
    const stoveMaterial = new THREE.MeshStandardMaterial({ color: 0x123456 }); // Stainless steel
    // Stove base
    const stoveBaseGeometry = new THREE.BoxGeometry(1, 0.2, 1.5); // Adjusted depth for 2 burners
    const stoveBase = new THREE.Mesh(stoveBaseGeometry, stoveMaterial);
    stoveBase.position.set(4.25, 1.7, -1.8); // On countertop
    stoveBase.castShadow = true;
    stoveBase.receiveShadow = true;
    scene.add(stoveBase);
    // Burners (2, larger, side by side)
    const burnerGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.02, 64); // Larger radius
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
    const knobGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.06, 32); // Fixed duplicate definition
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
        flameGroup.position.set(4.25 + pos[0], 1.71, -1.8 + pos[2]); // Above burner
        scene.add(flameGroup);
        flameGroups.push(flameGroup);
    });
    // Frying pan on left burner
    const panMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const panBottomGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.05, 32); // Radius 0.28
    const panBottom = new THREE.Mesh(panBottomGeometry, panMaterial);
    panBottom.position.set(4.25 + 0.1, 1.81 + 0.025, -1.8 - 0.4); // Above left burner
    panBottom.castShadow = true;
    panBottom.receiveShadow = true;
    scene.add(panBottom);
    const panWallGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 32, 1, true); // Radius 0.28
    const panWall = new THREE.Mesh(panWallGeometry, panMaterial);
    panWall.position.set(4.25 + 0.1, 1.81 + 0.05, -1.8 - 0.4);
    panWall.castShadow = true;
    panWall.receiveShadow = true;
    scene.add(panWall);
    const handleGeometry = new THREE.BoxGeometry(0.3, 0.03, 0.05); // Handle
    const handle = new THREE.Mesh(handleGeometry, panMaterial);
    handle.position.set(4.25 + 0.1 - 0.3, 1.81 + 0.05, -1.8 - 0.2); // Attached at edge
    handle.rotation.y = Math.PI / 6;
    handle.castShadow = true;
    handle.receiveShadow = true;
    scene.add(handle);
    // Stock pot on right burner
    const potMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const potBottomGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.05, 32); // Radius 0.28
    const potBottom = new THREE.Mesh(potBottomGeometry, potMaterial);
    potBottom.position.set(4.25 + 0.1, 1.81 + 0.025, -1.8 + 0.4); // Above right burner
    potBottom.castShadow = true;
    potBottom.receiveShadow = true;
    scene.add(potBottom);
    const potWallGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.4, 32, 1, true); // Radius 0.28
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
    // Steak in frying pan (rectangular with fat cap)
    const steakMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 }); // Red raw meat
    const steakGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.45); // Thicker rectangle
    const steak = new THREE.Mesh(steakGeometry, steakMaterial);
    steak.position.set(4.25 + 0.1, 1.81 + 0.09, -1.8 - 0.4); // Center of pan, above bottom
    steak.castShadow = true;
    steak.receiveShadow = true;
    scene.add(steak);
    const fatCapMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White fat
    const fatCapGeometry = new THREE.BoxGeometry(0.04, 0.08, 0.15); // Thin strip for fat cap
    const fatCap = new THREE.Mesh(fatCapGeometry, fatCapMaterial);
    fatCap.position.set(4.35  + 0.12, 1.81 + 0.09, -1.8 - 0.4); // Attached to right side of steak
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
    const waterGeometry = new THREE.CylinderGeometry(0.27, 0.27, 0.01, 32); // Slightly smaller than pot radius
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.set(4.35 , 1.81 + 0.35, -1.4); // Near top of pot
    water.castShadow = true;
    water.receiveShadow = true;
    scene.add(water);
    // Update animation loop for boiling water effect
    const animate = () => {
        requestAnimationFrame(animate);
        // Spin the fan
        fanBody.rotation.y += 0.15;
        // Flicker flames
        flameGroups.forEach((group, index) => {
            group.children.forEach((flame, flameIndex) => {
                flame.scale.y = 1 + 0.1 * Math.sin(Date.now() * 0.005 + index + flameIndex * 0.2);
            });
        });
        // Boiling water effect
        water.position.y = 1.81 + 0.35 + 0.005 * Math.sin(Date.now() * 0.01); // Slight ripple
        controls.update();
        renderer.render(scene, camera);
    };

    animate();
}
