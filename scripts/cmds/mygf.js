const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "mygf",
    aliases: [],
    version: "1.0",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 0,
    usePrefix: false,
    category: "love"
  },

  onStart: async function ({ message, event }) {
    const targetID = event.type === "message_reply" && event.messageReply?.senderID
      ? event.messageReply.senderID
      : Object.keys(event.mentions)[0];

    if (!targetID) {
      return message.reply("🔰 Please tag or reply to your GF 🔰");
    }

    const uid1 = event.senderID;
    const uid2 = targetID;

    try {
      const imgPath = await generateImage(uid1, uid2);
      await message.reply({
        body: "⊙──── 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 𝙼𝚈 𝙶𝙵 ────⊙",
        attachment: fs.createReadStream(imgPath)
      });

      setTimeout(() => fs.unlink(imgPath).catch(() => {}), 15000);

    } catch (err) {
      console.error("Error generating image:", err);
      message.reply("❌ Failed to generate image");
    }
  }
};

async function generateImage(uid1, uid2) {
  const avatar1 = await Jimp.read(`https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  const avatar2 = await Jimp.read(`https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);

  avatar1.circle();
  avatar2.circle();

  const response = await axios.get("https://drive.google.com/uc?export=download&id=19UVI0l2pDh1Jd6ZB3f9H7TOlem5Ew3vA", {
    responseType: "arraybuffer"
  });
  const background = await Jimp.read(Buffer.from(response.data));

  background
    .resize(1280, 716)
    .composite(avatar1.resize(360, 360), 130, 200)
    .composite(avatar2.resize(360, 360), 787, 200);

  const outputPath = path.join(__dirname, `mygf_${uid1}_${uid2}.jpg`);
  await background.writeAsync(outputPath);
  return outputPath;
}
