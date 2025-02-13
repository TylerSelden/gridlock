// well this is gonna take a LOT of work

const Config = require("./secrets/config.json");
const { httpServer, server } = require("./utils/server.js");
const serverMain = require("./utils/server_main.js");
const { sendAll, currentTime } = require("./utils/misc.js");
let Global = require("./utils/global.js");

server.on("request", serverMain);

httpServer.listen(Config.port);

console.log(`Starting Server...
  Protocol: ${(Config.ssl) ? "SSL" : "HTTP"}
  Port: :${Config.port}
  Started: ${new Date(Date.now()).toLocaleString()}
Server started!
`);

setInterval(() => {
  Global.time = currentTime();
  sendAll("time", Global.time);
}, 60000);
