class minecraftProfile {
    constructor(uuid, username, profile) {

    }


    getStatus(user, online, switched) {
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


    getTransaction(t) {
        if (t.initiator_name == "Bank Interest") {
            return t.initiator_name.substring(2) + "INTEREST 🤑 ``" + Math.floor(t.amount) + "``";
        } else if (t.action == "DEPOSIT") {
            return t.initiator_name.substring(2) + " " + t.action + " 📈 ``" + Math.floor(t.amount) + "``";
        } else {
            return t.initiator_name.substring(2) + " " + t.action + " 📉 ``" + Math.floor(t.amount) + "``";
        }
    }
}