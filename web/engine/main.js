import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as Game from "./game.js";

let scene, camera, renderer;
let loader, light, controls;

function bind(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function clampCamera(min, max) {
  ['x', 'y', 'z'].forEach(axis => {
    camera.position[axis] = bind(camera.position[axis], min, max);
    controls.target[axis] = bind(controls.target[axis], min, max);
  });

  controls.target.y = 0;
  if (camera.position.y < 1) camera.position.y = 1;
}

function animate() {
  clampCamera(-10, 26);
  
  controls.update();
  renderer.render(scene, camera);
}

export async function init() {
  window.Game = await Game.Game.create();
  window.Game.init(16);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
  scene = window.Game.scene;
  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
