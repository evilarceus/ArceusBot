const Discord = require("discord.js");
const client = new Discord.Client();
exports.client = client;
const process = require('process');

const Config = require('./Config');
const music = require("./Music");
const misc = require("./Misc");

function checkConfig(callback) {
    // Check if defaultVolume is an integer/float
    var defaultVolume;

    if (String(Config.defaultVolume).includes(".")) {
        defaultVolume = parseFloat(Config.defaultVolume);
    } else defaultVolume = parseInt(Config.defaultVolume);
    if (isNaN(defaultVolume)) {
        console.log("Please enter a correct value for option 'defaultVolume' (must be a number)")
        process.exit(1);
    }

    callback();
}

client.on('ready', () => {
    console.log("Logged in as " + client.user.tag + "!");
    console.log("Logged into " + client.guilds.array().length + " channels!");
});

client.on('message', msg => {
    if (msg.content.startsWith("!m")) {
        music.musicHandler(msg);
    }
    if (msg.content.startsWith("!clean")) {
        misc.clean(msg);
    }
});

checkConfig(function() {
    client.login(Config.token);
});