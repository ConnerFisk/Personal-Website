import * as THREE from 'three';
import "./style.css"
import gsap from "gsap"
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
const light = new THREE.PointLight(0xffffff, 2, 100)
light.position.set(10, 10, 10)
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

//Timeline
const t1 = gsap.timeline({ defaults: {duration: 1 }})
const t2 = gsap.timeline({ defaults: {duration: .5 }})
//Make the planet zoom into view at start.
t1.fromTo(mesh.scale, {z:0, x:0, y:0}, {z: 1, x: 1, y: 1})
//Make the nav fall in to place at start.
t2.fromTo('nav', {y: "-100%"}, {y: "0%"})
//Make the title fade in at start.
t1.fromTo(".title", {opacity: 0}, {opacity: 1})

//Mouse Animation Color
//Create a boolean to keep track of if the mouse is down or not
let mouseDown = false
//Have a rgb array for changed the color
let rgb = []
window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))

window.addEventListener('mousemove', (e) => {
  //If the mouse is down, then create a new RGB value with relation to
  //its X and Y corrdinate on the page.
  if(mouseDown){
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]
    //Update the color so that the planet changed when spun.
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    })
  }
})


