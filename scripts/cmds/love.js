const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
    config: {
        name: "love",
        aliases: ["Love"],
        version: "1.0",
        author: "SK-SIDDIK-KHAN",
        countDown: 5,
        role: 0,
        shortDescription: "",
        longDescription: "",
        category: "love",
    },

    onStart: async function ({ message, event }) {
        const mention = Object.keys(event.mentions);
        if (mention.length === 0) return message.reply("Please mention someone");

        let one, two;
        if (mention.length === 1) {
            one = event.senderID;
            two = mention[0];
        } else {
            one = mention[1];
            two = mention[0];
        }

        try {
            const imagePath = await createLoveImage(one, two);
            await message.reply({
                body: "╰‣ ᴘʟᴇᴀsᴇ ʙᴀʙʏ ᴀᴄᴄᴇᴘᴛ ᴍʏ ʟᴏᴠᴇ 💘",
                attachment: fs.createReadStream(imagePath)
            });
            fs.unlinkSync(imagePath); 
        } catch (err) {
            console.error(err);
            message.reply("An error occurred while creating the image.");
        }
    }
};

async function createLoveImage(one, two) {
    const avOne = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avOne.circle();

    const avTwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avTwo.circle();

    const response = await axios.get("https://drive.google.com/uc?export=download&id=11TPaOEF6IjxpY6yMlfLgIip-X99MrQpJ", {
        responseType: "arraybuffer"
    });
    const background = await jimp.read(Buffer.from(response.data));

    background
        .resize(1440, 1080)
        .composite(avOne.resize(470, 470), 125, 210)
        .composite(avTwo.resize(470, 470), 800, 200);

    const outputPath = `love-${one}-${two}.jpg`;
    await background.writeAsync(outputPath);
    return outputPath;
}