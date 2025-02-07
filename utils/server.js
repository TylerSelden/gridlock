const FS = require("fs");
const HTTP = require("http");
const HTTPS = require("https");
const WebSocketServer = require("websocket").server;
const Config = require("../secrets/config.json");

let options;
if (Config.ssl) {
  options = {
    cert: FS.readFileSync(Config.ssl.cert),
    key: FS.readFileSync(Config.ssl.key)
  }
}

const httpServer = (Config.ssl) ? HTTPS.createServer(options) : HTTP.createServer();
const server = new WebSocketServer({ httpServer });

module.exports = { httpServer, server };
