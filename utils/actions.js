const { send, term } = require("./misc.js");
let Global = require("./global.js");

function auth(conn, msg) {
  let player = Global.players.find(player => player.secrets.key === msg.key);

  if (player) {
    if (player.secrets.conn !== conn) {
      if (player.online) term(player.secrets.conn, "You have connected on another device");
      player.secrets.conn = conn;
      player.online = true;
    }
  }

  return player;
}

const actions = {
  ping: (conn, msg) => {
    console.log(msg);
    send(conn, "ping", "pong");
  },
  state: (conn, msg) => {
    let player = auth(conn, msg);
    let state = {
      players: Global.getPlayers(),
      time: Global.time
    };
    if (player) {
      state.msgs = player.secrets.msgs;
    }
    send(conn, "state", state);
  },
  getMsgs: (conn, msg) => {
    let player = auth(conn, msg);
    if (!player) return term(conn, "Invalid key");

    send(conn, "msgs", player.secrets.msgs);
  },
  msg: (conn, msg) => {
    let player = auth(conn, msg);
    if (!player) return term(conn, "Invalid key");

    let recipient = Global.getPlayer(msg.recipient);

    let pmsgs = player.secrets.msgs;
    let rmsgs = recipient.secrets.msgs;
    if (!rmsgs[player.id]) rmsgs[player.id] = [];
    if (!pmsgs[recipient.id]) pmsgs[recipient.id] = [];
    rmsgs[player.id].push(`${player.name}: ${msg.msg}`);
    pmsgs[recipient.id].push(`${recipient.name}: ${msg.msg}`);

    send(conn, "msg", msg.msg);
    if (recipient.online) send(recipient.secrets.conn, "msg", msg.msg);
  }
}

module.exports = actions;
