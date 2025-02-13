let Global = require("./global.js");

function send(conn, type, data) {
  conn.send(JSON.stringify({ type, data }));
}
function sendAll(type, data) {
  for (let conn of Global.clients) {
    send(conn, type, data);
  }
}
function sendAllPlayers(type, data) {
  for (let player of Global.players) {
    if (player.online) send(player.secrets.conn, type, data);
  }
}

function term(conn, reason) {
  send(conn, "err", reason);

  let player = Global.players.find(player => player.secrets.conn === conn);
  if (player) {
    delete player.secrets.conn;
    player.online = false;
  }

  conn.close();
}

function auth(conn, msg) {
  let player = Global.players.find(player => player.secrets.key === msg.key);

  if (player) {
    if (player.secrets.conn !== conn) {
      if (player.online) term(player.secrets.conn, "You have connected on another device");
      player.secrets.conn = conn;
      conn.id = player.id;
      player.online = true;
    }
  }
  return player;
}

function currentTime() {
  let offset = new Date().getTimezoneOffset() * 6e4 + 2.16e7;
  let ms = (Date.now() - offset) % 8.64e7;
  return ms / 8.64e7 * 360;
}

function getPlayers() {
  return Global.players.map(({ secrets, ...r }) => r);
}
function getPlayer(id) {
  return Global.players.find(player => player.id === id);
}
function getPlayerClean(id) {
  let player = getPlayer(id);
  return (({secrets, ...r}) => r)(player);
}

module.exports = { send, sendAll, sendAllPlayers, term, auth, currentTime, getPlayers, getPlayer, getPlayerClean };
