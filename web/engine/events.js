import * as THREE from "three";

export function init(elem) {
  window.addEventListener("resize", resize);
  elem.addEventListener("mousedown", start);
  elem.addEventListener("mousemove", move);
  elem.addEventListener("mouseup", end);
}

function resize() {
  window.Game.camera.aspect = window.innerWidth / window.innerHeight;
  window.Game.camera.updateProjectionMatrix();
  window.Game.renderer.setSize(window.innerWidth, window.innerHeight);
}


let clickCoord;
let isClick = false;
function start(evt) {
  if (evt.touches && evt.touches.length > 1) return;

  let x = evt.clientX || evt.touches[0].clientX;
  let y = evt.clientY || evt.touches[0].clientY;

  isClick = true;
  clickCoord = { x, y };
}
function move(evt) {
  isClick = false;
}
function end(evt) {
  if (isClick) getMesh(clickCoord.x, clickCoord.y);
}

const ray = new THREE.Raycaster();
const rayCoord = new THREE.Vector2();
function getMesh(x, y) {
  rayCoord.x = (x / window.innerWidth) * 2 - 1;
  rayCoord.y = -(y / window.innerHeight) * 2 + 1;
  ray.setFromCamera(rayCoord, window.Game.camera);

  const intersects = ray.intersectObjects(window.Game.scene.children, true);
  for (let i in intersects) {
    let obj = intersects[i].object;

    if (obj.name === "player") {
      let id = obj.userData.id;
      let p = window.Game.players[id];
      let selectedObjects = window.Game.outlinePass.selectedObjects;

      if (!selected[id]) {
        selected[id] = {
          r: p.rp,
          x1: p.x - p.rp,
          z1: p.z - p.rp,
          x2: p.x + p.rp,
          z2: p.z + p.rp
        }
        selectedObjects.push(p.obj);
      } else {
        delete selected[id];
        selectedObjects.splice(selectedObjects.find(obj => obj.id === id), 1);
      }

      handleSelected();
      break;
    } else if (obj.name === "board") {
      obj.setColorAt(intersects[i].instanceId, new THREE.Color(Math.random() * 0xffffff));
      obj.instanceColor.needsUpdate = true;
      break;
    }
  }
}

let selected = [];

function handleSelected() {
  const s = window.Game.board.size;
  let color = new THREE.Color();

  for (let i = 0; i < s*s; i++) {
    let x = i % s;
    let z = Math.floor(i / s);
    for (let j in selected) {
      let b = selected[j];
      if (x >= b.x1 && x <= b.x2 && z >= b.z1 && z <= b.z2) {
        color.setHex(0xff0000);
        break;
      } else {
        color.setHex(0xffffff);
      }
    }
    window.Game.board.blocks.setColorAt(i, color);
  }

  window.Game.board.blocks.instanceColor.needsUpdate = true;
}
