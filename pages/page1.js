import * as THREE from 'three';



export function init(container) {
    container.innerHTML = ''; // Xóa nội dung cũ
    // Tạo Scene
    const scene = new THREE.Scene();
    // Tạo Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(7, 7, 7);
    camera.lookAt(0, 4, 0);
    // Tạo Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    // Điều khiển camera bằng chuột
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.5, 0);
    controls.update();
    // Ánh sáng
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 5, 3);
    scene.add(directionalLight);
    // ================Sàn nhà===============
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x909090 });
    const floorGeometry = new THREE.PlaneGeometry(13, 13);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    // =================Tường===============
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xCCCCCC});
    const wallGeometry = new THREE.PlaneGeometry(13, 6.5);
    const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
    frontWall.position.set(0, 3.25, -6.5);
    scene.add(frontWall);
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-6.5, 3.25, 0);
    scene.add(leftWall);

    // ================= Tạo tivi ====================
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
    tvGroup.position.set(1.5, 2.25, -6);
    scene.add(tvGroup);

    // Tạo âm thanh
    const listener = new THREE.AudioListener();//
    camera.add(listener);//
    const audioLoader = new THREE.AudioLoader();//
    const sound = new THREE.Audio(listener);//

    audioLoader.load('/src/laugos_overlook_montage_-_loop.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setVolume(1);
        sound.play();
    });

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // cập nhật điều khiển camera
        renderer.render(scene, camera);
    }
    animate();
}
