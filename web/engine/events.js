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
      let p = window.Game.players[obj.userData.id];
      let r = p.rp;

      let spaces = [];
      for (let x = p.x - r; x <= p.x + r; x++) {
        if (x < 0 || x > window.Game.board.size - 1) continue;
        for (let z = p.z - r; z <= p.z + r; z++) {
          if (z < 0 || z > window.Game.board.size - 1) continue;
          let inst = z * window.Game.size + x;

          window.Game.board.blocks.setColorAt(inst, new THREE.Color(0xff3333));
          window.Game.board.blocks.instanceColor.needsUpdate = true;
        }
      }
      break;
    } else if (obj.name === "board") {
      obj.setColorAt(intersects[i].instanceId, new THREE.Color(Math.random() * 0xffffff));
      obj.instanceColor.needsUpdate = true;
      break;
    }
  }
}
