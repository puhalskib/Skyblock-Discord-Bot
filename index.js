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

function updateAll() {
    var db = new JSONdb('database.json');
    var guildIDs = Object.keys(db.JSON());

    console.log('updating guilds');
    for(var i = 0; i < guildIDs.length; i++) {
        updateGuild(guildIDs[i]);
        wait(60);
    }

}

async function updateGuild(guildID) {
    var db = new JSONdb('database.json');
    var guildJson = db.get(guildID);

    var profiles = Object.keys(guildJson.profiles);


    var d = new Date();

    //grab all the profile balances
    for(var i = 0; i < profiles.length; i++) {
        var profileBalance = await updateProfile(profiles[i]);
        guildJson.profiles[profiles[i]].balance = profileBalance;
        if(guildJson.profiles[profiles[i]].balance_his == undefined) {
            guildJson.profiles[profiles[i]].balance_his = [];
        }
        guildJson.profiles[profiles[i]].balance_his.push({
            'balance': profileBalance,
            'day': d.getDay(),
            'month': d.getMonth(),
            'year': d.getFullYear()
        })
        wait(2000);
    }

    db.set(guildID, guildJson);
}




function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

function updateProfile(profileId) {
    console.log('GET: https://api.hypixel.net/skyblock/profile?key=' + process.env.HYPIXEL_KEY + '&profile=' + profileId);
    return new Promise(resolve => {
        fetch('https://api.hypixel.net/skyblock/profiles?key=' + process.env.HYPIXEL_KEY + '&profile=' + profileId)
            .then(res => res.json())
            .then(body => resolve(body.profile.banking.balance))
            .catch(error => resolve('Error: ' + error))
    });
}


async function updateDaily() {
    var d = new Date();


    var intervalID = setInterval(() => {
        var c = new Date();
        if(c.getDay() != d.getDay()) {
            console.log('updating db');
            updateAll();
            d = new Date();
        }
    }, 10000);//10 seconds
}

//start update loop
updateAll();