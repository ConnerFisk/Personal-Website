import * as THREE from 'three';
import "./style.css"
import gsap from "gsap"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

//Scene
const scene = new THREE.Scene()

//Create our planet
const geometry = new THREE.IcosahedronGeometry(3, 1)
// const material = new THREE.MeshStandardMaterial({
//   color: "#ff634e",
// })
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: '#000000',
})
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh)

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//Light
const light = new THREE.PointLight(0xffffff, 5, 100)
//const light = new THREE.AmbientLight(0xffffff)
 light.position.set(10, 10, 10)
scene.add(light)

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(sizes.width, sizes.height)

//Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRoateSpeed = 1

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
  window.requestAnimationFrame(loop)
}
loop()


//Create an animation oop
function animate() {
  requestAnimationFrame (animate);
  renderer.render(scene, camera)
}
animate()

function addStar() {
  const geometry = new THREE.SphereGeometry(0.1, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0x000000})
  const star = new THREE.Mesh(geometry, material)
  
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

const background = new THREE.TextureLoader().load("/backgroundgradient.png")
scene.background = background

//Timeline
const t1 = gsap.timeline({ defaults: {duration: 1 }})
const t2 = gsap.timeline({ defaults: {duration: .5 }})
//Make the planet zoom into view at start.
t1.fromTo(mesh.scale, {z:0, x:0, y:0}, {z: 1, x: 1, y: 1})
//Make the nav fall in to place at start.
t2.fromTo('nav', {y: "-100%"}, {y: "0%"})
//Make the title fade in at start.
t1.fromTo(".title", {opacity: 0}, {opacity: 1})

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e){
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    })
  })
})




