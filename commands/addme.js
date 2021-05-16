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
    callback: async ({ args }) => {
        let a;
        let c;
        console.log('GET: https://api.mojang.com/users/profiles/minecraft/' + args[0]);
        await fetch('https://api.mojang.com/users/profiles/minecraft/' + args[0])
            .then(res => res.json())
            .then(body => c = body)
            .catch(error => {return 'Error: ' + error});
        console.log('GET: https://api.hypixel.net/skyblock/profiles?key=' + process.env.HYPIXEL_KEY + '&uuid=' + c.id);
        await fetch('https://api.hypixel.net/skyblock/profiles?key=' + process.env.HYPIXEL_KEY + '&uuid=' + c.id)
            .then(res => res.json())
            .then(body => a = body);
        if(a.success == false) {
            return 'error "' + a.cause + '"';
        }
        let b = a.profiles;
        for(let i = 0; b[i] != undefined; i++) {
            //console.log(b[i].profile_id);
            if(b[i].cute_name == args[1]) {
                if(b[i].banking.balance == undefined) {
                    return 'account ' + args[1] + ' has no bank'
                }
                //add new profile to the db
                if(!db.has(b[i].profile_id)) {
                    db.set(b[i].profile_id, {
                        'cute_name': b[i].cute_name,
                        'members': [
                            {
                                'username': args[0],
                                'uuid': c.id,
                                'purse': b[i].members[c.id].coin_purse
                            }
                        ],
                        'balance': b[i].banking.balance
                    })
                } else {
                    //console.log('profile is already in db');
                    let dbprofile = db.get(b[i].profile_id);
                    let memberExist = false;
                    for(var j = 0; j < dbprofile.members.length; j++) {
                        //console.log('if ' + dbprofile.members[j].username + ' == ' +args[0] );
                        if(dbprofile.members[j].username == args[0]) {
                            memberExist = true;
                        }
                    }
                    //console.log('memberExist:' + memberExist);
                    
                    if(!memberExist) {
                        dbprofile.members.push({
                            'username': args[0],
                            'uuid': c.id,
                            'purse': b[i].members[c.id].coin_purse
                        });
                        db.set(b[i].profile_id, dbprofile);
                    } else {
                        return args[0] + ' is already in db';
                    }
                }
                return JSON.stringify(db.get(b[i].profile_id));
            }
        }

        return 'could not find profile ' + args[1]
    }
};
