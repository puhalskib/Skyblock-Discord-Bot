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

function updateLoop() {

}

function updateGuild(guildID) {
    var db = new JSONdb('database.json');
    var guildJson = db.get(guildID);

    var profiles = Object.keys(guildJson.profiles);

    //grab all the profile balances
    for(var i = 0; i < profiles.length; i++) {
        var profileBalance = updateProfile(profiles[i]);
    }

    

}



function updateProfile(profileId) {
    var mcUser;
    console.log('GET: https://api.hypixel.net/skyblock/profile?key=' + process.env.HYPIXEL_KEY + '&profile=' + profileId);
    await fetch('https://api.hypixel.net/skyblock/profiles?key=' + process.env.HYPIXEL_KEY + '&profile=' + profileId)
        .then(res => res.json())
        .then(body => mcUser = body)
        .catch(error => {return 'Error: ' + error});
    
    return mcUser.profile.banking.balance;
}
