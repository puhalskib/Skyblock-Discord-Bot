const discord_js = require("discord.js");
const WOKCommands = require("wokcommands");
const dotenv = require("dotenv").config();
const fetch = require('node-fetch');
const JSONdb = require('simple-json-db');

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
/*
function updateLoop() {

}

function updateGuild(guildID) {
    var db = new JSONdb('database.json');
    var guildJson = db.get(guildID);

    updateProfiles(guildJson)

}



function updateProfile(uuid, profileId) {
    var mcUser;
    console.log('GET: https://api.hypixel.net/skyblock/profiles?key=' + process.env.HYPIXEL_KEY +'&uuid=' + uuid);
    await fetch('https://api.hypixel.net/skyblock/profiles?key=' + process.env.HYPIXEL_KEY +'&uuid=' + uuid)
        .then(res => res.json())
        .then(body => mcUser = body)
        .catch(error => {return 'Error: ' + error});
    
    //return mcUser.profiles.
}

*/