const JSONdb = require('simple-json-db');
const db = new JSONdb('../database.json');

module.exports = {
    slash: true,
    testOnly: true,
    description: 'Add my minecraft hypixel profile',
    expectedArgs: '<uuid> <profile>',
    minArgs: 2,
    maxArgs: 2,
    callback: ({ args }) => {
        return args[0] + ' ' + args[1];
    }
};
