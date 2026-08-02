const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "toilet",
    aliases: ["toilets"],
    version: "1.0",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 0,
    shortDescription: "face on toilet",
    longDescription: "",
    category: "fun",
    guide: "{pn} [mention someone or reply a message]",
  },

  onStart: async function ({ message, event }) {
    const uid1 = Object.keys(event.mentions)[0];
    const uid2 = event.messageReply ? event.messageReply.senderID : null;
    const replyUser = uid1 || uid2;

    if (!replyUser) {
      return message.reply("Please mention someone");
    }

    try {
      const imagePath = await generateToiletImage(replyUser);
      if (imagePath) {
        await message.reply({
          body: "You Deserve This Place 🙂✌️",
          attachment: fs.createReadStream(imagePath)
        });
        fs.unlinkSync(imagePath);
      } else {
        message.reply("An error occurred while processing the image.");
      }
    } catch (error) {
      console.error("❌ Failed to send toilet image:", error);
      message.reply("❌ Error");
    }
  },
};

async function generateToiletImage(userID) {
  try {
    const avatar = await jimp.read(`https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avatar.resize(400, 400).circle();

    const driveFileId = "12m2y61lcba7P6bqmKcy7j60mel8PGRin";
    const driveURL = `https://drive.google.com/uc?export=download&id=${driveFileId}`;

    const response = await axios.get(driveURL, { responseType: "arraybuffer" });
    const background = await jimp.read(Buffer.from(response.data));
    background.resize(1080, 1350);

    background.composite(avatar, 310, 670);

    const outputPath = `toilet_${Date.now()}.png`;
    await background.writeAsync(outputPath);
    return outputPath;
  } catch (error) {
    console.error("Error processing toilet image:", error);
    return null;
  }
}