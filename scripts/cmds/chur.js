const axios = require('axios');
const jimp = require("jimp");
const Canvas = require("canvas");
const fs = require("fs");

module.exports = {
    config: {
        name: "chor",
        aliases: ["chur"],
        version: "1.0",
        author: "SK-SIDDIK-KHAN",
        role: 0,
        category: "fun"
    },
    onStart: async function ({ message, event, args }) {
        try {
            if (!event.mentions || Object.keys(event.mentions).length === 0) {
                return message.reply("Please mention someone❗");
            }

            const id = Object.keys(event.mentions)[0];

            const canvas = Canvas.createCanvas(500, 670);
            const ctx = canvas.getContext('2d');

            const background = await Canvas.loadImage('https://drive.google.com/uc?export=download&id=12QcRZwUu-OPlzwtqXg1x5RI49cR5vLl5');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            const avatarResponse = await axios.get(
                `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                { responseType: 'arraybuffer' }
            );
            const avatarBuffer = Buffer.from(avatarResponse.data, 'binary');
            
            let avatarImage = await jimp.read(avatarBuffer);
            avatarImage = avatarImage.circle(); 

            const avatarCanvasImage = await Canvas.loadImage(await avatarImage.getBufferAsync(jimp.MIME_PNG));
            ctx.drawImage(avatarCanvasImage, 48, 410, 111, 111);

            const filePath = '/tmp/chor_output.png';
            fs.writeFileSync(filePath, canvas.toBuffer());

            await message.reply({ 
                body: "মুরগী চোর পাওয়া গেছে...😹", 
                attachment: fs.createReadStream(filePath) 
            });

        } catch (error) {
            console.error("Error generating image:", error);
            message.reply("❌ Failed to generate image");
        }
    }
};