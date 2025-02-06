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
    renderer.shadowMap.autoUpdate = false;

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
    dir.shadow.mapSize.width = s * 500;
    dir.shadow.mapSize.height = s * 500;

    dir.shadow.camera.left = -s;
    dir.shadow.camera.right = s;
    dir.shadow.camera.top = s;
    dir.shadow.camera.bottom = -s;

    return { ambient, dir };
  }

  lightColors() {
    const phases = [
      { color: new THREE.Color(0x000020), len: 30  },
      { color: new THREE.Color(0xeeeeee), len: 140 },
      { color: new THREE.Color(0xeeeeee), len: 10  },
      { color: new THREE.Color(0x000020), len: 180 },
    ];

    let t = this.time;
    let c;
    let start = 0;

    for (let i = 0; i < phases.length; i++) {
      let { color, len } = phases[i];

      if (t >= start && t < start + len) {
        let n = (i + 1) % phases.length;
        let nt = (t - start) / len;

        c = color.lerp(phases[n].color, nt);
        break;
      }
      start += len;
    }

    this.lights.ambient.color.set(c);
    this.lights.dir.color.set(c);

    const black = new THREE.Color(0);
    const blue = new THREE.Color(0x87ceeb);
    const i = Math.max(0.001, 1 - Math.abs((t - 90) / 90));
    this.renderer.setClearColor(black.lerp(blue, i));

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
    this.lights.dir.intensity = Math.max(i, 0.5);
    this.lights.ambient.intensity = Math.max(i / 4, 0.4);
    this.lightColors();

    this.spotLightsOn();
    if (i > 0.7) this.spotLightsOff()

    this.time = (this.time + 0.25) % 360;
    this.renderer.shadowMap.needsUpdate = true;
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
