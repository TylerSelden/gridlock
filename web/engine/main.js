import * as Game from "./game.js";

export async function init() {
  window.Game = await Game.Game.create();
  window.Game.init(16);
}
