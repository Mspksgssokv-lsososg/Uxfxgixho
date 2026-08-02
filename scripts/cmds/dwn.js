const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
 
module.exports = {
    config: {
        name: "dwn",
        version: "1.0",
        author: "SK-SIDDIK-KHAN",
        countDown: 5,
        role: 0,
        category: "image"
    },
    
    wrapText: function (ctx, text, maxWidth) {
        return new Promise(resolve => {
            if (ctx.measureText(text).width < maxWidth) return resolve([text]);
 
            const words = text.split(' ');
            const lines = [];
            let line = '';
 
            while (words.length > 0) {
                let split = false;
                while (ctx.measureText(words[0]).width >= maxWidth) {
                    const temp = words[0];
                    words[0] = temp.slice(0, -1);
                    if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
                    else {
                        split = true;
                        words.splice(1, 0, temp.slice(-1));
                    }
                }
                if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
                    line += `${words.shift()} `;
                } else {
                    lines.push(line.trim());
                    line = '';
                }
                if (words.length === 0) lines.push(line.trim());
            }
            resolve(lines);
        });
    },
 
    onStart: async function ({ message, event, args, api }) {
        let pathImg = __dirname + "/cache/background.png";
        let pathAvt1 = __dirname + "/cache/Avtmot.png";
 
        var id = Object.keys(event.mentions)[0] || event.senderID;
        var userInfo = await api.getUserInfo(id);
        var name = userInfo[id].name;
 
        var background = [
    "https://drive.google.com/uc?id=1Bl1rdp7VjM7GJkKBorddvdadN9jnpfaV"
  ];
        var rd = background[Math.floor(Math.random() * background.length)];
 
        let getAvtmot = (await axios.get(
            `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
            { responseType: "arraybuffer" }
        )).data;
        fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));
 
        let getbackground = (await axios.get(`${rd}`, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));
 
        let baseImage = await loadImage(pathImg);
        let baseAvt1 = await loadImage(pathAvt1);
 
        let canvas = createCanvas(baseImage.width, baseImage.height);
        let ctx = canvas.getContext("2d");
 
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseAvt1, 65, 142, 70, 70);
 
        ctx.font = "200 35px Arial-black";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "start";
 
        const lines = await this.wrapText(ctx, name, 1160);
        ctx.fillText(lines.join('\n'), 200, 150);
 
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        fs.removeSync(pathAvt1);
 
        return api.sendMessage({ body: ` `, attachment: fs.createReadStream(pathImg) },
            event.threadID,
            () => fs.unlinkSync(pathImg),
            event.messageID
        );
    }
};