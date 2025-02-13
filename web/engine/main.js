import * as Game from "./game.js";
import * as Socket from "./socket.js";

export async function init() {
  window.Game = await Game.Game.create();
  await Socket.connect();
}

