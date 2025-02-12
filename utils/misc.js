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

module.exports = { send, sendAll, sendAllPlayers, term };
