// bùi hoàng giang- ID 20224307
import * as THREE from 'three';

    const loader = new THREE.TextureLoader();
    const wallTexture = loader.load('./Wall.png');
    const mirrorTexture = loader.load('./Mirror.jpg');
    const woodTexture = loader.load('./Door.jpg');
    const groundTexture = loader.load('./Ground.png');
    const carpetTexture = loader.load('./Carpet.png');
    const windowTexture = loader.load('./Window.png');

    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(4, 2); 

    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(4, 2);

    // Khởi tạo scene, camera và renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFAB785);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Tạo sàn nhà
    const floorGeometry = new THREE.BoxGeometry(10, 0.1, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.05;
    scene.add(floor);

    // Tạo tường
    const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5, 10), wallMaterial);
    leftWall.position.set(-5, 2.5, 0);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5, 10), wallMaterial);
    rightWall.position.set(5, 2.5, 0);  
    scene.add(rightWall);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 0.1), wallMaterial);
    backWall.position.set(0, 2.5, -5);
    scene.add(backWall);

    const windowFrameMaterial = new THREE.MeshStandardMaterial({ map: windowTexture });

    const windowFrameGeometry = new THREE.BoxGeometry(2.5, 2, 0.1); 
    const windowFrame = new THREE.Mesh(windowFrameGeometry, windowFrameMaterial);
    windowFrame.position.set(0, 3, -4.99); 
    scene.add(windowFrame);

    // Tạo tường trước với cửa
    const frontWallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });
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
    const doorMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
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

    const baseStandGeometry = new THREE.ConeGeometry(0.6, 0.7, 32, 1, false);
    const baseStand = new THREE.Mesh(baseStandGeometry, toiletMaterial);
    baseStand.position.set(4, 0.1, -3); // Đặt thấp hơn mặt sàn một chút
    scene.add(baseStand);

    const toiletBaseGeometry = new THREE.ConeGeometry(0.6, 0.9, 32, 1, false);
    const toiletBase = new THREE.Mesh(toiletBaseGeometry, toiletMaterial);
    toiletBase.position.set(4, 0.5, -3);
    toiletBase.rotation.x = Math.PI; // Xoay 180 độ để đỉnh nón hướng xuống
    scene.add(toiletBase);

    const toiletTankGeometry = new THREE.BoxGeometry(0.5, 1.2, 0.8);
    const toiletTank = new THREE.Mesh(toiletTankGeometry, toiletMaterial);
    toiletTank.position.set(4.5, 1.5, -3);
    scene.add(toiletTank);

    const sprayerMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0, metalness: 0.9, roughness: 0.1 });

    const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 32);
    const handle = new THREE.Mesh(handleGeometry, sprayerMaterial);
    handle.position.set(4.5, 1.5, -3.5); 
    scene.add(handle);

    const headGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 32); 
    const head = new THREE.Mesh(headGeometry, sprayerMaterial);
    head.position.set(4.5, 1.65, -3.5); 
    head.rotation.z = Math.PI;
    scene.add(head);

    // Tạo bồn tắm
    const bathtubGeometry = new THREE.BoxGeometry(2.0, 0.8, 4.5);
    const bathtubMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.1 });
    const bathtub = new THREE.Mesh(bathtubGeometry, bathtubMaterial);
    bathtub.position.set(3.5, 0.4, 2);
    scene.add(bathtub);

    // Thêm mặt phẳng nước để mô phỏng độ sâu
    const waterGeometry = new THREE.PlaneGeometry(1.8, 4.3);
    const waterMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEFA, transparent: true, opacity: 0.8 });
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
    const cabinetGeometry = new THREE.BoxGeometry(0.8, 1, 4.5);
    const cabinetMaterial = new THREE.MeshStandardMaterial({ color: 0xD2B48C });
    const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
    cabinet.position.set(-4.5, 0.5, -0.5); 
    scene.add(cabinet);

    // Create mirror above the cabinet
    const mirrorGeometry = new THREE.PlaneGeometry(4, 2.5);
    const mirrorMaterial = new THREE.MeshStandardMaterial({ map: mirrorTexture });
    const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    mirror.position.set(-4.9, 2.5, -0.5); 
    mirror.rotation.y = Math.PI/2;
    scene.add(mirror);

    // Create new light orange wood cabinet
    const backCabinetGeometry = new THREE.BoxGeometry(0.05, 3.5, 1.9);
    const backCabinetMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4555 });
    const backCabinet = new THREE.Mesh(backCabinetGeometry, backCabinetMaterial);
    backCabinet.position.set(-4.5, 1.75, -3.85);
    scene.add(backCabinet);

    const leftCabinetGeometry = new THREE.BoxGeometry(0.05, 3.5, 0.5);
    const leftCabinetMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const leftCabinet = new THREE.Mesh(leftCabinetGeometry, leftCabinetMaterial);
    leftCabinet.position.set(-4.25, 1.75, -2.9);
    leftCabinet.rotation.y = Math.PI/2;
    scene.add(leftCabinet);

    const rightCabinetGeometry = new THREE.BoxGeometry(0.05, 3.5, 0.5);
    const rightCabinetMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const rightCabinet = new THREE.Mesh(rightCabinetGeometry, rightCabinetMaterial);
    rightCabinet.position.set(-4.25, 1.75, -4.8);
    rightCabinet.rotation.y = Math.PI/2;
    scene.add(rightCabinet);

    const upCabinetGeometry = new THREE.BoxGeometry(0.5, 0.05, 2);
    const upCabinetMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const upCabinet = new THREE.Mesh(upCabinetGeometry, upCabinetMaterial);
    upCabinet.position.set(-4.25, 3.5, -3.85);
    scene.add(upCabinet);

    const downCabinetGeometry = new THREE.BoxGeometry(0.5, 0.05, 2);
    const downCabinetMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const downCabinet = new THREE.Mesh(downCabinetGeometry, downCabinetMaterial);
    downCabinet.position.set(-4.25, 0.1, -3.85);
    scene.add(downCabinet);

    // Create interior shelves (3 shelves)
    const shelfGeometry = new THREE.BoxGeometry(0.5, 0.05, 2);
    const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0xD2691E });
    const shelf1 = new THREE.Mesh(shelfGeometry, shelfMaterial);
    shelf1.position.set(-4.25, 2.7, -3.85); // Top shelf
    scene.add(shelf1);
    const shelf2 = new THREE.Mesh(shelfGeometry, shelfMaterial);
    shelf2.position.set(-4.25, 1.8, -3.85); // Middle shelf
    scene.add(shelf2);
    const shelf3 = new THREE.Mesh(shelfGeometry, shelfMaterial);
    shelf3.position.set(-4.25, 0.9, -3.85); // Bottom shelf
    scene.add(shelf3);

    // Create glass door
    const glassdoorGeometry = new THREE.BoxGeometry(0.05, 3.5, 1.9);
    const glassdoorMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.2, metalness: 0.1, roughness: 0.5 }); // Transparent glass
    const glassdoor = new THREE.Mesh(glassdoorGeometry, glassdoorMaterial);
    glassdoor.position.set(-4.1, 1.75, -3.85);
    scene.add(glassdoor);

    // Tạo thảm
    const rugGeometry = new THREE.PlaneGeometry(3, 1);
    const rugMaterial = new THREE.MeshStandardMaterial({ map: carpetTexture });
    const rug = new THREE.Mesh(rugGeometry, rugMaterial);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(-0.7, 0.02, 3.5);
    scene.add(rug);

    // Tạo vòi hoa sen
    const showerMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.2 }); 
    const silverMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0, metalness: 0.9, roughness: 0.1 }); 

    // Cột trụ đứng
    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 32);
    const pole = new THREE.Mesh(poleGeometry, showerMaterial);
    pole.position.set(-4.6, 1.75, 2.5);
    scene.add(pole);

    // Đầu phun trên (hình hộp vuông)
    const showerHeadGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.4); 
    const showerHead = new THREE.Mesh(showerHeadGeometry, silverMaterial);
    showerHead.position.set(-4.6, 2.9, 2.5); 
    showerHead.lookAt(3.5, 0.6, 2); // Hướng về bồn tắm
    scene.add(showerHead);

    // Vòi cầm tay (tay cầm và đầu phun)
    const handheldBaseGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 32);
    const handheldBase = new THREE.Mesh(handheldBaseGeometry, showerMaterial);
    handheldBase.position.set(-4.6, 1.5, 2.3);
    handheldBase.rotation.z = Math.PI / 8; 
    scene.add(handheldBase);

    const handheldHeadGeometry = new THREE.BoxGeometry(0.3, 0.08, 0.2); 
    const handheldHead = new THREE.Mesh(handheldHeadGeometry, silverMaterial);
    handheldHead.position.set(-4.6, 1.55, 2.5); 
    handheldHead.rotation.z = Math.PI / 8; 
    scene.add(handheldHead);

    // Ống nước mềm (mô phỏng bằng chuỗi hình trụ nhỏ)
    const hoseSegmentGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 16); 
    for (let i = 0; i < 15; i++) {
        const hoseSegment = new THREE.Mesh(hoseSegmentGeometry, silverMaterial);
        hoseSegment.position.set(-4.6, 1.5 - 0.1 * i, 2.4 + 0.05 * i);
        hoseSegment.rotation.z = Math.PI / 16 * (i % 2 ? 1 : -1); 
        scene.add(hoseSegment);
    }

    // Van điều khiển
    const valveGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32); 
    const valve1 = new THREE.Mesh(valveGeometry, silverMaterial);
    valve1.position.set(-4.6, 1.7, 2.6);
    scene.add(valve1);

    const valve2 = new THREE.Mesh(valveGeometry, silverMaterial);
    valve2.position.set(-4.6, 1.5, 2.6);
    scene.add(valve2);

    // Kệ đỡ vòi cầm tay
    const shelGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.2);
    const shelMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const shel = new THREE.Mesh(shelGeometry, shelMaterial);
    shel.position.set(-4.6, 1.6, 2.3);
    shel.rotation.x = -Math.PI / 2;
    scene.add(shel);

    let waterFlow = false;
    let waterDrops = [];

    function toggleWaterFlow() {
        waterFlow = !waterFlow;

        // Nếu tắt, loại bỏ tất cả các giọt nước khỏi scene
        if (!waterFlow) {
            waterDrops.forEach(drop => scene.remove(drop));
            waterDrops = [];
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'r' || event.key === 'R') {
            toggleWaterFlow();
        }
    });

    function createWaterDrop(x, y, z) {
        const dropGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const dropMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEFA, transparent: true, opacity: 0.7 });
        const drop = new THREE.Mesh(dropGeometry, dropMaterial);
        drop.position.set(x, y, z);
        scene.add(drop);
        waterDrops.push(drop);
    }

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

    renderer.shadowMap.enabled = true;
    floor.receiveShadow = true;
    toiletTank.castShadow = true;

    // Vòng lặp render
    function animate() {
        requestAnimationFrame(animate);
        updateCameraPosition();
        toggleWaterFlow(); 
        if (waterFlow) {
            // Thêm giọt nước mới tại vị trí đầu vòi hoa sen
            if (Math.random() < 0.5) {
                const x = -4.6;
                const y = 2.85;
                const z = 2.5;
                createWaterDrop(x, y, z);
            }

            // Di chuyển các giọt nước xuống dưới
            waterDrops.forEach((drop, index) => {
                drop.position.y -= 0.05;
                if (drop.position.y < 0) {
                    scene.remove(drop);
                    waterDrops.splice(index, 1);
                }
            });
        }
        renderer.render(scene, camera);
    }
    animate();