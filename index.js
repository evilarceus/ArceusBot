const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const Identity = require('./Identity');
var dispatcher;

const getVideoInfo = function(url, callback) {
    ytdl.getInfo(url, function(error, info) {
        callback(info);
})};

client.on('ready', () => {
    console.log("Logged in as " + client.user.tag + "!");
    console.log("Logged into channels: " + client.channels.array());
});

client.on('message', msg => {
    if (msg.content.startsWith("!m_play")) {
        if (!msg.content.substring(8).startsWith("https://www.youtube.com/watch?v=")) {
            return msg.reply("Please enter a valid link (must start with https://www.youtube.com/watch?v=)");
        }

        var url = msg.content.substring(8);
        if (url.includes("&")) {
            url.substring(0, url.indexOf("&"))
        }

        const voiceChannel = msg.member.voiceChannel;

        if (!voiceChannel) {
            return msg.reply("Please be in a valid voice channel.");
        }

        getVideoInfo(url, function (info) {
            voiceChannel.join()
                .then(connection => {
                    msg.reply("Now playing: " + info.title);

                    var stream = ytdl(url, {
                        filter: 'audioonly',
                    });

                    dispatcher = connection.playStream(stream);
                    dispatcher.setVolume(1);
                    dispatcher.on('end', () => {
                        voiceChannel.leave();
                    })
                })
        })
    }

    if (msg.content.startsWith("!m_pause")) {
        msg.reply("Pausing audio playback... (use \"!m_resume\" to resume playback)");
        dispatcher.pause();
    }

    if (msg.content.startsWith("!m_resume")) {
        msg.reply("Resuming audio playback...");
        dispatcher.resume();
    }

    if (msg.content.startsWith("!m_stop")) {
        msg.reply("Stopping audio playback...");
        dispatcher.end();
    }

    if (msg.content.startsWith("!m_volume")) {
        var volume = parseInt(msg.content.substring(10));
        if (isNaN(volume)) {
            return msg.reply("Please enter a numerical value.")
        }
        msg.reply("Setting volume of audio playback to " + volume * 100 + "%...");
        dispatcher.setVolume(volume);
    }
});

client.login(Identity.token);