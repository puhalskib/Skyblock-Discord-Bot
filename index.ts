import {Client, Message} from "discord.js";
import * as dotenv from 'dotenv';
dotenv.config();

const client = new Client();

client.on('ready', () => {
    console.log("beep boop");
});

client.login(process.env.TOKEN);