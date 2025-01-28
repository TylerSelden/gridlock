import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as Scene from "./scene.js";

let scene, camera, renderer;
let loader, light, controls;

function updateControls() {
  let co = controls.target;
  let ca = camera.position;

  if (co.x < -10) co.x = -10;
  if (ca.x < -10) ca.x = -10;

  co.y = 0;
  if (ca.y < 1) ca.y = 1;
  if (ca.y > 25) ca.y = 25;

  if (co.z < -10) co.z = -10;
  if (ca.z < -10) ca.z = -10;
}

function animate() {
  updateControls();
  
  controls.update();
  renderer.render(scene, camera);
}

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);

  scene = Scene.scene;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows (optional)
  renderer.physicallyCorrectLights = true;
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x87ceeb);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  camera.position.set(7, 2, 9);
  controls.target.set(5, 0, 7);
  controls.update();



  renderer.setAnimationLoop(animate);

}

export { init };
