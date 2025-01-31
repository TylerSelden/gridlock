import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import * as Objects from "./objects.js";
import * as Loader from "./loader.js";
import * as Scene from "./scene.js";


export class Game {
  constructor(textures) {
    this.textures = textures;
    this.players = [];
  }
  static async create() {
    // get async data beforehand
    let textures = await Loader.loadImgs((loaded, total) => {
      document.getElementById("loading").innerText = `Loading... (${loaded} / ${total})`;
    });

    return new Game(textures);
  }

  init(s) {
    this.scene = this.scene(s);
    this.scene.add(new Objects.Board(s, s));

    this.renderer = this.createRenderer();
    this.camera = this.createCamera(s);
    this.controls = this.createControls(s);
    console.log(this.controls);


    this.players.push(new Objects.Player(5, 7, 0xd13d31, "Player", 3, 1, 8));
    this.scene.add(this.players[0].obj);

    // arrow notation to preserve `this`
    this.renderer.setAnimationLoop(() => {
      this.render()
    });


    document.getElementById("loading").classList.add("hidden");
  }

  scene(s) {
    let scene = new THREE.Scene();

    this.lights = this.lights(s);
    scene.add(this.lights.ambient);
    scene.add(this.lights.dir.target);
    scene.add(this.lights.dir);

    return scene;
  }

  createCamera(s) {
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(s / 2 + 2, 2, s / 2 + 2);

    return camera;
  }
  createControls(s) {
    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(s / 2, 0, s / 2);
    controls.update();

    return controls;
  }
  createRenderer() {
    let renderer = new THREE.WebGLRenderer({ antialias: true });
 
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;

    renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    renderer.setClearColor(0x87ceeb);
    document.body.appendChild(renderer.domElement);

    return renderer;
  }

  lights(s) {
    let ambient = new THREE.AmbientLight(0xffffff, 0.8);
    let dir = new THREE.DirectionalLight(0xffffff, 1.9);

    dir.position.set(s * 2, s, s * 2)
    dir.target = new THREE.Object3D();
    dir.target.position.set(s / 2, 0, s / 2);

    dir.castShadow = true;
    dir.shadow.mapSize.width = 10000;
    dir.shadow.mapSize.height = 10000;

    return { ambient, dir };
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
