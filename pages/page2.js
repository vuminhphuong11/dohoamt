// src/pages/page1.js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
 
export function init(container) {
  // Clear container and create canvas
  container.innerHTML = ''
  const canvas = document.createElement('canvas')
  container.appendChild(canvas)
 
  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.shadowMap.enabled = true
 
  // Scene & Camera
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xe0e0e0)
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.set(5, 6, 8)
 
  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 1, 0)
  controls.update()
 
  // Texture loader
  const texLoader = new THREE.TextureLoader()
 
  // 1. Wooden floor
  const woodTex = texLoader.load('models/textures/wood.jpg')
  woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping
  woodTex.repeat.set(4, 4)
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ map: woodTex })
  )
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)
 
  // 2. Walls
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5 })
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 0.2), wallMat)
  backWall.position.set(0, 2, -5)
  backWall.receiveShadow = true
  scene.add(backWall)
  const leftWall = backWall.clone()
  leftWall.rotation.y = Math.PI / 2
  leftWall.position.set(-5, 2, 0)
  scene.add(leftWall)
 
  // 3. Planter box
  const planter = new THREE.Mesh(
    new THREE.BoxGeometry(10, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
  )
  planter.position.set(0, 0.5, -4)
  planter.receiveShadow = true
  scene.add(planter)
 
  // 4. Billboard foliage
  const leafTex = texLoader.load('/textures/leaf.png')
  const leafMat = new THREE.MeshBasicMaterial({ map: leafTex, transparent: true, side: THREE.DoubleSide })
  for (let i = -4; i <= 4; i += 2) {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), leafMat)
    plane.position.set(i, 1.25, -4)
    plane.lookAt(camera.position)
    scene.add(plane)
  }
 
  // 5. Bench
  const bench = new THREE.Mesh(
    new THREE.BoxGeometry(8, 0.4, 1),
    new THREE.MeshStandardMaterial({ color: 0x555555 })
  )
  bench.position.set(0, 0.2, -3)
  bench.castShadow = bench.receiveShadow = true
  scene.add(bench)
 
  // 6. Table and chairs
  const table = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5, 1),
    new THREE.MeshStandardMaterial({ color: 0x777777 })
  )
  table.position.set(0, 0.25, 1)
  table.castShadow = true
  scene.add(table)
 
  const chairGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 32)
  const chairMat = new THREE.MeshStandardMaterial({ color: 0x3e2c1b })
  const positions = [[-1.5, 0.4, 1], [1.5, 0.4, 1]]
  positions.forEach(pos => {
    const ch = new THREE.Mesh(chairGeo, chairMat)
    ch.position.set(...pos)
    ch.castShadow = true
    scene.add(ch)
  })
 
  // 7. Lighting
  const amb = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6)
  scene.add(amb)
  const dir = new THREE.DirectionalLight(0xffffff, 0.8)
  dir.position.set(5, 10, 5)
  dir.castShadow = true
  dir.shadow.camera.top = 5
  dir.shadow.camera.bottom = -5
  dir.shadow.camera.left = -5
  dir.shadow.camera.right = 5
  scene.add(dir)
 
  // 8. Load GLB model (flower)
  const gltfLoader = new GLTFLoader()
  gltfLoader.load(
    '/models/flowers.glb',
    (gltf) => {
      const model = gltf.scene
      model.traverse(n => n.isMesh && (n.castShadow = n.receiveShadow = true))
      model.position.set(2, 0, -1)
      model.scale.set(0.5, 0.5, 0.5)
      scene.add(model)
    },
    (progress) => {
      console.log(`Flower model: ${(progress.loaded / progress.total * 100).toFixed(1)}% loaded`)
    },
    (err) => console.error('Error loading flowers.glb:', err)
  )
 
  // 9. Handle resize
  function resize() {
    const w = container.clientWidth
    const h = container.clientHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', resize)
  resize()
 
  // 10. Animate
  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
}
 
 