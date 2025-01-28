import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as Scene from "./scene.js";

let scene, camera, renderer;
let loader, light, controls;

function animate() {
  renderer.render(scene, camera);
}

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 1000);
  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);

  scene = Scene.scene;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x87ceeb);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  renderer.setAnimationLoop(animate);
}

export { init };
