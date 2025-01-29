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
  constructor(w, h, d, c, tex, shadow) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    let materials = new Array(6).fill(new THREE.MeshStandardMaterial({ color: c }));
    if (tex) materials[2] = new THREE.MeshStandardMaterial({ map: tex });

    let mesh = new THREE.Mesh( geometry, materials );
    if (shadow) mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
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
    for (let x = 0; x < w; x++) {
      for (let z = 0; z < d; z++) {
        group.add(new Block(x, z));
      }
    }
    return group;
  }
}

export class Piece {
  constructor(x, z, c, name, hp, ap, rp) {
    let tex = new PieceTexture(name, hp, ap, rp, c, (c > 0x7FFFFF ? 0x000000 : 0xFFFFFF))
    let box = new Box(0.85, 0.4, 0.85, c, tex, true);

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

  text(text, x, y, c, size = 30, baseline = "middle", font = "Arial", align = "center") {
    this.ctx.font = `${size}px ${font}`;
    this.ctx.fillStyle = c;
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
}

class PieceTexture {
  constructor(name, hp, ap, rp, bg, c) {
    // setup
    const s = 1024;
    const ic = (c > 0) ? 'w' : 'b';
    c = `#${c.toString(16).padStart(6, '0')}`;
    bg = `#${bg.toString(16).padStart(6, '0')}`;

    // start
    let gen = new TextureGenerator(s, s, bg);
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
