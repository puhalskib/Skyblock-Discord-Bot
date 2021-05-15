const discord_js = require("discord.js");
const WOKCommands = require("wokcommands");
const dotenv = require("dotenv").config();

const client = new discord_js.Client();

const guildID = process.env.GUILD_ID;

client.on('ready', () => {
    new WOKCommands(client, {
        commandsDir: 'commands',
        testServers: [guildID],
        showWarns: false
    });

});

client.login(process.env.TOKEN);
