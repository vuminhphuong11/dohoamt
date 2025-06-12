//Vũ Minh Hiển ID-20224311
import * as THREE from 'three';
import { OrbitControls } from '/OrbitControls.js';
// phòng ngủ
export function init(container) {

    //=================================================================
    // 1. THIẾT LẬP CƠ BẢN
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
       const textureLoader2 = new THREE.TextureLoader();
       textureLoader2.load('./background.jpg', (texture) => {
            scene.background = texture;
       });
    //=================================================================
    // 2. ÂM THANH VÀ NÚT BẤM
    //=================================================================
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const sound = new THREE.Audio(listener);
    let isAudioInitialized = false;

    const musicToggleButton = document.createElement('button');
    musicToggleButton.id = 'musicToggleButton';
    musicToggleButton.textContent = 'Bật nhạc';
    container.appendChild(musicToggleButton);

    musicToggleButton.addEventListener('click', () => {
        if (!isAudioInitialized) {
            if (listener.context.state === 'suspended') {
                listener.context.resume();
            }
            const audioLoader = new THREE.AudioLoader();
            musicToggleButton.textContent = 'Đang tải...';
            musicToggleButton.disabled = true;
            audioLoader.load('music.mp3',
                function(buffer) {
                    sound.setBuffer(buffer);
                    sound.setLoop(true);
                    sound.setVolume(0.3);
                    sound.play();
                    isAudioInitialized = true;
                    musicToggleButton.textContent = 'Tắt nhạc';
                    musicToggleButton.disabled = false;
                }
            );
        } else {
            if (sound.isPlaying) {
                sound.pause();
                musicToggleButton.textContent = 'Bật nhạc';
            } else {
                sound.play();
                musicToggleButton.textContent = 'Tắt nhạc';
            }
        }
    });

    
    //=================================================================
    // 4. TẠO DỰNG CÁC VẬT THỂ (CHI TIẾT)
    //=================================================================

    // ----- KHAI BÁO BIẾN DÙNG CHUNG -----
    const roomWidth = 10, roomHeight = 5, roomDepth = 10, wallThickness = 0.1;
    let pulsatingLight;
    let personGroup;
    let wardrobeBBox;
    let walkDirection = 1;
    const walkSpeed = 0.03;
    const personRadius = 0.4;
    let leftArm, rightArm, leftLeg, rightLeg;

    // ----- Tạo phòng -----
    const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xaff8f5 });
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth), wallMaterial);
    leftWall.position.set(-roomWidth / 2 + wallThickness / 2, 0, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth), wallMaterial);
    rightWall.position.set(roomWidth / 2 - wallThickness / 2, 0, 0);
    rightWall.receiveShadow = true;
    scene.add(rightWall);
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness), wallMaterial);
    backWall.position.set(0, 0, -roomDepth / 2 + wallThickness / 2);
    backWall.receiveShadow = true;
    scene.add(backWall);
    const floor = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, wallThickness, roomDepth), new THREE.MeshPhongMaterial({ color: 0xFFEBCD }));
    floor.position.set(0, -roomHeight / 2 - wallThickness / 2, 0);
    floor.receiveShadow = true;
    scene.add(floor);
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, wallThickness, roomDepth), new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
    ceiling.position.set(0, roomHeight / 2 + wallThickness / 2, 0);
    scene.add(ceiling);

    // ----- Cửa sổ -----
    const windowWidth = 2.5;
    const windowHeight = 2.2;
    const windowFrameThickness = 0.1;
    const windowMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const glassMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.5 });
    const windowFrameTopGeometry = new THREE.BoxGeometry(windowWidth + windowFrameThickness * 2, windowFrameThickness, windowFrameThickness);
    const windowFrameTop = new THREE.Mesh(windowFrameTopGeometry, windowMaterial);
    windowFrameTop.position.set(0, windowHeight / 2 + windowFrameThickness / 2, -roomDepth / 2 + wallThickness);
    scene.add(windowFrameTop);
    const windowFrameBottomGeometry = new THREE.BoxGeometry(windowWidth + windowFrameThickness * 2, windowFrameThickness, windowFrameThickness);
    const windowFrameBottom = new THREE.Mesh(windowFrameBottomGeometry, windowMaterial);
    windowFrameBottom.position.set(0, -windowHeight / 2 - windowFrameThickness / 2, -roomDepth / 2 + wallThickness);
    scene.add(windowFrameBottom);
    const windowFrameLeftGeometry = new THREE.BoxGeometry(windowFrameThickness, windowHeight, windowFrameThickness);
    const windowFrameLeft = new THREE.Mesh(windowFrameLeftGeometry, windowMaterial);
    windowFrameLeft.position.set(-windowWidth / 2 - windowFrameThickness / 2, 0, -roomDepth / 2 + wallThickness);
    scene.add(windowFrameLeft);
    const windowFrameRightGeometry = new THREE.BoxGeometry(windowFrameThickness, windowHeight, windowFrameThickness);
    const windowFrameRight = new THREE.Mesh(windowFrameRightGeometry, windowMaterial);
    windowFrameRight.position.set(windowWidth / 2 + windowFrameThickness / 2, 0, -roomDepth / 2 + wallThickness);
    scene.add(windowFrameRight);
    const windowGlassGeometry = new THREE.PlaneGeometry(windowWidth, windowHeight);
    const windowGlass = new THREE.Mesh(windowGlassGeometry, glassMaterial);
    windowGlass.position.set(0, 0, -roomDepth / 2 + wallThickness + 0.01);
    scene.add(windowGlass);
    const curtainWidth = 2.7;
    const curtainHeight = 2.3;
    const curtainGeometry = new THREE.PlaneGeometry(curtainWidth, curtainHeight);
    const curtainMaterial = new THREE.MeshBasicMaterial({ color: 0xF0F0F0, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const curtain = new THREE.Mesh(curtainGeometry, curtainMaterial);
    curtain.position.set(0, 0.5, -roomDepth / 2 + wallThickness + 0.02);
    scene.add(curtain);

    // ----- Tạo giường -----
    const bedWidth = 3.4, bedHeight = 0.6, bedDepth = 3.8;
    const bedGroup = new THREE.Group();
    const bedFrameMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const frameGeometry = new THREE.BoxGeometry(bedWidth, bedHeight, bedDepth);
    const bedFrame = new THREE.Mesh(frameGeometry, bedFrameMaterial);
    bedFrame.castShadow = true;
    bedFrame.receiveShadow = true;
    bedGroup.add(bedFrame);
    const mattressWidth = bedWidth * 0.95, mattressHeight = 0.2, mattressDepth = bedDepth * 0.95;
    const mattressMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const mattressGeometry = new THREE.BoxGeometry(mattressWidth, mattressHeight, mattressDepth);
    const mattress = new THREE.Mesh(mattressGeometry, mattressMaterial);
    mattress.position.y = bedHeight / 2 + mattressHeight / 2 - 0.1;
    mattress.castShadow = true;
    mattress.receiveShadow = true;
    bedGroup.add(mattress);
    const headboardHeight = 1.2;
    const headboardWidth = bedWidth;
    const headboardDepth = 0.1;
    const headboardGeometry = new THREE.BoxGeometry(headboardWidth, headboardHeight, headboardDepth);
    const headboard = new THREE.Mesh(headboardGeometry, bedFrameMaterial);
    headboard.position.set(0, bedHeight / 2 + headboardHeight / 2 - (bedHeight - mattressHeight) / 2, -bedDepth / 2 - headboardDepth / 2);
    headboard.castShadow = true;
    headboard.receiveShadow = true;
    bedGroup.add(headboard);
    const pillowMaterial = new THREE.MeshPhongMaterial({ color: 0xe0e0e0 });
    const pillowGeometry = new THREE.BoxGeometry(0.8, 0.15, 0.45);
    const pillow1 = new THREE.Mesh(pillowGeometry, pillowMaterial);
    pillow1.position.set(-bedWidth / 4, mattress.position.y + mattressHeight / 2 + 0.15 / 2, -bedDepth / 2 + 0.7);
    pillow1.rotation.y = -Math.PI / 16;
    pillow1.castShadow = true;
    pillow1.receiveShadow = true;
    bedGroup.add(pillow1);
    const pillow2 = new THREE.Mesh(pillowGeometry, pillowMaterial);
    pillow2.position.set(bedWidth / 4, mattress.position.y + mattressHeight / 2 + 0.15 / 2, -bedDepth / 2 + 0.7);
    pillow2.rotation.y = Math.PI / 16;
    pillow2.castShadow = true;
    pillow2.receiveShadow = true;
    bedGroup.add(pillow2);
    const blanketHeight = 0.05;
    const blanketGeometry = new THREE.BoxGeometry(mattressWidth * 0.98, blanketHeight, mattressDepth * 0.7);
    const blanketMaterial = new THREE.MeshPhongMaterial({ color: 0x6495ED });
    const blanket = new THREE.Mesh(blanketGeometry, blanketMaterial);
    blanket.position.set(0, mattress.position.y + mattressHeight / 2 + blanketHeight / 2, mattressDepth * 0.15);
    blanket.castShadow = true;
    blanket.receiveShadow = true;
    bedGroup.add(blanket);
    bedGroup.position.set(-2, -roomHeight / 2 + bedHeight / 2 + wallThickness, 0);
    scene.add(bedGroup);

    // ----- Thảm -----
    const rugWidth = bedWidth + 1, rugDepth = bedDepth + 1, rugHeight = 0.05;
    const rug = new THREE.Mesh(new THREE.BoxGeometry(rugWidth, rugHeight, rugDepth), new THREE.MeshPhongMaterial({ color: 0x800080 }));
    rug.position.set(bedGroup.position.x, -roomHeight / 2 + rugHeight / 2 + wallThickness, bedGroup.position.z);
    rug.receiveShadow = true;
    scene.add(rug);

    // ----- Bàn học -----
    const modernDeskGroup = new THREE.Group();
    const grayDeskMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
    const tableTopWidth = 2.8, tableTopHeight = 0.1, tableTopDepth = 3;
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(tableTopWidth, tableTopHeight, tableTopDepth), grayDeskMaterial);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    modernDeskGroup.add(tableTop);
    const deskLegHeight = 1.4, legRadius = 0.1;
    const deskLegGeometry = new THREE.CylinderGeometry(legRadius, legRadius, deskLegHeight, 16);
    const legPositions = [
        { x: -tableTopWidth / 2 + legRadius * 2, z: -tableTopDepth / 2 + legRadius * 2 },
        { x: tableTopWidth / 2 - legRadius * 2, z: -tableTopDepth / 2 + legRadius * 2 },
        { x: -tableTopWidth / 2 + legRadius * 2, z: tableTopDepth / 2 - legRadius * 2 },
        { x: tableTopWidth / 2 - legRadius * 2, z: tableTopDepth / 2 - legRadius * 2 }
    ];
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(deskLegGeometry, grayDeskMaterial);
        leg.position.set(pos.x, -tableTopHeight / 2 - deskLegHeight / 2, pos.z);
        leg.castShadow = true;
        leg.receiveShadow = true;
        modernDeskGroup.add(leg);
    });
    modernDeskGroup.position.set(3, -roomHeight / 2 + deskLegHeight + wallThickness, -2.5);
    scene.add(modernDeskGroup);

    // ----- Đèn ngủ -----
    const modernLampGroup = new THREE.Group();
    const lampBaseRadius = 0.15, lampBaseHeight = 0.02;
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(lampBaseRadius, lampBaseRadius, lampBaseHeight, 32), new THREE.MeshPhongMaterial({ color: 0x444444 }));
    lampBase.castShadow = true;
    modernLampGroup.add(lampBase);
    const standHeight = 0.5, standRadius = 0.015;
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(standRadius, standRadius, standHeight, 16), new THREE.MeshPhongMaterial({ color: 0x666666 }));
    stand.position.y = lampBaseHeight / 2 + standHeight / 2;
    stand.castShadow = true;
    modernLampGroup.add(stand);
    const shadeHeight = 0.2, shadeRadius = 0.2;
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(shadeRadius * 0.8, shadeRadius, shadeHeight, 32), new THREE.MeshPhongMaterial({ color: 0xFFD700 }));
    shade.position.y = stand.position.y + standHeight / 2 + shadeHeight / 2;
    shade.castShadow = true;
    modernLampGroup.add(shade);
    const spotLight = new THREE.SpotLight(0xFFD700, 5, 10, Math.PI * 0.3, 0.5);
    spotLight.position.set(0, shade.position.y - 0.1, 0);
    spotLight.target.position.set(0, 0, 0);
    spotLight.castShadow = true;
    modernLampGroup.add(spotLight);
    modernLampGroup.add(spotLight.target);
    modernLampGroup.position.set(modernDeskGroup.position.x - tableTopWidth / 3, modernDeskGroup.position.y + tableTopHeight / 2 + lampBaseHeight / 2, modernDeskGroup.position.z);
    scene.add(modernLampGroup);

    // ----- Laptop -----
    const laptopGroup = new THREE.Group();
    const laptopWidth = 1.2, laptopDepth = 0.8, laptopHeight = 0.05;
    const laptopMaterial = new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 30 });
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x00FFFF, emissive: 0x00FFFF, emissiveIntensity: 1 });
    const laptopBody = new THREE.Mesh(new THREE.BoxGeometry(laptopWidth, laptopHeight, laptopDepth), laptopMaterial);
    laptopBody.castShadow = true;
    laptopBody.receiveShadow = true;
    laptopGroup.add(laptopBody);
    const screenHeight = laptopDepth * 0.9, screenThickness = 0.02;
    const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(laptopWidth, screenHeight, screenThickness), screenMaterial);
    laptopScreen.position.set(0, laptopHeight / 2 + screenHeight / 2 - screenThickness / 2, -laptopDepth / 2 - screenThickness / 2 + 0.01);
    laptopScreen.rotation.x = -Math.PI / 12;
    laptopScreen.castShadow = true;
    laptopGroup.add(laptopScreen);
    laptopGroup.position.set(modernDeskGroup.position.x + 0.3, modernDeskGroup.position.y + tableTopHeight / 2 + laptopHeight / 2 + 0.01, modernDeskGroup.position.z + 0.3);
    laptopGroup.rotation.y = Math.PI / 6;
    scene.add(laptopGroup);

    // ----- Ghế -----
    const chairGroup = new THREE.Group();
    const brownChairMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const seatWidth = 0.6, seatHeight = 0.4, seatDepth = 0.6;
    const seat = new THREE.Mesh(new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth), brownChairMaterial);
    seat.castShadow = true;
    chairGroup.add(seat);
    const backrestHeight = 0.9;
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(seatWidth, backrestHeight, 0.05), brownChairMaterial);
    backrest.position.set(0, seatHeight / 2 + backrestHeight / 2, -seatDepth / 2 + 0.05 / 2);
    backrest.castShadow = true;
    chairGroup.add(backrest);
    const legHeight = 0.5, legSize = 0.05;
    const chairLegGeometry = new THREE.BoxGeometry(legSize, legHeight, legSize);
    const c_frontLeftLeg = new THREE.Mesh(chairLegGeometry, brownChairMaterial);
    c_frontLeftLeg.position.set(-seatWidth / 2 + legSize / 2, -seatHeight / 2 - legHeight / 2, seatDepth / 2 - legSize / 2);
    chairGroup.add(c_frontLeftLeg);
    const c_frontRightLeg = new THREE.Mesh(chairLegGeometry, brownChairMaterial);
    c_frontRightLeg.position.set(seatWidth / 2 - legSize / 2, -seatHeight / 2 - legHeight / 2, seatDepth / 2 - legSize / 2);
    chairGroup.add(c_frontRightLeg);
    const c_backLeftLeg = new THREE.Mesh(chairLegGeometry, brownChairMaterial);
    c_backLeftLeg.position.set(-seatWidth / 2 + legSize / 2, -seatHeight / 2 - legHeight / 2, -seatDepth / 2 + legSize / 2);
    chairGroup.add(c_backLeftLeg);
    const c_backRightLeg = new THREE.Mesh(chairLegGeometry, brownChairMaterial);
    c_backRightLeg.position.set(seatWidth / 2 - legSize / 2, -seatHeight / 2 - legHeight / 2, -seatDepth / 2 + legSize / 2);
    chairGroup.add(c_backRightLeg);
    chairGroup.position.set(3, -roomHeight / 2 + legHeight + wallThickness, 0.3);
    chairGroup.rotation.y = Math.PI;
    scene.add(chairGroup);

    // ----- Kệ sách -----
    const shelfWidth = 3, shelfHeight = 0.1, shelfDepth = 0.3, shelfSpacing = 0.5, numShelves = 3;
    const shelfMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    for (let i = 0; i < numShelves; i++) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth, shelfHeight, shelfDepth), shelfMaterial);
        shelf.position.set(-roomWidth / 1.58 + wallThickness + 1.5, 0.08 + i * (shelfHeight + shelfSpacing), -2);
        shelf.rotation.y = Math.PI / 2;
        shelf.receiveShadow = true;
        scene.add(shelf);
    }
    
    // ----- Tủ quần áo -----
    const wardrobeWidth = 2.5, wardrobeHeight = 3, wardrobeDepth_new = 1;
    const wardrobeMaterial = new THREE.MeshStandardMaterial({ color: 0x6B4E31, roughness: 0.7 });
    const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(wardrobeDepth_new, wardrobeHeight, wardrobeWidth), wardrobeMaterial);
    wardrobe.position.set(roomWidth / 2 - wardrobeDepth_new / 2 - wallThickness, -roomHeight / 2 + wardrobeHeight / 2 + wallThickness, 3);
    wardrobe.receiveShadow = true;
    wardrobe.castShadow = true;
    scene.add(wardrobe);
    wardrobeBBox = new THREE.Box3().setFromObject(wardrobe);
    
    // ----- Bức tranh -----
    const paintingWidth = 3.5, paintingHeight = 2.5, paintingPositionZ = 1.8;
    const paintingTexture = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop');
    const painting = new THREE.Mesh(new THREE.PlaneGeometry(paintingWidth, paintingHeight), new THREE.MeshBasicMaterial({ map: paintingTexture }));
    painting.position.set(-roomWidth / 2 + wallThickness + 0.01, roomHeight / 6, paintingPositionZ);
    painting.rotation.y = Math.PI / 2;
    scene.add(painting);

    // ----- Cây xanh -----
    const plantGroup = new THREE.Group();
    const potRadius = 0.3, potHeight = 0.4;
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(potRadius, potRadius * 0.8, potHeight, 16), new THREE.MeshPhongMaterial({ color: 0xD2691E }));
    pot.castShadow = true;
    plantGroup.add(pot);
    const trunkRadius = 0.05, trunkHeight = 0.5;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, 8), new THREE.MeshPhongMaterial({ color: 0x8B4513 }));
    trunk.position.y = potHeight / 2 + trunkHeight / 2;
    trunk.castShadow = true;
    plantGroup.add(trunk);
    const foliageRadius = 0.6, foliageHeight = 1.2;
    const foliage = new THREE.Mesh(new THREE.ConeGeometry(foliageRadius, foliageHeight, 16), new THREE.MeshPhongMaterial({ color: 0x228B22 }));
    foliage.position.y = trunk.position.y + trunkHeight / 2 + foliageHeight / 2;
    foliage.castShadow = true;
    plantGroup.add(foliage);
    plantGroup.position.set(-roomWidth / 2 + potRadius + wallThickness + 0.2, -roomHeight / 2 + potHeight / 2 + wallThickness, 4.5);
    scene.add(plantGroup);

    // ----- Loa phát nhạc -----
    const speakerGroup = new THREE.Group();
    const speakerHeight = 1.2;
    const speakerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, speakerHeight, 32), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.1 }));
    speakerBody.castShadow = true;
    speakerGroup.add(speakerBody);
    pulsatingLight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.03), new THREE.MeshStandardMaterial({ color: 0x00FFFF, emissive: 0xFFFF00, emissiveIntensity: 0 }));
    pulsatingLight.position.set(0, 0.2, 0.4);
    speakerGroup.add(pulsatingLight);
    speakerGroup.position.set(1, -roomHeight / 2 + wallThickness + speakerHeight / 2, 2);
    scene.add(speakerGroup);

    // ----- Người -----
    personGroup = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16), new THREE.MeshStandardMaterial({ color: 0xF5CBA7, roughness: 0.8, metalness: 0.1 }));
    head.position.y = 0.7;
    head.castShadow = true;
    personGroup.add(head);
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0x3D91CC, roughness: 0.7, metalness: 0.0 }));
    torso.castShadow = true;
    personGroup.add(torso);
    const armMaterial = head.material;
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.08, 0.7, 16);
    leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.4, 0.2, 0);
    leftArm.castShadow = true;
    personGroup.add(leftArm);
    rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.4, 0.2, 0);
    rightArm.castShadow = true;
    personGroup.add(rightArm);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2F4F4F, roughness: 0.7, metalness: 0.0 });
    const personLegGeometry = new THREE.CylinderGeometry(0.15, 0.12, 1.0, 16);
    leftLeg = new THREE.Mesh(personLegGeometry, legMaterial);
    leftLeg.position.set(-0.15, -0.9, 0);
    leftLeg.castShadow = true;
    personGroup.add(leftLeg);
    rightLeg = new THREE.Mesh(personLegGeometry, legMaterial);
    rightLeg.position.set(0.15, -0.9, 0);
    rightLeg.castShadow = true;
    personGroup.add(rightLeg);
    personGroup.position.set(0, -roomHeight / 2 + 1.0 / 2 + wallThickness, 3);
    scene.add(personGroup);

    //=================================================================
    // 5. LOGIC DI CHUYỂN VÀ ANIMATION
    //=================================================================
    camera.position.set(0, 2, 12);
    camera.lookAt(scene.position);

    function updatePerson() {
        if (!personGroup || !wardrobeBBox) return;
        const nextX = personGroup.position.x + walkSpeed * walkDirection;
        const personZ = personGroup.position.z;
        let collision = false;
        if (walkDirection > 0 && nextX + personRadius > wardrobeBBox.min.x && personZ > wardrobeBBox.min.z && personZ < wardrobeBBox.max.z) {
            collision = true;
        }
        if (walkDirection < 0 && nextX - personRadius < -roomWidth / 2 + wallThickness) {
            collision = true;
        }
        if (collision) {
            walkDirection *= -1;
        } else {
            personGroup.position.x = nextX;
        }
        personGroup.rotation.y = walkDirection > 0 ? -Math.PI / 2 : Math.PI / 2;
        const time = Date.now() * 0.005;
        leftArm.rotation.x = Math.sin(time * 5) * 0.5;
        rightArm.rotation.x = -Math.sin(time * 5) * 0.5;
        leftLeg.rotation.x = -Math.sin(time * 5) * 0.5;
        rightLeg.rotation.x = Math.sin(time * 5) * 0.5;
    }

    let animationFrameId;
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        updatePerson();
        if (pulsatingLight) {
            if (sound.isPlaying) {
                const time = Date.now() * 0.008;
                const pulse = (Math.sin(time) + 1) / 2;
                pulsatingLight.material.emissiveIntensity = pulse * 1.5 + 0.5;
            } else {
                pulsatingLight.material.emissiveIntensity = 0;
            }
        }
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    //=================================================================
    // 6. HÀM DỌN DẸP
    //=================================================================
    function cleanup() {
        console.log('Dọn dẹp Page 1');
        cancelAnimationFrame(animationFrameId);
        if (sound && sound.isPlaying) sound.stop();
        if (musicToggleButton && musicToggleButton.parentNode) {
            musicToggleButton.parentNode.removeChild(musicToggleButton);
        }
        renderer.dispose();
        scene.traverse(object => {
            if (object.isMesh) {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            }
        });
    }

    return cleanup;
}