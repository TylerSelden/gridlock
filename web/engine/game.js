import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import  { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';

import * as Objects from "./objects.js";
import * as Loader from "./loader.js";
import * as Scene from "./scene.js";
import * as Events from "./events.js";


export class Game {
  constructor(textures) {
    this.textures = textures;
    this.players = {};
    this.time = 0;
    this.initialized = false;
  }
  static async create() {
    // get async data beforehand
    let textures = await Loader.loadImgs((loaded, total) => {
      document.getElementById("loading").innerText = `Loading... (${loaded} / ${total})`;
    });

    return new Game(textures);
  }

  init(players) {
    let s = players.length;

    this.scene = this.createScene(s);
    this.board = new Objects.Board(s);
    this.scene.add(this.board.group);

    this.renderer = this.createRenderer();
    this.camera = this.createCamera(s);
    this.controls = this.createControls(s);

    this.size = s;

    Events.init(this.renderer.domElement);

    for (let p of players) {
      p = new Objects.Player(p.x, p.z, p.c, p.name, p.id, p.hp, p.ap, p.rp);
      this.players[p.id] = p;
      this.scene.add(p.obj);
    }


    this.setupPostProcessing();

    // arrow notation to preserve `this`
    this.renderer.setAnimationLoop(() => {
      this.render();
    });


    document.getElementById("loading").classList.add("hidden");
    this.initialized = true;
  }

  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(new ShaderPass(GammaCorrectionShader));

    this.outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera
    );

//    this.outlinePass.selectedObjects = Object.values(this.players).map(player => player.obj);

    this.composer.addPass(this.outlinePass);
    this.outlinePass.edgeStrength = 5.0;
    this.outlinePass.edgeGlow = 0.0;
    this.outlinePass.edgeThickness = 2.0;
    this.outlinePass.visibleEdgeColor.set('#ffffff');
    this.outlinePass.hiddenEdgeColor.set('#190a05');
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
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    return controls;
  }
  createRenderer() {
    let renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
 
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
    for (let i in this.players) {
      this.players[i].light.on();
    }
  }
  spotLightsOff() {
    for (let i in this.players) {
      this.players[i].light.off();
    }
  }

  render() {
    this.controls.update();
    this.composer.render();
//    this.renderer.render(this.scene, this.camera);
  }
}
