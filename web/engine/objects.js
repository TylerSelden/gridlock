import * as THREE from "three";
import * as THREEx from "./lib/threex.js"

export class Group {
  constructor(items, x = 0, y = 0, z = 0) {
    let group = new THREE.Group();
    for (let item of items) group.add(item);

    group.position.set(x, y, z);

    return group;
  }
}

export class Box {
  constructor(w, h, d, c, shadow, name) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    let materials = new Array(6).fill(new THREE.MeshStandardMaterial({ color: c }));

    let mesh = new THREE.Mesh( geometry, materials );
    if (shadow) mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.name = name;

    return mesh;
  }
}

export class Block {
  constructor(x, z) {
    let base = new Box(1, 0.05, 1, 0x666666);
    let platform = new Box(0.925, 0.05, 0.925, 0xffffff, false, "block");
    platform.position.y += 0.05;

    return new Group([ base, platform ], x, null, z);
  }
}

export class Board {
  constructor(w, d) {
    let group = new THREE.Group();
    for (let x = 0; x < w; x++) {
      for (let z = 0; z < d; z++) {
        group.add(new Block(x, z));
      }
    }
    return group;
  }
}


export class Player {
  constructor(x, z, c, name, hp, ap, rp) {
    this.c = c;
    this.name = name;

    let box = new Box(0.85, 0.4, 0.85, c, true, "player");
    this.light = new SpotLight(0, 0);
    this.obj = new Group([ box, this.light.obj, this.light.obj.target, this.light.cone ], x, 0.275, z);
    this.gen = new TextureGenerator(1024, 1024, c);

    this.update(x, z, hp, ap, rp);
  }

  update(x, z, hp, ap, rp) {
    if (typeof(x) === "number") this.x = x;
    if (typeof(z) === "number") this.z = z;
    if (typeof(hp) === "number") this.hp = hp;
    if (typeof(ap) === "number") this.ap = ap;
    if (typeof(rp) === "number") this.rp = rp;

    this.obj.position.x = this.x;
    this.obj.position.z = this.z;
    THREEx.updatePos(this.x, 4, this.z, this.light.cone.material)
    let tex = new PieceTexture(this.gen, this.name, this.hp, this.ap, this.rp, this.c);

    // change texture
    this.obj.traverse(child => {
      if (child.isMesh) {
        child.material[2] = new THREE.MeshStandardMaterial({ map: tex });
      }
    });
  }
}

class TextureGenerator {
  constructor(w, h, bg) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext("2d");
    this.clearColor = this.hexStr(bg);
    this.clear();
  }

  clear() {
    this.ctx.fillStyle = this.clearColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  text(text, x, y, c, size = 30, baseline = "middle", font = "Arial", align = "center") {
    this.ctx.font = `${size}px ${font}`;
    this.ctx.fillStyle = this.hexStr(c);
    this.ctx.textAlign = align;
    this.ctx.textBaseline = baseline;
    this.ctx.fillText(text, x, y);
  }

  img(img, x, y, w, h) {
    this.ctx.drawImage(img, x - w/2, y - h/2, w, h);
  }

  getTexture() {
    let tex = new THREE.CanvasTexture(this.canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  hexStr(val) {
    return `#${val.toString(16).padStart(6, '0')}`;
  }
}

class PieceTexture {
  constructor(gen, name, hp, ap, rp, bg) {
    // setup
    const s = 1024;
    const c = bg > 0x7FFFFF ? 0x000000 : 0xFFFFFF;
    const ic = (c > 0) ? 'w' : 'b';

    // start
    gen.clear();
    gen.text(name, s/2, s/6, c, s/6.4);

    // stats
    let x = s / 6;
    const dx = s / 3;

    const y = s * (4 / 5);
    const is = s / 10;


    gen.img(window.Game.textures[`hp${ic}.png`], x - is / 2, y, is, is);
    gen.text(hp, x + is / 2, y, c, is, "left");
    x += dx;
    gen.img(window.Game.textures[`ap${ic}.png`], x - is / 2, y, is, is);
    gen.text(ap, x + is / 2, y, c, is, "left");

    x += dx;
    gen.img(window.Game.textures[`rp${ic}.png`], x - is / 2, y, is, is);
    gen.text(rp, x + is / 2, y, c, is, "left");

    return gen.getTexture();
  }
}

class SpotLight {
  constructor(x, z) {
    let light = new THREE.SpotLight(0xffffff);
    this.obj = light;

    light.target = new THREE.Object3D();
    light.position.set(x, 4, z);
    light.target.position.set(x, 0, z);

    light.angle = Math.PI / 10;
    light.penumbra = 0.5;
    light.intensity = 0;
    light.distance = 5;
    light.decay = 0.5;

    let mat = new THREEx.VolumetricSpotLightMaterial();
    const geo = new THREE.CylinderGeometry(0, 1.5, 8.4, 64, 20, true);
    this.cone = new THREE.Mesh(geo, mat);
    this.cone.position.set(x, 4, z);
    this.cone.visible = false;
  }
  on() {
    this.obj.intensity = Math.PI * 2;
    this.cone.visible = true;
  }
  off() {
    this.obj.intensity = 0;
    this.cone.visible = false;
  }
  toggle() {
    if (this.cone.visible) return this.off();
    this.on();
  }
}
