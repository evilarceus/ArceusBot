const config = require("../config");
const googleImages = require("google-images");
const client = new googleImages(config.googleCSE, config.googleCSE_APIKey);

module.exports = {
    imageHandler: function(msg) {
        const query = msg.content.substring(7);
        // ignore this lol
        if (msg.author.username === "WillyJ") { return msg.reply("No.") }
        client.search(query).then(images => msg.channel.send(images[0].url));
    }
};
