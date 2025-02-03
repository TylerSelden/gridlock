import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import * as Objects from "./objects.js";
import * as Loader from "./loader.js";
import * as Scene from "./scene.js";


export class Game {
  constructor(textures) {
    this.textures = textures;
    this.players = [];
    this.time = 0;
  }
  static async create() {
    // get async data beforehand
    let textures = await Loader.loadImgs((loaded, total) => {
      document.getElementById("loading").innerText = `Loading... (${loaded} / ${total})`;
    });

    return new Game(textures);
  }

  init(s) {
    this.scene = this.createScene(s);
    this.scene.add(new Objects.Board(s, s));

    this.renderer = this.createRenderer();
    this.camera = this.createCamera(s);
    this.controls = this.createControls(s);

    this.size = s;


    this.createPlayers(12);
    for (let player of this.players) this.scene.add(player.obj);

    // arrow notation to preserve `this`
    this.renderer.setAnimationLoop(() => {
      this.render()
    });


    document.getElementById("loading").classList.add("hidden");
  }

  createScene(s) {
    let scene = new THREE.Scene();

    this.lights = this.createLights(s);
    scene.add(this.lights.ambient);
    scene.add(this.lights.dir.target);
    scene.add(this.lights.dir);

    let geo = new THREE.SphereGeometry(1, 32, 16);
    let mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.test = new THREE.Mesh(geo, mat);
    scene.add(this.test);

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

  createPlayers(n) {
    for (let i = 0; i < n; i++) {
      let x = Math.floor(Math.random() * 16);
      let y = Math.floor(Math.random() * 16);
      let c = Math.floor(Math.random() * 0xffffff);
      let player = new Objects.Player(x, y, c, `Player ${i}`, 3, 1, 8);
      this.players.push(player);
    }
  }

  createLights(s) {
    let ambient = new THREE.AmbientLight(0xffffff, 0.8);
    let dir = new THREE.DirectionalLight(0xffffff, 2);

    dir.position.set(s * 2, s, s * 2)
    dir.target = new THREE.Object3D();
    dir.target.position.set(s / 2, 0, s / 2);

    dir.castShadow = true;
    dir.shadow.mapSize.width = 10000;
    dir.shadow.mapSize.height = 10000;

    return { ambient, dir };
  }

  lightCycle() {
    let a = this.time * Math.PI / 180;
    let s = this.size;
    let h = s / 2;

    let x = s * Math.cos(a) + h;
    let y = s * Math.sin(a);
    let z = h * Math.cos(a) + h;
    let i = Math.max(y / h, 0);

    this.lights.dir.position.set(x, y, z);
    this.lights.dir.intensity = i;
    this.lights.ambient.intensity = Math.max(i / 4, 0.025);
    this.test.position.set(x, y, z);

    this.spotLightsOn();
    if (i > 0.7) this.spotLightsOff()
    this.renderer.setClearColor(0);

//    this.time = (this.time + 1) % 360;
  }

  spotLightsOn() {
    for (let player of this.players) {
      player.light.on();
    }
  }
  spotLightsOff() {
    for (let player of this.players) {
      player.light.off();
    }
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
