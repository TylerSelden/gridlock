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
      obj.parent.visible = !obj.parent.visible;
      break;
    } else if (obj.name === "block") {
      obj.visible = !obj.visible;
      break;
    }
  }
}
