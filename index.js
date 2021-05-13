"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
const client = new discord_js_1.Client();
client.on('ready', () => {
    console.log("beep boop");
});
client.login(process.env.TOKEN);
//# sourceMappingURL=index.js.map