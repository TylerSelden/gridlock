import * as THREE from "three";
import * as Objects from "./objects.js";

const scene = new THREE.Scene();
const light = new THREE.AmbientLight(0xffffff, 2);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.9);
directionalLight.position.set(5, 5, 3);
directionalLight.castShadow = true;
scene.add(directionalLight);




scene.add(new Objects.Board(16, 16));
scene.add(new Objects.Piece(5, 7, 0xd13d32, "Player", 3, 1, 8));





document.getElementById("loading").classList.add("hidden");

export { scene };
