const Discord = require('discord.js');

module.exports = {
    slash: true,
    testOnly: true,
    description: 'returns graphical leaderboard"',
    callback: ({}) => {
        return new Discord.MessageEmbed()
            .setTitle('Leaderboard')
            .addField
        //get largest bank value
        var max = 0;
        for (var i = 0; i < balance.length; i++) {
            max = Math.max(max, balance[i]);
        }

        //print according to relative size
        var s = "``";
        for (var i = 0; i < bankAccount.length; i++) {
            s += bankAccount[i].name + " ";
            for (var j = 0; j < Math.floor((10 * balance[i]) / max); j++) {
                s += "⬛";
            }
            if (i < (bankAccount.length - 1)) {
                s += "``\n``";
            }
        }
        return s + "``";
        return 'pong';
    }
};
