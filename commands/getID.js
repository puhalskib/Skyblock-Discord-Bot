const fetch = require('node-fetch');

module.exports = {
    name: 'getUUID',
    slash: true,
    testOnly: true,
    description: 'get a minecraft uuid',
    expectedArgs: '<username>',
    minArgs: 1,
    maxArgs: 1,
    callback: async ({ args }) => {
        var a;
        console.log('GET: https://api.mojang.com/users/profiles/minecraft/' + args[0]);
        await fetch('https://api.mojang.com/users/profiles/minecraft/' + args[0])
            .then(res => res.json())
            .then(body => a = body.id);
        return a;
    }
};
