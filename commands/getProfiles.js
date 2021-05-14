//const hyAPI = require('../src/hypixelAPI');
const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    slash: true,
    testOnly: true,
    description: `get the minecraft account's profiles`,
    expectedArgs: '<account>',
    minArgs: 1,
    maxArgs: 1,
    callback: async ({ args }) => {
        let a;
        console.log('GET: https://api.hypixel.net/player?key=' + process.env.HYPIXEL_KEY + '&name=' + args[0]);
        await fetch('https://api.hypixel.net/player?key=' + process.env.HYPIXEL_KEY + '&name=' + args[0])
            .then(res => res.json())
            .then(body => a = body);
        if(a.success == false) {
            return 'error "' + a.cause + '"';
        }
        
        let c = Object.keys(a.player.stats.SkyBlock.profiles);
        const embedmsg = new Discord.MessageEmbed()
            .setTitle(args[0] + "'s Profiles");

        for(var i = 0; i < c.length; i++) {
            embedmsg.addField(a.player.stats.SkyBlock.profiles[c[i]].cute_name, c[i], true);
        }
        return embedmsg;
    }
};
