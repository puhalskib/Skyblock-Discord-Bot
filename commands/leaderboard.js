const Discord = require('discord.js');
const JSONdb = require('simple-json-db');


module.exports = {
    slash: true,
    testOnly: true,
    description: 'returns graphical leaderboard"',
    callback: ({ interaction }) => {
        const db = new JSONdb('database.json');
        var guildprofiles = db.get(interaction.guild_id);
        //console.log(interaction.guild_id);
        //console.log(JSON.stringify(guildprofiles));
        if(guildprofiles == undefined) {
            return 'There are no profiles in this server';
        }

        //get largest bank value
        var max = 0;
        for (x in guildprofiles.profiles) {
            max = Math.max(max, guildprofiles.profiles[x].balance);
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(guildprofiles.guild_name + ' Leaderboard');

        //print according to relative size
        for (x in guildprofiles.profiles) {
            var s = '';
            for (var j = 0; j < Math.floor((20 * guildprofiles.profiles[x].balance) / max); j++) {
                s += "⬜";
            }
            //find all members names
            var names = '';
            for (var i = 0; i < guildprofiles.profiles[x].members.length; i++) {
                if(i != 0) {
                    names += '/';
                }
                names += guildprofiles.profiles[x].members[i].username;
            }
            embed.addField(names, s);
        }


        return embed;
    }
};
