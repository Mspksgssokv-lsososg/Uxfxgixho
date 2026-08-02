const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "love7",
        version: "1.0",
        author: "SK-SIDDIK-KHAN",
        countDown: 5,
        role: 0,
        category: "user"
    },

    onStart: async function ({ message, event }) {
        const mention = Object.keys(event.mentions);

        if (mention.length === 0) {
            return message.reply("Please mention someone❗");
        }

        const senderID = event.senderID;
        const user1 = mention.length === 1 ? senderID : mention[1];
        const user2 = mention[0];

        try {
            const imagePath = await generateLoveImage(user1, user2);
            await message.reply({
                body: "╰‣ ᴘʟᴇᴀsᴇ ʙᴀʙʏ ᴀᴄᴄᴇᴘᴛ ᴍʏ ʟᴏᴠᴇ 💘",
                attachment: fs.createReadStream(imagePath)
            });
            fs.unlinkSync(imagePath);
        } catch (err) {
            console.error("❌ Error generating love image:", err);
            message.reply("❌ Failed to generate image");
        }
    }
};

async function generateLoveImage(uid1, uid2) {
    const avatarURL1 = `https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const avatarURL2 = `https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    const [avone, avtwo] = await Promise.all([
        jimp.read(avatarURL1),
        jimp.read(avatarURL2)
    ]);

    avone.circle();
    avtwo.circle();

    const driveImage = await axios.get(
        "https://drive.google.com/uc?export=download&id=12JauUMen7_1t0_B9s51nYoeYbB8LoC_e",
        { responseType: "arraybuffer" }
    );
    const img = await jimp.read(Buffer.from(driveImage.data));

    img.resize(720, 406)
       .composite(avone.resize(161, 161), 415, 110)
       .composite(avtwo.resize(162, 162), 133, 109);

    const pth = path.join(__dirname, `love1_${Date.now()}.jpg`);
    await img.writeAsync(pth);

    return pth;
}