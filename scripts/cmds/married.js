const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
  name: "married",
  version: "3.1.1",
  role: 0,
  author: "SK-SIDDIK-KHAN",
  category: "img",
  cooldowns: 5,
};

module.exports.onLoad = async () => {
  const dirMaterial = path.join(__dirname, "cache", "canvas");
  const filePath = path.join(dirMaterial, "married.png");
  const downloadFile = global.utils?.downloadFile;

  if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
  if (!fs.existsSync(filePath) && downloadFile) {
    await downloadFile("https://i.ibb.co/PjWvsBr/13bb9bb05e53ee24893940892b411ad2.png", filePath);
  }
};

async function circle(image) {
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
  const __root = path.resolve(__dirname, "cache", "canvas");

  let married_img = await jimp.read(path.join(__root, "married.png"));
  let pathImg = path.join(__root, `married_${one}_${two}.png`);
  let avatarOnePath = path.join(__root, `avt_${one}.png`);
  let avatarTwoPath = path.join(__root, `avt_${two}.png`);

  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarOnePath, Buffer.from(getAvatarOne, 'utf-8'));

  let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarTwoPath, Buffer.from(getAvatarTwo, 'utf-8'));

  let circleOne = await jimp.read(await circle(avatarOnePath));
  let circleTwo = await jimp.read(await circle(avatarTwoPath));
  married_img
    .composite(circleOne.resize(90, 90), 210, 70)
    .composite(circleTwo.resize(90, 90), 120, 90);

  let raw = await married_img.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, raw);

  fs.unlinkSync(avatarOnePath);
  fs.unlinkSync(avatarTwoPath);

  return pathImg;
}

module.exports.onStart = async function ({ event, api, args }) {
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions);

  if (!mention[0]) {
    return api.sendMessage("Please mention 1 person...", threadID, messageID);
  } else {
    const one = senderID;
    const two = mention[0];

    try {
      const imagePath = await makeImage({ one, two });
      api.sendMessage({
        body: "●❯────────────────❮●\n-🦋🌻•\n\n•— সুন্দরি না হক বিশ্বাসি হক জিবন সঙ্গি__❤️‍🩹🫶🏻🥺\n\n-\n●❯────────────────❮●",
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => fs.unlinkSync(imagePath), messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Failed to generate image", threadID, messageID);
    }
  }
};