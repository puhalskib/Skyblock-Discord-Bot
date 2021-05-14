const hyAPI = require('../src/hypixelAPI');

module.exports = {
    slash: true,
    testOnly: true,
    description: `get the minecraft account's profiles`,
    expecctedArgs: '<uuid>',
    minArgs: 1,
    maxArgs: 1,
    callback: ({ args }) => {

        return 'pong';
    }
};
