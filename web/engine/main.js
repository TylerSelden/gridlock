import * as Game from "./game.js";

let size = 16;

export async function init() {
  window.Game = await Game.Game.create();
  window.Game.init(size);

  setInterval(() => { window.Game.lightCycle() }, 25);
}
