const { send } = require("./misc.js");
let Global = require("./global.js");

function auth(conn, msg) {
  let player = Global.players.some(player => player.secrets.key === msg.key);
  return player;
}

const actions = {
  ping: (conn, msg) => {
    console.log(msg);
    send(conn, "ping", "pong");
  },
  state: (conn, msg) => {
    send(conn, "state", {
      players: Global.getPlayers(),
      time: Global.time
    });
  },
  getMsgs: (conn, msg) => {
    if (!auth(conn, msg)) return;
  }
}

module.exports = actions;
