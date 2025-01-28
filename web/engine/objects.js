import * as THREE from "three";

export class Group {
  constructor(items, x = 0, y = 0, z = 0) {
    let group = new THREE.Group();
    for (let item of items) group.add(item);

    group.position.set(x, y, z);

    return group;
  }
}

export class Box {
  constructor(w, h, d, c, tex) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    let materials = new Array(6).fill(new THREE.MeshStandardMaterial({ color: c }));
    if (tex) materials[2] = new THREE.MeshStandardMaterial({ map: tex });

    if (tex) console.log(materials[0], materials[2]);

    return new THREE.Mesh( geometry, materials );
  }
}

export class Block {
  constructor(x, z) {
    let base = new Box(1, 0.05, 1, 0x666666);
    let platform = new Box(0.925, 0.05, 0.925, 0xffffff);
    platform.position.y += 0.05;

    return new Group([ base, platform ], x, null, z);
  }
}

export class Board {
  constructor(w, d) {
    let group = new THREE.Group();
    for (let x = -w / 2; x < w / 2; x++) {
      for (let z = -d / 2; z < d / 2; z++) {
        group.add(new Block(x, z));
      }
    }
    return group;
  }
}

export class Piece {
  constructor(x, z, c, name, hp, ap, rp) {
    let tex = new PieceTexture(name, hp, ap, rp, c, (c > 0x7FFFFF ? 0x000000 : 0xFFFFFF))
    let box = new Box(0.8, 0.4, 0.8, c, tex);

    let group = new Group([ box ], x, 0.275, z);
    return group;
  }
}

class TextureGenerator {
  constructor(w, h, bg) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext("2d");
    this.clearColor = bg;
    this.clear();
  }

  clear() {
    this.ctx.fillStyle = this.clearColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  text(text, x, y, c, size = 30, font = "Arial") {
    this.ctx.font = `${size}px ${font}`;
    this.ctx.fillStyle = c;
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, x, y);
  }

  img(src, x, y, w, h) {
    let img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, x, y, w, h);
    };
    img.src = src;
  }

  getTexture() {
    return new THREE.CanvasTexture(this.canvas);
  }
}

class PieceTexture {
  constructor(name, hp, ap, rp, bg, c) {
    let gen = new TextureGenerator(512, 512, `#${bg.toString(16).padStart(6, '0')}`);
    gen.text(name, 256, 128, `#${c.toString(16).padStart(6, '0')}`, 80);
    gen.img("./assets/hp.png", 0, 0, 256, 256);

    return gen.getTexture();
  }
}
