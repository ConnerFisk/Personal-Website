import * as THREE from 'three';
import "./style.css"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

//Scene
const scene = new THREE.Scene()

//Create our planet
const geometry = new THREE.DodecahedronGeometry(3, 1)
const material = new THREE.MeshStandardMaterial({
  color: "#ff634e",
})
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh)

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//Light
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 10, 10)
scene.add(light)

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGL1Renderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRoateSpeed = 5

//Resize
window.addEventListener('resize', () => {
  //Update the sizes when there is a window resize
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //Update the camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

//Create a loop that will update the renderer and "redo" the sizes
//when needed.
const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()
