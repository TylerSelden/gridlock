import * as THREE from "three";
import * as Objects from "./objects.js";

const scene = new THREE.Scene();
const light = new THREE.AmbientLight(0xffffff, Math.PI);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.9);
directionalLight.position.set(5, 5, 3);
//scene.add(directionalLight);

scene.add(new Objects.Board(16, 16));
scene.add(new Objects.Piece(0, 0, 0x555555, "test"));





document.getElementById("loading").classList.add("hidden");

export { scene };
