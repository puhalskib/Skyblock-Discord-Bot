const JSONdb = require('simple-json-db');
const db = new JSONdb('../database.json');
const fetch = require('node-fetch');

module.exports = {
    slash: true,
    testOnly: true,
    description: 'Add my minecraft hypixel profile',
    expectedArgs: '<uuid> <profile>',
    minArgs: 2,
    maxArgs: 2,
    callback: async ({ args }) => {
        let a;
        console.log('GET: https://api.hypixel.net/player?key=' + process.env.HYPIXEL_KEY + '&name=' + args[0]);
        await fetch('https://api.hypixel.net/skyblock/profiles?key=' + process.env.HYPIXEL_KEY + '&uuid=' + args[0])
        .then(res => res.json())
        .then(body => a = body);
        if(a.success == false) {
            return 'error "' + a.cause + '"';
        }
        let b = a.profiles;
        for(let i = 0; b[i] != undefined; i++) {
            console.log(b[i].profile_id);
            if(b[i].cute_name == args[1]) {
                if(b[i].banking.balance == undefined) {
                    return 'account ' + args[1] + ' has no bank'
                }
                //add profile to the db
                if(!db.has(b[i].profile_id)) {
                    db.set(b[i].profile_id, {
                        'cute_name': b[i].cute_name,
                        'members': [
                            
                        ]

                    })
                }
                return JSON.stringify(b[i].banking.balance);
            }
        }

        return 'could not find profile ' + args[1]
    }
};
