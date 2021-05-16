
module.exports = {
    slash: true,
    testOnly: true,
    category: 'Fun & Games',
    description: 'Replies with "Pong!"',
    callback: ({ client }) => {
        
        return 'pong';
    }
};
