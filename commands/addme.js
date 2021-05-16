const JSONdb = require('simple-json-db');
const db = new JSONdb('database.json');
const fetch = require('node-fetch');

module.exports = {
    slash: true,
    testOnly: true,
    description: 'Add my minecraft hypixel profile',
    expectedArgs: '<username> <skyblockprofile>',
    minArgs: 2,
    maxArgs: 2,
    callback: async ({ args, interaction, client }) => {
        //request guild name
        let guildname;
        console.log('GET: https://discord.com/api/v8/guilds/' + interaction.guild_id);
        client.guilds.fetch(interaction.guild_id)
            .then(guild => guildname = guild.name)
            .catch(console.error);
        //request profile information
        let userProfiles;
        let mcUser;
        console.log('GET: https://api.mojang.com/users/profiles/minecraft/' + args[0]);
        await fetch('https://api.mojang.com/users/profiles/minecraft/' + args[0])
            .then(res => res.json())
            .then(body => mcUser = body)
            .catch(error => {return 'Error: ' + error});
        console.log('GET: https://api.hypixel.net/skyblock/profiles?key=' + process.env.HYPIXEL_KEY + '&uuid=' + mcUser.id);
        await fetch('https://api.hypixel.net/skyblock/profiles?key=' + process.env.HYPIXEL_KEY + '&uuid=' + mcUser.id)
            .then(res => res.json())
            .then(body => userProfiles = body);
        if(userProfiles.success == false) {
            return 'error "' + userProfiles.cause + '"';
        }
        let prof = userProfiles.profiles;


        //update the db
        //check for correct profile
        for(let i = 0; prof[i] != undefined; i++) {
            //console.log(b[i].profile_id);
            if(prof[i].cute_name == args[1]) {
                if(prof[i].banking.balance == undefined) {
                    return 'account ' + args[1] + ' has no bank'
                }
                //check if it is a new guild
                if(!db.has(interaction.guild_id)) {
                    db.set(interaction.guild_id, {
                        'guild_name': guildname,
                        'profiles': {}
                    });
                }
                

                let wholeguild = db.get(interaction.guild_id);
                //add new profile to the db
                if(wholeguild.profiles[prof[i].profile_id] == undefined) {
                    wholeguild.profiles[prof[i].profile_id] = {
                        'cute_name': prof[i].cute_name,
                        'members': [
                            {
                                'username': args[0],
                                'uuid': mcUser.id,
                                'purse': prof[i].members[mcUser.id].coin_purse
                            }
                        ],
                        'balance': prof[i].banking.balance
                    };
                    db.set(interaction.guild_id, wholeguild);
                } else {
                    //console.log('profile is already in db');
                    dbprofile = wholeguild.profiles[prof[i].profile_id];
                    let memberExist = false;
                    let profileindex = -1;
                    for(var j = 0; j < dbprofile.members.length; j++) {
                        //console.log('if ' + dbprofile.members[j].username + ' == ' +args[0] );
                        if(dbprofile.members[j].username == args[0]) {
                            memberExist = true;
                            profileindex = j;
                        }
                    }
                    //console.log('memberExist:' + memberExist);
                    
                    if(!memberExist) {
                        wholeguild.profiles[prof[i].profile_id].members.push({
                            'username': args[0],
                            'uuid': mcUser.id,
                            'purse': prof[i].members[mcUser.id].coin_purse
                        });
                        db.set(interaction.guild_id, wholeguild);
                    } else {
                        return args[0] + ' is already in db';
                    }
                }
                //need to have return statement here
                return JSON.stringify(db.get(interaction.guild_id));
            }
        }

        return 'could not find profile ' + args[1]
    }
};
