let Global = require("./global.js");
let Actions = require("./actions.js");
const { send } = require("./misc.js");

function serverMain(req) {
  let conn = req.accept(null, req.origin);
  Global.clients.push(conn);
  Actions.state(conn);

  conn.on("message", (msg) => {
    try {
      msg = JSON.parse(msg.utf8Data);
      Actions[msg.type](conn, msg);
    } catch(e) {
      send(conn, "err", "Something went wrong");
      conn.close();
      console.error(e);
    }
  })

  conn.on("close", () => {
    let i = Global.clients.indexOf(conn);
    Global.clients.splice(i, 1);
  })
}

module.exports = serverMain;
