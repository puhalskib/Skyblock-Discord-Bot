const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '.';

const { HypixelClient } = require("node-hypixel.js");
const hyClient = new HypixelClient("");//Enter API key

//user minecraft id
const userUuid = [
    "", 
    "", 
    "" 
];

//minecraft usernames
const userNames = [
    "",
    "",
    ""
];

const bankAccount = [
    {
        uuid: 0, 
        profile: 0, //bank profile
        userIndex: [0], //user index(s) here
        name: "",
        lastTransaction: 1613446268334
    },
    {
        uuid: 1, 
        profile: 1,
        userIndex: [1, 2],
        name: "",
        lastTransaction: 1613446268334 
    }
];


var transactions = new Array(2);
var balance = new Array(2);

var userOnline = new Array(3);

const hypixelCheckInterval = 50000;

function checkOnline(uuid) {

    //console.log("Online status request");
    return new Promise(resolve => {
        hyClient.getPlayerStatusByUUID(uuid)
            .then((player) => {
                if (player.session.online) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((error) => {
                // Log the error if there is one.
                console.log(error);
            });
    });
}

function getSkyblockProfile(uuid, profile) {

    //console.log("skyblock profile request");
    return new Promise(resolve => {
        hyClient.skyblock.getProfiles(uuid)
            .then((player) => {
                //console.log(player);
                resolve(player.profiles[profile]);
            })
            .catch((error) => {
                // Log the error if there is one.
                console.log("skyblock profile requester" + error);
            });
    });
}

function getStatus(user, online, switched) {
    const postfix = "playing skyblock";
    if (switched) {
        if (online) {
            return user + "✅ has started " + postfix;
        } else {
            return user + "❌ has stopped " + postfix;
        }
    }
    if (online) {
        return user + ": ✅ online";
    } else {
        return user + ": ❌ offline";
    }
}

function getTransaction(t) {
    if (t.initiator_name == "Bank Interest") {
        return t.initiator_name.substring(2) + "INTEREST 🤑 ``" + Math.floor(t.amount) + "``";
    } else if (t.action == "DEPOSIT") {
        return t.initiator_name.substring(2) + " " + t.action + " 📈 ``" + Math.floor(t.amount) + "``";
    } else {
        return t.initiator_name.substring(2) + " " + t.action + " 📉 ``" + Math.floor(t.amount) + "``";
    }
}


function getLeaderboard() {
    //get largest bank value
    var max = 0;
    for (var i = 0; i < balance.length; i++) {
        max = Math.max(max, balance[i]);
    }

    //print according to relative size
    var s = "``";
    for (var i = 0; i < bankAccount.length; i++) {
        s += bankAccount[i].name + " ";
        for (var j = 0; j < Math.floor((10 * balance[i]) / max); j++) {
            s += "⬛";
        }
        if (i < (bankAccount.length - 1)) {
            s += "``\n``";
        }
    }
    return s + "``";
}

client.once('ready', async (first, last) => {
    const botchannel = client.channels.cache.find(channel => channel.name === "bot-spam");
    console.log("bot online");

    //initial online check
    for (var i = 0; i < userNames.length; i++) {
        userOnline[i] = await checkOnline(userUuid[i]);
        console.log(getStatus(userNames[i], userOnline[i], false));
    }

    //initial bank check
    console.log("starting initial check");
    for (var i = 0; i < bankAccount.length; i++) {
        //console.log("UUID IS " + userUuid[bankAccount[i].uuid]);
        var player = await getSkyblockProfile(userUuid[bankAccount[i].uuid], bankAccount[i].profile);
        console.log(bankAccount[i].name + " has " + Math.floor(player.banking.balance) + " monies");
        balance[i] = Math.floor(player.banking.balance);
        transactions[i] = player.banking.transactions;
        bankAccount[i].lastTransaction = player.banking.transactions[player.banking.transactions.length - 1].timestamp;
    }


    var intervalID = setInterval(async (first, last) => {
        //console.log("interval");

        //check if user has changed from online to offline
        for (var i = 0; i < userNames.length; i++) {
            if (userOnline[i] != await checkOnline(userUuid[i])) {
                userOnline[i] = !userOnline[i];
                //console.log(getStatus(userNames[i], userOnline[i], true));
                //user has changed state
                //discord message
                botchannel.send(getStatus(userNames[i], userOnline[i], true));
                //console.log(getStatus(userNames[i], userOnline[i], true))
            }
        }

        //console.log("checking online" + bankAccount[0].name);
        //check if transactions have changed
        for (var i = 0; i < bankAccount.length; i++) {
            var tempOnline = false;
            for (var j = 0; j < bankAccount[i].userIndex.length; j++) {
                if (userOnline[bankAccount[i].userIndex[j]]) {
                    tempOnline = true;
                }
            }
            if (tempOnline) {
                //if any bank members are online
                //console.log("checking bank account " + bankAccount[i].name);
                var bank = await getSkyblockProfile(userUuid[bankAccount[i].uuid], bankAccount[i].profile);
                //console.log("if " + transactions[i][transactions[i].length-1].timestamp + " != " + bankAccount[i].lastTransaction);
                if (bank.banking.transactions[bank.banking.transactions.length - 1].timestamp != bankAccount[i].lastTransaction) {
                    transactions[i] = bank.banking.transactions;
                    bankAccount[i].lastTransaction = bank.banking.transactions[bank.banking.transactions.length - 1].timestamp;
                    //console.log(getTransaction(transactions[i][transactions[i].length - 1]));
                    //discord transaction
                    //console.log("detected transaction change on " + bankAccount[i].name);
                    botchannel.send(getTransaction(transactions[i][transactions[i].length - 1]) + "\nBal: ``" + balance[i] + "`` ➡️ ``" + Math.floor(bank.banking.balance) + "``");
                    balance[i] = Math.floor(bank.banking.balance);
                }
            }
        }
    }, hypixelCheckInterval);


});


client.on('message', async message => {
    const botchannel = client.channels.cache.find(channel => channel.name === "bot-spam");

    //no reaction when in botchannel
    if (message.channel != botchannel) {

        //console.log("attempting to react");
        message.react('🇰')
            .then(() => message.react('🇦'))
            .then(() => message.react('🇵'))
            .then(() => message.react('🅿️'))
            .then(() => message.react('🅰️'))
            .catch(error => {
                //handle failure of any Promise rejection inside here
                console.log("error reacting");
            });
    }

    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();


    if (command === 'hello') {
        message.channel.send('please kill me');
    } else if (command === 'online') {

        //online check
        var tempString = "";
        for (var i = 0; i < userNames.length; i++) {
            userOnline[i] = await checkOnline(userUuid[i]);
            tempString += getStatus(userNames[i], userOnline[i], false);
            if (i < userNames.length - 1) {
                tempString += "\n";
            }
        }
        message.channel.send(tempString);
    } else if (command === 'lead') {
        message.channel.send(getLeaderboard());
    } else if (command === 'bal') {
        //print balance as number
        var s = "``";
        for (var i = 0; i < bankAccount.length; i++) {
            s += bankAccount[i].name + " " + balance[i]
            
            if (i < (bankAccount.length - 1)) {
                s += "``\n``";
            }
        }
        message.channel.send(s + "``");
    }
});


client.login(''); //discord bot key

