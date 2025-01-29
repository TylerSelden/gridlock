import * as THREE from "three";
import * as Objects from "./objects.js";
import * as Loader from "./loader.js";


export async function init() {
  const scene = new THREE.Scene();
  window.scene = scene;

  const light = new THREE.AmbientLight(0xffffff, 0.8);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.9);

  dirLight.position.set(32, 16, 32);

  dirLight.target = new THREE.Object3D();
  dirLight.target.position.set(8, 0, 8);

  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;

  scene.add(dirLight);
  scene.add(dirLight.target);
  scene.add(light);

  scene.userData.textures = await Loader.loadImgs((loaded, total) => {
    document.getElementById("loading").innerText = `Loading... (${loaded} / ${total})`;
  });


  scene.add(new Objects.Board(16, 16));
  scene.add(new Objects.Piece(5, 7, 0xd13d32, "Player", 3, 1, 8));

  document.getElementById("loading").classList.add("hidden");

  return scene;
}
