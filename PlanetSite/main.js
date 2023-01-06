/**
 * This is the main.js file which contains the JavaScript code for
 * my personal website.
 *
 * @link   https://connerfisk.com/
 * @author Conner Fisk
 * @since  Dec 23, 2022
 */

import * as THREE from 'three';
import "./style.css"
import gsap from "gsap"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

//Create our scene.
const scene = new THREE.Scene()

//Create our planet.
const geometry = new THREE.IcosahedronGeometry(3, 1)
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: '#fff',
})
const planet = new THREE.Mesh(geometry, material);
//Add the planet to the scene.
scene.add(planet)

//Collect and store the sizes of the user's window.
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//Create the light for our scene and set its position.
const light = new THREE.PointLight(0xfff, 5, 100)
light.position.set(10, 10, 10)
//Add the light to the scene.
scene.add(light)

//Create a camera and set its position.
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
//Add the camera to the scene.
scene.add(camera)

//Create our renderer and set the needed values for
//our user's specifications.
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(sizes.width, sizes.height)

//Create an OrbitControls object and set the necessary values
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 0.75

/**
 * Resize all that is needed when the user resizes
 * their window.
 */
window.addEventListener('resize', () => {
  //Update the sizes when there is a window resize.
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //Update the camera and renderer to the new sizes.
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

/**
 * Create a loop that will update the renderer and "redo" the sizes
 * when needed.
 */
const loop = () => {
  controls.update()
  window.requestAnimationFrame(loop)
}
loop()


/**
 * Create an animation loop for rendering the scene.
 */
function animate() {
  requestAnimationFrame (animate);
  renderer.render(scene, camera)
}
animate()

/**
 * This function creates a star for the scene.
 */
function addStar() {
  //Create the star mesh.
  const geometry = new THREE.SphereGeometry(0.1, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0x000})
  const star = new THREE.Mesh(geometry, material)
  
  //Get a random x, y, and z coordinate.
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  //Set the star's position to those random values gathered above.
  star.position.set(x, y, z);

  //Add the star to the scene.
  scene.add(star)
}

//Generate 200 stars at random positions for the scene.
Array(200).fill().forEach(addStar)

//Load and set the scene's background
const background = new THREE.TextureLoader().load("/backgroundgradient.png")
scene.background = background

//Timeline
const t1 = gsap.timeline({ defaults: {duration: 1 }})
const t2 = gsap.timeline({ defaults: {duration: .5 }})
//Make the planet zoom into view at start.
t1.fromTo(planet.scale, {z:0, x:0, y:0}, {z: 1, x: 1, y: 1})
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



