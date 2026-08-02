const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "love4",
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
            fs.unlinkSync(imagePath); // Clean up temporary file
        } catch (err) {
            console.error("❌ Error generating love image:", err);
            message.reply("❌ Failed to generate image");
        }
    }
};

async function generateLoveImage(uid1, uid2) {
    const avatarURL1 = `https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const avatarURL2 = `https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    const [avatar1, avatar2] = await Promise.all([
        jimp.read(avatarURL1),
        jimp.read(avatarURL2)
    ]);

    avatar1.resize(470, 470).circle();
    avatar2.resize(470, 470).circle();

    const driveImage = await axios.get(
        "https://drive.google.com/uc?export=download&id=11vkCjvFF-5cCRQGxxspfOUQJ0gmnkoV6",
        { responseType: "arraybuffer" }
    );
    const background = await jimp.read(Buffer.from(driveImage.data));

    background.resize(1440, 1080);

    background
        .composite(avatar1, 125, 210)
        .composite(avatar2, 800, 200);

    const outputPath = path.join(__dirname, `love_${Date.now()}.jpg`);
    await background.writeAsync(outputPath);

    return outputPath;
}