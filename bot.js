const tmi = require("tmi.js");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
};

const client = new tmi.client(opts);

client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

client.connect();

const deathCounter = {

  getDeaths: function () {
    const rawdata = fs.readFileSync("deathcounter.json");
    const counter = JSON.parse(rawdata);
    return counter.count;
  },

  setDeaths: function (x) {
    const rawdata = fs.readFileSync("deathcounter.json");
    const counter = JSON.parse(rawdata);

    counter.count = x;

    const data = JSON.stringify(counter);
    fs.writeFileSync("deathcounter.json", data);
  },

  addDeath: function () {
    const rawdata = fs.readFileSync("deathcounter.json");
    const counter = JSON.parse(rawdata);

    counter.count += 1;

    const data = JSON.stringify(counter);
    fs.writeFileSync("deathcounter.json", data);
  },

  resetDeaths: function () {
    const rawdata = fs.readFileSync("deathcounter.json");
    const counter = JSON.parse(rawdata);

    counter.count = 0;

    const data = JSON.stringify(counter);
    fs.writeFileSync("deathcounter.json", data);
  },

  removeDeath: function () {
    const rawdata = fs.readFileSync("deathcounter.json");
    const counter = JSON.parse(rawdata);

    if (counter.count === 0) return counter.count;

    counter.count -= 1;

    const data = JSON.stringify(counter);
    fs.writeFileSync("deathcounter.json", data);
  },
};

function onMessageHandler(target, context, msg, self) {
  if (self || !msg.includes("!")) return;

  const messageArray = msg.trim().toLowerCase().split(" ");

  const commandName = messageArray[0];

  const arg = messageArray[1];

  if (
    context.username === "friendlytm8" ||
    context.username === "peppermintpoot" ||
    context.mod
  ) {
    if (commandName === "!death") {
      deathCounter.addDeath();
      client.say(target, `Deaths: ${deathCounter.getDeaths()}`);
    } else if (commandName === "!removedeath") {
      deathCounter.removeDeath();
      client.say(target, `Deaths: ${deathCounter.getDeaths()}`);
    } else if (commandName === "!resetdeaths") {
      deathCounter.resetDeaths();
      client.say(target, `Deaths: ${deathCounter.getDeaths()}`);
    } else if (commandName === "!deathcount") {
      client.say(target, `Deaths: ${deathCounter.getDeaths()}`);
    } else if (commandName === "!fcbstatus") {
      client.say(target, "FriendlyChatter_BOT is connected and listening.");
    } else if (commandName === "!fcbstop") {
      client.say(target, "Leaving channel, restart manually to continue use.");
      try {
        client.part(target);
      } catch (ex) {
        console.log(ex.message);
      }
    } else if (commandName === "!setdeaths" && arg) {
      const newVal = parseInt(arg);
      deathCounter.setDeaths(newVal);
      client.say(target, `Deaths: ${deathCounter.getDeaths()}`);
    }
  } else {
    if (commandName === "!deathcount") {
      client.say(target, `Deaths: ${deathCounter.getDeaths()}`);
    } else {
    }
  }
}

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}