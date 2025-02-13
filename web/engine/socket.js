let socket;

export async function connect() {
  return new Promise(resolve => {
    socket = new WebSocket("wss://server.benti.dev:8080");
    socket.onopen = () => {
      send("state", "kcrmnq");
      resolve();
    }
    socket.onmessage = (msg) => {
      msg = JSON.parse(msg.data);

      if (actions[msg.type]) actions[msg.type](msg.data);
    }
  });
}

let actions = {
  "state": (data) => {
    if (!window.Game.initialized) window.Game.init(data.players);

    window.Game.time = data.time;
    window.Game.lightCycle();
  },
  "time": (data) => {
    console.log(`TIME: ${data}`);
    window.Game.time = data;
    window.Game.lightCycle();
  }
}

export function send(type, key) {
  socket.send(JSON.stringify({
    type,
    key
  }));
}

