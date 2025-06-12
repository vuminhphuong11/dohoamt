//AUTHOR: VŨ MINH HIỂN - ID: 20224311
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js';

// Khởi tạo scene, camera và renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

// === LOGIC ÂM THANH ===
const listener = new THREE.AudioListener();
camera.add(listener);
const sound = new THREE.Audio(listener);
const musicToggleButton = document.getElementById('musicToggleButton');
let isAudioInitialized = false;

musicToggleButton.addEventListener('click', () => {
    if (!isAudioInitialized) {
        if (listener.context.state === 'suspended') {
            listener.context.resume();
        }
        const audioLoader = new THREE.AudioLoader();
        musicToggleButton.textContent = 'Đang tải...';
        musicToggleButton.disabled = true;
        audioLoader.load(
            'music.mp3',
            function(buffer) {
                sound.setBuffer(buffer);
                sound.setLoop(true);
                sound.setVolume(0.3);
                sound.play();
                isAudioInitialized = true;
                musicToggleButton.textContent = 'Tắt nhạc';
                musicToggleButton.disabled = false;
            },
            undefined,
            function (err) {
                console.error('Lỗi khi tải file âm thanh.', err);
                musicToggleButton.textContent = 'Lỗi âm thanh';
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

// === KHAI BÁO BIẾN CHO HIỆU ỨNG ===
// Khai báo biến đèn của loa ở đây để hàm animate có thể truy cập
let pulsatingLight;

// Ánh sáng
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 12;
directionalLight.shadow.camera.far = 100;

// Tạo phòng
const roomWidth = 10;
const roomHeight = 5;
const roomDepth = 10;
const wallThickness = 0.1;
const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xaff8f5 });

// Tường trái
const leftWallGeometry = new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth);
const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
leftWall.position.set(-roomWidth / 2 + wallThickness / 2, 0, 0);
leftWall.receiveShadow = true;
leftWall.castShadow = true;
scene.add(leftWall);

// Tường phải
const rightWallGeometry = new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth);
const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
rightWall.position.set(roomWidth / 2 - wallThickness / 2, 0, 0);
rightWall.receiveShadow = true;
rightWall.castShadow = true;
scene.add(rightWall);

// Tường sau
const backWallGeometry = new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness);
const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
backWall.position.set(0, 0, -roomDepth / 2 + wallThickness / 2);
backWall.receiveShadow = true;
backWall.castShadow = true;
scene.add(backWall);

// Sàn nhà
const floorGeometry = new THREE.BoxGeometry(roomWidth, wallThickness, roomDepth);
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xFFEBCD });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0, -roomHeight / 2 - wallThickness / 2, 0);
floor.receiveShadow = true;
floor.castShadow = true;
scene.add(floor);

// Trần nhà
const ceilingGeometry = new THREE.BoxGeometry(roomWidth, wallThickness, roomDepth);
const ceilingMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceiling.position.set(0, roomHeight / 2 + wallThickness / 2, 0);
ceiling.receiveShadow = true;
scene.add(ceiling);

// Cửa sổ
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

// Rèm cửa
const curtainWidth = 2.7;
const curtainHeight = 2.3;
const curtainGeometry = new THREE.PlaneGeometry(curtainWidth, curtainHeight);
const curtainMaterial = new THREE.MeshBasicMaterial({ color: 0xF0F0F0, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
const curtain = new THREE.Mesh(curtainGeometry, curtainMaterial);
curtain.position.set(0, 0.5, -roomDepth / 2 + wallThickness + 0.02);
scene.add(curtain);

//Tạo giường
const bedWidth = 3.4;
const bedHeight = 0.6;
const bedDepth = 3.8;
const bedGroup = new THREE.Group();
const bedFrameMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
const frameGeometry = new THREE.BoxGeometry(bedWidth, bedHeight, bedDepth);
const bedFrame = new THREE.Mesh(frameGeometry, bedFrameMaterial);
bedFrame.castShadow = true;
bedFrame.receiveShadow = true;
bedGroup.add(bedFrame);
const mattressWidth = bedWidth * 0.95;
const mattressHeight = 0.2;
const mattressDepth = bedDepth * 0.95;
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

// TẠO THẢM DƯỚI CHÂN GIƯỜNG
const rugWidth = bedWidth + 1;
const rugDepth = bedDepth + 1;
const rugHeight = 0.05;
const rugGeometry = new THREE.BoxGeometry(rugWidth, rugHeight, rugDepth);
const rugMaterial = new THREE.MeshPhongMaterial({ color: 0x800080 });
const rug = new THREE.Mesh(rugGeometry, rugMaterial);
rug.position.set(bedGroup.position.x, -roomHeight / 2 + rugHeight / 2 + wallThickness, bedGroup.position.z);
rug.receiveShadow = true;
scene.add(rug);

// ---- TẠO BÀN HỌC HIỆN ĐẠI ----
const modernDeskGroup = new THREE.Group();
const grayDeskMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
const tableTopWidth = 2.8;
const tableTopHeight = 0.1;
const tableTopDepth = 3;
const tableTopGeometry = new THREE.BoxGeometry(tableTopWidth, tableTopHeight, tableTopDepth);
const tableTop = new THREE.Mesh(tableTopGeometry, grayDeskMaterial);
tableTop.castShadow = true;
tableTop.receiveShadow = true;
modernDeskGroup.add(tableTop);
const deskLegHeight = 1.4;
const legRadius = 0.1;
const deskLegGeometry = new THREE.CylinderGeometry(legRadius, legRadius, deskLegHeight, 16);
const legPositions = [{
    x: -tableTopWidth / 2 + legRadius * 2,
    z: -tableTopDepth / 2 + legRadius * 2
}, {
    x: tableTopWidth / 2 - legRadius * 2,
    z: -tableTopDepth / 2 + legRadius * 2
}, {
    x: -tableTopWidth / 2 + legRadius * 2,
    z: tableTopDepth / 2 - legRadius * 2
}, {
    x: tableTopWidth / 2 - legRadius * 2,
    z: tableTopDepth / 2 - legRadius * 2
}];
legPositions.forEach(pos => {
    const leg = new THREE.Mesh(deskLegGeometry, grayDeskMaterial);
    leg.position.set(pos.x, -tableTopHeight / 2 - deskLegHeight / 2, pos.z);
    leg.castShadow = true;
    leg.receiveShadow = true;
    modernDeskGroup.add(leg);
});
modernDeskGroup.position.set(3, -roomHeight / 2 + deskLegHeight + wallThickness, -2.5);
scene.add(modernDeskGroup);

// ---- TẠO ĐÈN NGỦ HIỆN ĐẠI ----
const modernLampGroup = new THREE.Group();
const lampBaseRadius = 0.15;
const lampBaseHeight = 0.02;
const lampBaseMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
const lampBaseGeometry = new THREE.CylinderGeometry(lampBaseRadius, lampBaseRadius, lampBaseHeight, 32);
const lampBase = new THREE.Mesh(lampBaseGeometry, lampBaseMaterial);
lampBase.castShadow = true;
modernLampGroup.add(lampBase);
const standHeight = 0.5;
const standRadius = 0.015;
const standMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
const standGeometry = new THREE.CylinderGeometry(standRadius, standRadius, standHeight, 16);
const stand = new THREE.Mesh(standGeometry, standMaterial);
stand.position.y = lampBaseHeight / 2 + standHeight / 2;
stand.castShadow = true;
modernLampGroup.add(stand);
const shadeHeight = 0.2;
const shadeRadius = 0.2;
const shadeMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
const shadeGeometry = new THREE.CylinderGeometry(shadeRadius * 0.8, shadeRadius, shadeHeight, 32);
const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
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

// ---- TẠO LAPTOP TRÊN BÀN ----
const laptopGroup = new THREE.Group();
const laptopWidth = 1.2;
const laptopDepth = 0.8;
const laptopHeight = 0.05;
const screenHeight = laptopDepth * 0.9;
const screenThickness = 0.02;
const laptopMaterial = new THREE.MeshPhongMaterial({
    color: 0x222222,
    shininess: 30
});
const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x00FFFF,
    emissive: 0x00FFFF,
    emissiveIntensity: 1
});
const laptopBodyGeometry = new THREE.BoxGeometry(laptopWidth, laptopHeight, laptopDepth);
const laptopBody = new THREE.Mesh(laptopBodyGeometry, laptopMaterial);
laptopBody.castShadow = true;
laptopBody.receiveShadow = true;
laptopGroup.add(laptopBody);
const laptopScreenGeometry = new THREE.BoxGeometry(laptopWidth, screenHeight, screenThickness);
const laptopScreen = new THREE.Mesh(laptopScreenGeometry, screenMaterial);
laptopScreen.position.y = laptopHeight / 2 + screenHeight / 2 - screenThickness / 2;
laptopScreen.position.z = -laptopDepth / 2 - screenThickness / 2 + 0.01;
laptopScreen.rotation.x = -Math.PI / 12;
laptopScreen.castShadow = true;
laptopScreen.receiveShadow = true;
laptopGroup.add(laptopScreen);
laptopGroup.position.set(modernDeskGroup.position.x + 0.3, modernDeskGroup.position.y + tableTopHeight / 2 + laptopHeight / 2 + 0.01, modernDeskGroup.position.z + 0.3);
laptopGroup.rotation.y = Math.PI / 6;
scene.add(laptopGroup);

// TẠO GHẾ MỚI
const chairGroup = new THREE.Group();
const brownChairMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
const seatWidth = 0.6;
const seatHeight = 0.4;
const seatDepth = 0.6;
const seatGeometry = new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth);
const seat = new THREE.Mesh(seatGeometry, brownChairMaterial);
seat.castShadow = true;
seat.receiveShadow = true;
chairGroup.add(seat);
const backrestHeight = 0.9;
const backrestGeometry = new THREE.BoxGeometry(seatWidth, backrestHeight, 0.05);
const backrest = new THREE.Mesh(backrestGeometry, brownChairMaterial);
backrest.position.set(0, seatHeight / 2 + backrestHeight / 2, -seatDepth / 2 + 0.05 / 2);
backrest.castShadow = true;
backrest.receiveShadow = true;
chairGroup.add(backrest);
const legHeight = 0.5;
const legSize = 0.05;
const chairLegGeometry = new THREE.BoxGeometry(legSize, legHeight, legSize);
const frontLeftLeg = new THREE.Mesh(chairLegGeometry, brownChairMaterial);
frontLeftLeg.position.set(-seatWidth / 2 + legSize / 2, -seatHeight / 2 - legHeight / 2, seatDepth / 2 - legSize / 2);
frontLeftLeg.castShadow = true;
frontLeftLeg.receiveShadow = true;
chairGroup.add(frontLeftLeg);
const frontRightLeg = new THREE.Mesh(chairLegGeometry, brownChairMaterial);
frontRightLeg.position.set(seatWidth / 2 - legSize / 2, -seatHeight / 2 - legHeight / 2, seatDepth / 2 - legSize / 2);
frontRightLeg.castShadow = true;
frontRightLeg.receiveShadow = true;
chairGroup.add(frontRightLeg);
const backLeftLeg = new THREE.Mesh(chairLegGeometry, brownChairMaterial);
backLeftLeg.position.set(-seatWidth / 2 + legSize / 2, -seatHeight / 2 - legHeight / 2, -seatDepth / 2 + legSize / 2);
backLeftLeg.castShadow = true;
backLeftLeg.receiveShadow = true;
chairGroup.add(backLeftLeg);
const backRightLeg = new THREE.Mesh(chairLegGeometry, brownChairMaterial);
backRightLeg.position.set(seatWidth / 2 - legSize / 2, -seatHeight / 2 - legHeight / 2, -seatDepth / 2 + legSize / 2);
backRightLeg.castShadow = true;
backRightLeg.receiveShadow = true;
chairGroup.add(backRightLeg);
chairGroup.position.set(3, -roomHeight / 2 + legHeight + wallThickness, 0.3);
chairGroup.rotation.y = Math.PI;
scene.add(chairGroup);

// Tạo kệ
const shelfWidth = 3;
const shelfHeight = 0.1;
const shelfDepth = 0.3;
const shelfColor = 0x8B4513;
const shelfSpacing = 0.5;
const numShelves = 3;
for (let i = 0; i < numShelves; i++) {
    const shelfGeometry = new THREE.BoxGeometry(shelfWidth, shelfHeight, shelfDepth);
    const shelfMaterial = new THREE.MeshPhongMaterial({
        color: shelfColor
    });
    const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
    shelf.position.set(-roomWidth / 2 + wallThickness + 1.5, 0.08 + i * (shelfHeight + shelfSpacing), 0);
    shelf.rotation.y = Math.PI / 2;
    shelf.receiveShadow = true;
    scene.add(shelf);
}

// Tạo tủ quần áo
const wardrobeWidth = 2.5;
const wardrobeHeight = 3;
const wardrobeDepth_new = 1;
const wardrobeMaterial = new THREE.MeshStandardMaterial({
    color: 0x6B4E31,
    roughness: 0.7
});
const wardrobeGeometry = new THREE.BoxGeometry(wardrobeDepth_new, wardrobeHeight, wardrobeWidth);
const wardrobe = new THREE.Mesh(wardrobeGeometry, wardrobeMaterial);
wardrobe.position.set(roomWidth / 2 - wardrobeDepth_new / 2 - wallThickness, -roomHeight / 2 + wardrobeHeight / 2 + wallThickness, 3);
wardrobe.receiveShadow = true;
wardrobe.castShadow = true;
wardrobe.name = "wardrobe";
scene.add(wardrobe);
const doorWidth = wardrobeWidth / 2 - 0.05;
const doorHeight = wardrobeHeight - 0.2;
const doorDepth_new = 0.05;
const doorMaterial = wardrobeMaterial;
const leftDoorGeometry = new THREE.BoxGeometry(doorDepth_new, doorHeight, doorWidth);
const leftDoor = new THREE.Mesh(leftDoorGeometry, doorMaterial);
leftDoor.position.set(-wardrobeDepth_new / 2 - doorDepth_new / 2, 0, -doorWidth / 2 - 0.025);
leftDoor.receiveShadow = true;
leftDoor.castShadow = true;
wardrobe.add(leftDoor);
const rightDoorGeometry = new THREE.BoxGeometry(doorDepth_new, doorHeight, doorWidth);
const rightDoor = new THREE.Mesh(rightDoorGeometry, doorMaterial);
rightDoor.position.set(-wardrobeDepth_new / 2 - doorDepth_new / 2, 0, doorWidth / 2 + 0.025);
rightDoor.receiveShadow = true;
rightDoor.castShadow = true;
wardrobe.add(rightDoor);
const handleRadius = 0.03;
const handleHeight = 0.12;
const handleMaterial = new THREE.MeshPhongMaterial({
    color: 0xC0C0C0,
    metalness: 0.8
});
const handleGeometry = new THREE.CylinderGeometry(handleRadius, handleRadius, handleHeight, 16);
const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
leftHandle.position.set(-doorDepth_new / 2 - 0.01, 0, -doorWidth / 4);
leftHandle.rotation.z = Math.PI / 2;
leftHandle.receiveShadow = true;
leftHandle.castShadow = true;
leftDoor.add(leftHandle);
const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
rightHandle.position.set(-doorDepth_new / 2 - 0.01, 0, doorWidth / 4);
rightHandle.rotation.z = Math.PI / 2;
rightHandle.receiveShadow = true;
rightHandle.castShadow = true;
rightDoor.add(rightHandle);

//THÊM BỨC TRANH
const paintingWidth = 3.5;
const paintingHeight = 2.5;
const paintingPositionZ = 1.8;
const textureLoader = new THREE.TextureLoader();
const paintingTexture = textureLoader.load('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop');
const paintingGeometry = new THREE.PlaneGeometry(paintingWidth, paintingHeight);
const paintingMaterial = new THREE.MeshBasicMaterial({
    map: paintingTexture
});
const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
painting.position.set(-roomWidth / 2 + wallThickness + 0.01, roomHeight / 6, paintingPositionZ);
painting.rotation.y = Math.PI / 2;
scene.add(painting);
const frameThickness = 0.05;
const frameMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000
});
const topFrame = new THREE.Mesh(new THREE.BoxGeometry(paintingWidth + frameThickness * 2, frameThickness, frameThickness), frameMaterial);
topFrame.position.set(painting.position.x, painting.position.y + paintingHeight / 2 + frameThickness / 2, painting.position.z);
topFrame.rotation.y = Math.PI / 2;
scene.add(topFrame);
const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(paintingWidth + frameThickness * 2, frameThickness, frameThickness), frameMaterial);
bottomFrame.position.set(painting.position.x, painting.position.y - paintingHeight / 2 - frameThickness / 2, painting.position.z);
bottomFrame.rotation.y = Math.PI / 2;
scene.add(bottomFrame);
const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, paintingHeight, frameThickness), frameMaterial);
leftFrame.position.set(painting.position.x, painting.position.y, painting.position.z - paintingWidth / 2 - frameThickness / 2);
leftFrame.rotation.y = Math.PI / 2;
scene.add(leftFrame);
const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, paintingHeight, frameThickness), frameMaterial);
rightFrame.position.set(painting.position.x, painting.position.y, painting.position.z + paintingWidth / 2 + frameThickness / 2);
rightFrame.rotation.y = Math.PI / 2;
scene.add(rightFrame);

//TẠO CÂY XANH
const plantGroup = new THREE.Group();
plantGroup.name = "plant";
const potRadius = 0.3;
const potHeight = 0.4;
const potMaterial = new THREE.MeshPhongMaterial({
    color: 0xD2691E
});
const potGeometry = new THREE.CylinderGeometry(potRadius, potRadius * 0.8, potHeight, 16);
const pot = new THREE.Mesh(potGeometry, potMaterial);
pot.castShadow = true;
pot.receiveShadow = true;
plantGroup.add(pot);
const trunkRadius = 0.05;
const trunkHeight = 0.5;
const trunkMaterial = new THREE.MeshPhongMaterial({
    color: 0x8B4513
});
const trunkGeometry = new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, 8);
const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
trunk.position.y = potHeight / 2 + trunkHeight / 2;
trunk.castShadow = true;
trunk.receiveShadow = true;
plantGroup.add(trunk);
const foliageRadius = 0.6;
const foliageHeight = 1.2;
const foliageMaterial = new THREE.MeshPhongMaterial({
    color: 0x228B22
});
const foliageGeometry = new THREE.ConeGeometry(foliageRadius, foliageHeight, 16);
const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
foliage.position.y = trunk.position.y + trunkHeight / 2 + foliageHeight / 2;
foliage.castShadow = true;
foliage.receiveShadow = true;
plantGroup.add(foliage);
plantGroup.position.set(-roomWidth / 2 + potRadius + wallThickness + 0.2, -roomHeight / 2 + potHeight / 2 + wallThickness, 4.5);
scene.add(plantGroup);

// ==================================================================
// ===== TẠO LOA PHÁT NHẠC HIỆN ĐẠI =====
// ==================================================================
const speakerGroup = new THREE.Group();

// 1. Thân loa chính
const speakerHeight = 1.2;
const speakerBodyGeometry = new THREE.CylinderGeometry(0.4, 0.45, speakerHeight, 32);
const speakerBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222, // Màu xám đen
    roughness: 0.4,
    metalness: 0.1
});
const speakerBody = new THREE.Mesh(speakerBodyGeometry, speakerBodyMaterial);
speakerBody.castShadow = true;
speakerBody.receiveShadow = true;
speakerGroup.add(speakerBody);

// 2. Lưới loa
const grilleHeight = speakerHeight * 0.7;
const grilleGeometry = new THREE.CylinderGeometry(0.405, 0.455, grilleHeight, 32);
const grilleMaterial = new THREE.MeshStandardMaterial({
    color: 0x050505, // Màu đen tuyền cho lưới
    roughness: 0.8
});
const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
grille.position.y = - (speakerHeight - grilleHeight) / 2 + 0.05; // Đặt lưới ở nửa dưới thân loa
speakerGroup.add(grille);

// 3. Đèn LED nhấp nháy (gán vào biến đã khai báo)
const lightGeometry = new THREE.BoxGeometry(0.5, 0.03, 0.03);
const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0x00FFFF, // Màu xanh cyan
    emissive: 0xFFFF00, // Màu phát sáng
    emissiveIntensity: 0 // Ban đầu không sáng
});
pulsatingLight = new THREE.Mesh(lightGeometry, lightMaterial);
pulsatingLight.position.set(0, 0.2, 0.4); // Đặt ở mặt trước của loa
speakerGroup.add(pulsatingLight);

// Đặt vị trí loa ở giữa sàn nhà
speakerGroup.position.set(
    1, // Chính giữa theo trục X
    -roomHeight / 2 + wallThickness + speakerHeight / 2, // Đặt trên sàn
    2 // Chính giữa theo trục Z
);
scene.add(speakerGroup);


//TẠO HÌNH NGƯỜI VÀ HOẠT ẢNH
const personGroup = new THREE.Group();
const headGeometry = new THREE.SphereGeometry(0.2, 32, 16);
const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xF5CBA7,
    roughness: 0.8,
    metalness: 0.1
});
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.y = 0.7;
head.castShadow = true;
head.receiveShadow = true;
personGroup.add(head);
const torsoGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
const torsoMaterial = new THREE.MeshStandardMaterial({
    color: 0x3D91CC,
    roughness: 0.7,
    metalness: 0.0
});
const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
torso.position.y = 0;
torso.castShadow = true;
torso.receiveShadow = true;
personGroup.add(torso);
const armGeometry = new THREE.CylinderGeometry(0.1, 0.08, 0.7, 16);
const armMaterial = new THREE.MeshStandardMaterial({
    color: 0xF5CBA7,
    roughness: 0.8,
    metalness: 0.1
});
const leftArm = new THREE.Mesh(armGeometry, armMaterial);
leftArm.position.set(-0.4, 0.2, 0);
leftArm.castShadow = true;
leftArm.receiveShadow = true;
personGroup.add(leftArm);
const rightArm = new THREE.Mesh(armGeometry, armMaterial);
rightArm.position.set(0.4, 0.2, 0);
rightArm.castShadow = true;
rightArm.receiveShadow = true;
personGroup.add(rightArm);
const personLegGeometry = new THREE.CylinderGeometry(0.15, 0.12, 1.0, 16);
const legMaterial = new THREE.MeshStandardMaterial({
    color: 0x2F4F4F,
    roughness: 0.7,
    metalness: 0.0
});
const leftLeg = new THREE.Mesh(personLegGeometry, legMaterial);
leftLeg.position.set(-0.15, -0.9, 0);
leftLeg.castShadow = true;
leftLeg.receiveShadow = true;
personGroup.add(leftLeg);
const rightLeg = new THREE.Mesh(personLegGeometry, legMaterial);
rightLeg.position.set(0.15, -0.9, 0);
rightLeg.castShadow = true;
rightLeg.receiveShadow = true;
personGroup.add(rightLeg);
personGroup.position.set(0, -roomHeight / 2 + 1.0 / 2 + wallThickness, 3);
scene.add(personGroup);
const walkSpeed = 0.03;
let walkDirection = 1;
const personRadius = 0.4;
const wardrobeObject = scene.getObjectByName("wardrobe");
const wardrobeBBox = new THREE.Box3().setFromObject(wardrobeObject);
const plantObject = scene.getObjectByName("plant");
const plantBBox = new THREE.Box3().setFromObject(plantObject);

function updatePerson() {
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

// Camera
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

// Animate
function animate() {
    requestAnimationFrame(animate);

    updatePerson();

    // === CẬP NHẬT HIỆU ỨNG LOA ===
    if (pulsatingLight) { // Đảm bảo loa đã được tạo
        if (sound.isPlaying) {
            // Dùng hàm sin để tạo hiệu ứng nhấp nháy mượt mà
            const time = Date.now() * 0.008;
            const pulse = (Math.sin(time) + 1) / 2; // Giá trị từ 0 đến 1
            pulsatingLight.material.emissiveIntensity = pulse * 1.5 + 0.5; // Nhấp nháy từ 0.5 đến 2
        } else {
            // Nếu nhạc tắt, đèn cũng tắt
            pulsatingLight.material.emissiveIntensity = 0;
        }
    }

    renderer.render(scene, camera);
}

animate();
