const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");
const { loadImage, createCanvas, registerFont } = require("canvas");

module.exports = {
  config: {
    name: "fbcover",
    version: "1.0.3",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 0,
    category: "image",
    guide: {
      en: "{pn} Name - Subname - Address - Email - Phone - Color\nExample:\n/fbcover Tamim - Khan - Rajshahi - tm@gmail.com - 013xxxxxxxx - red"
    }
  },

  onStart: async function ({ event, message, args }) {
    const send = (msg, attachment) =>
      message.reply({ body: msg, attachment });

    const input = args.join(" ").split(/\s*-\s*/).map(i => i.trim());

    if (input.length < 6) {
      return send(
        "❌| Wrong\nTry /fbcover Name - Subname - Address - Email - Phone - Color"
      );
    }

    const [name, subname, address, email, phone, colorRaw] = input;
    const color = (!colorRaw || colorRaw.toLowerCase() === "no") ? "#ffffff" : colorRaw;
    const uid = event.senderID;

    const cache = path.join(__dirname, "cache");
    fs.ensureDirSync(cache);

    const pathImg = path.join(cache, "fbcover1.png");
    const pathAva = path.join(cache, "fbcover2.png");
    const pathMask = path.join(cache, "fbcover3.png");
    const fontPath = path.join(cache, "UTMAvoBold.ttf");

    const circle = async (image) => {
      const img = await jimp.read(image);
      img.circle();
      return img.getBufferAsync("image/png");
    };

    try {
      const avtAnime = (await axios.get(
        `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" })).data;

      const background = (await axios.get(
        `https://1.bp.blogspot.com/-ZyXHJE2S3ew/YSdA8Guah-I/AAAAAAAAwtQ/udZEj3sXhQkwh5Qn8jwfjRwesrGoY90cwCNcBGAsYHQ/s0/bg.jpg`,
        { responseType: "arraybuffer" })).data;

      const mask = (await axios.get(
        `https://1.bp.blogspot.com/-zl3qntcfDhY/YSdEQNehJJI/AAAAAAAAwtY/C17yMRMBjGstL_Cq6STfSYyBy-mwjkdQwCNcBGAsYHQ/s0/mask.png`,
        { responseType: "arraybuffer" })).data;

      fs.writeFileSync(pathAva, Buffer.from(avtAnime));
      fs.writeFileSync(pathImg, Buffer.from(background));
      fs.writeFileSync(pathMask, Buffer.from(mask));

      const avatar = await circle(pathAva);

      if (!fs.existsSync(fontPath)) {
        const fontData = (await axios.get(
          `https://drive.google.com/u/0/uc?id=1DuI-ou9OGEkII7n8odx-A7NIcYz0Xk9o&export=download`,
          { responseType: "arraybuffer" })).data;
        fs.writeFileSync(fontPath, Buffer.from(fontData));
      }

      const baseImage = await loadImage(pathImg);
      const baseAva = await loadImage(avatar);
      const baseMask = await loadImage(pathMask);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      registerFont(fontPath, { family: "UTMAvoBold" });

      ctx.strokeStyle = "rgba(255,255,255, 0.2)";
      ctx.lineWidth = 3;
      ctx.font = "100px UTMAvoBold";
      ctx.strokeText(name.toUpperCase(), 30, 100);
      ctx.strokeText(name.toUpperCase(), 130, 200);
      ctx.textAlign = "right";
      ctx.strokeText(name.toUpperCase(), canvas.width - 30, canvas.height - 30);
      ctx.strokeText(name.toUpperCase(), canvas.width - 130, canvas.height - 130);

      ctx.fillStyle = "#ffffff";
      ctx.font = "55px UTMAvoBold";
      ctx.fillText(name.toUpperCase(), 680, 270);

      ctx.font = "40px UTMAvoBold";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "right";
      ctx.fillText(subname.toUpperCase(), 680, 320);

      ctx.font = "23px UTMAvoBold";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "start";
      ctx.fillText(phone.toUpperCase(), 1350, 252);
      ctx.fillText(email.toUpperCase(), 1350, 332);
      ctx.fillText(address.toUpperCase(), 1350, 410);

      ctx.globalCompositeOperation = "destination-out";
      ctx.drawImage(baseMask, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(baseAva, 824, 180, 285, 285);

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(pathImg, buffer);

      return send("✅ Your Facebook cover is ready", fs.createReadStream(pathImg));
    } catch (err) {
      console.error("FBcover error:", err);
      return send("❌ Failed to generate image");
    }
  }
};