const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "propose",
    aliases: ["proposal"],
    version: "1.0",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 0,
    category: "fun"
  },

  onStart: async function ({ message, event }) {
    const targetID = getTargetID(event);
    if (!targetID) return message.reply("Please mention someone");

    const senderID = event.senderID;

    try {
      const imagePath = await generateProposalImage(senderID, targetID);
      await message.reply({
        body: "├─🅛🅞🅥🅔 🅨🅞🅤 🅑🅐🅑🅨─┤",
        attachment: fs.createReadStream(imagePath)
      });
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.error("Image generation failed:", err);
      message.reply("❌ Failed to generate image");
    }
  }
};

function getTargetID(event) {
  if (event.type === "message_reply" && event.messageReply?.senderID) {
    return event.messageReply.senderID;
  }

  const mentions = Object.keys(event.mentions || {});
  if (mentions.length > 0) {
    return mentions[0];
  }

  return null;
}

async function generateProposalImage(senderID, targetID) {
  const avatar1 = await jimp.read(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  const avatar2 = await jimp.read(`https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  avatar1.circle();
  avatar2.circle();

  const response = await axios.get("https://drive.google.com/uc?export=download&id=1AKOFk9AUwd6GHzlK1j5Y9ElVul0usU-R", {
    responseType: "arraybuffer"
  });
  const background = await jimp.read(Buffer.from(response.data));

  background
    .resize(760, 506)
    .composite(avatar1.resize(90, 90), 210, 65)
    .composite(avatar2.resize(90, 90), 458, 105);

  const outputPath = `propose_${Date.now()}.png`;
  await background.writeAsync(outputPath);
  return outputPath;
}