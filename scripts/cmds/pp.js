const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "pp",
    version: "1.0.0",
    author: "SK-SIDDIK-KHAN",
    countDown: 3,
    role: 0,
    usePrefix: false,
    category: "utility",
    guide: {
      en: "{pn} [reply/@mention/link]"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    const cachePath = __dirname + "/cache/profile.png";

    try {
      let uid;

      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
      }

      else if (Object.keys(event.mentions || {}).length > 0) {
        uid = Object.keys(event.mentions)[0];
      }

      else if (args[0] && args[0].includes(".com/")) {
        const resID = await api.getUID(args[0]);
        uid = resID;
      }

      else {
        uid = event.senderID;
      }

      const name = await usersData.getName(uid);

      const imageUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const callback = () => {
        api.sendMessage(
          {
            body: ``,
            attachment: fs.createReadStream(cachePath)
          },
          event.threadID,
          () => fs.unlinkSync(cachePath),
          event.messageID
        );
      };

      request(encodeURI(imageUrl))
        .pipe(fs.createWriteStream(cachePath))
        .on("close", callback);

    } catch (err) {
      console.error(err);
      api.sendMessage(
        "⚠️ Something went wrong, please try again ❌",
        event.threadID,
        event.messageID
      );
    }
  }
};
