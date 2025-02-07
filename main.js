// well this is gonna take a LOT of work

const Config = require("./secrets/config.json");
const { httpServer, server } = require("./utils/server.js");

server.on("request", () => {
  console.log("yea");
});

httpServer.listen(Config.port);

console.log(`Starting Server...
  Protocol: ${(Config.ssl) ? "SSL" : "HTTP"}
  Port: :${Config.port}
  Started: ${new Date(Date.now()).toLocaleString()}
Server started!
`);
