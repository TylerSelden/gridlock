const Config = require("../secrets/config.json");
const { send, sendAll, sendAllPlayers, term, auth, getPlayers, getPlayer, getPlayerClean } = require("./misc.js");
let Global = require("./global.js");


function evt(id) {
  sendAll("evt", getPlayerClean(id));
}

function privMsg(p, r, msg) {
  let pm = p.secrets.msgs;
  let rm = r.secrets.msgs;

  if (!pm[r.id]) pm[r.id] = [];
  if (!rm[p.id]) rm[p.id] = [];
  pm[r.id].push(`${r.name}: ${msg}`);
  rm[p.id].push(`${p.name}: ${msg}`);
  while (pm[r.id].length > Config.maxMsgs) pm[r.id].shift();
  while (rm[p.id].length > Config.maxMsgs) rm[p.id].shift();

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
    while (rm.global.length > Config.maxMsgs) rm.global.shift();
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
      players: getPlayers(),
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

    if (player.id === msg.recipient) return send(conn, "err", "You cannot message yourself");
    let recipient = getPlayer(msg.recipient);

    if (recipient) return privMsg(player, recipient, msg.msg);
    globalMsg(player, msg.msg);
  },

  move: (conn, msg) => {
    let player = auth(conn, msg);
    if (!player) return term(conn, "Invalid key");
    if (player.ap < 1) return send(conn, "err", "You have no Action Points");

    let {x, z} = msg;

    if (typeof(x) === "number" && Math.abs(x) === 1) player.x += x;
    if (typeof(y) === "number" && Math.abs(y) === 1) player.y += y;
    player.ap--;

    evt(player.id);
  }
}

module.exports = actions;
