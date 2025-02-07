const Config = require("../secrets/config.json");
const Crypto = require("crypto");

let clients = [];
let players = [];
let time = setTime();

function setTime() {
  let offset = new Date().getTimezoneOffset() * 6e4 + 2.16e7;
  let ms = (Date.now() - offset) % 8.64e7;
  return ms / 8.64e7 * 360;
}

function getPlayers() {
  return players.map(({ secrets, ...r}) => r);
}
function getPlayer(i) {
  return getPlayers()[i];
}

// generate players
console.log(`Join codes:
  |`);

let dev = {
  "Test": "kcrmnq"
}
for (let i of Config.players) {
  let key = dev[i] || Crypto.randomUUID();

  players.push({
    x: Math.floor(Math.random() * 16),
    y: Math.floor(Math.random() * 16),
    c: Math.floor(Math.random() * 0xffffff),
    name: i,
    hp: 3,
    ap: 1,
    rp: 8,
    secrets: {
      key,
      messages: {}
    }
  });

  console.log(`  |- ${i}: ${key}
  |`)
}
console.log(`__|
`);


module.exports = { clients, players, time, setTime, getPlayers, getPlayer };
