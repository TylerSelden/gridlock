let Global = require("./global.js");

function send(conn, type, data) {
  conn.send(JSON.stringify({ type, data }));
}

function sendAll(type, data) {
  for (let conn of Global.clients) {
    send(conn, type, data);
  }
}

module.exports = { send, sendAll };
