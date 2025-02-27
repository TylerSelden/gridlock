let Global = require("./global.js");
let Actions = require("./actions.js");
const { send, term, getPlayer } = require("./misc.js");

function serverMain(req) {
  let conn = req.accept(null, req.origin);
  Global.clients.push(conn);

  conn.on("message", (msg) => {
    try {
      msg = JSON.parse(msg.utf8Data);
      Actions[msg.type](conn, msg);
    } catch(e) {
      term(conn, "Something went wrong.");
    }
  })

  conn.on("close", () => {
    let player = getPlayer(conn.id);
    if (player) {
      player.online = false;
      delete player.conn;
    }

    let i = Global.clients.indexOf(conn);
    Global.clients.splice(i, 1);
  })
}

module.exports = serverMain;
