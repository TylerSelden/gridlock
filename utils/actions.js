const { send, sendAllPlayers, term } = require("./misc.js");
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

function privMsg(p, r, msg) {
  let pm = p.secrets.msgs;
  let rm = r.secrets.msgs;

  if (!pm[r.id]) pm[r.id] = [];
  if (!rm[p.id]) rm[p.id] = [];
  pm[r.id].push(`${r.name}: ${msg}`);
  rm[p.id].push(`${p.name}: ${msg}`);

  send(p.secrets.conn, "msg", {
    id: r.id,
    msg
  });
  if (r.online) send(r.secrets.conn, "msg", {
    id: p.id,
    msg
  })
}

function globalMsg(p, msg) {
  let pm = p.secrets.msgs;
  msg = `${p.name}: ${msg}`;

  for (let r of Global.players) {
    let rm = r.secrets.msgs;
    if (!rm.global) rm.global = [];
    rm.global.push(msg);
  };

  sendAllPlayers("msg", {
    id: p.id,
    msg
  });
}

const actions = {
  //// remove ping function
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
    
    if (player.id === msg.recipient) return;
    let recipient = Global.getPlayer(msg.recipient);

    if (recipient) return privMsg(player, recipient, msg.msg);
    globalMsg(player, msg.msg);
  }
}

module.exports = actions;
