import * as Game from "./game.js";
let socket;

export async function init() {
  socket = new WebSocket("wss://server.benti.dev:8080");
  window.socket = socket;
  socket.onmessage = (msg) => {
    console.log(msg.data);
  }
}

async function initEngine() {
  window.Game = await Game.Game.create();
  window.Game.init(16);

  setInterval(() => { window.Game.lightCycle() }, 25);
}
