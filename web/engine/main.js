import * as Game from "./game.js";

let size = 16;
let orbit = 0;

function cycle() {
  let a = orbit * Math.PI / 180;

  let x = size * Math.cos(a) + 8;
  let y = size * Math.sin(a);
  let z = (size / 2) * Math.cos(a) + 8;
  let i = Math.max(y / (size / 2), 0);

  window.Game.lights.dir.position.set(x, y, z);
  window.Game.test.position.set(x, y, z);
  window.Game.lights.dir.intensity = i;

  window.Game.players[0].light.on();
  if (i > 1) window.Game.players[0].light.off();

  orbit = (orbit + 1) % 360;
}

export async function init() {
  window.Game = await Game.Game.create();
  window.Game.init(size);

  setInterval(() => { window.Game.lightCycle() }, 25);
}
