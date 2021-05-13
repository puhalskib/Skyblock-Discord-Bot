const { HypixelClient } = require("node-hypixel.js");

class hypixelAPI {
    constructor(apitoken) {
        this.hyClient = new HypixelClient(process.env.HYPIXEL_KEY);
    }

    checkOnline(uuid) {

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

    getSkyblockProfile(uuid, profile) {

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


}

module.exports = hypixelAPI;