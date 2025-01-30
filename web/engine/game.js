import * as THREE from "three";
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
    this.players.push(new Objects.Player(5, 7, 0xd13d31, "Player", 3, 1, 8));
    this.scene.add(this.players[0].obj);


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
}
