const DiscordJS = require('discord.js');
require('dotenv').config();

const guildId = process.env.GUILD_ID;
const client = new DiscordJS.Client();

const getApp = (guildId) => {
    const app = client.api.applications(client.user.id)
    if(guildId) {
        app.guilds(guildId)
    }
    return app
}

client.on('ready', async () => {
    console.log('bot online');

    //get command list in console
    //const commands = await getApp(guildId).commands.get()
    //console.log(commands)

    //delete a command using command id
    //await getApp(guildId).commands('842603052540100619').delete();
})

client.login(process.env.TOKEN);