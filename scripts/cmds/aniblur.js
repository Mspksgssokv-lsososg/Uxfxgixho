const fs = require('fs');
const path = require('path');
const https = require('https');

module.exports = {
  config: {
    name: "aniblur",
    version: "1.0",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 0,
    category: "user",
  },

  onStart: async function ({ api, event, message }) {
    const senderID = event.senderID;

    const loadingMessage = await message.reply({
      body: "Loading Aniblur Pic... Please wait ⏰",
    });

    const links = [
      "https://i.postimg.cc/QdzSzcM1/image.jpg",
"https://i.postimg.cc/QCSJJTPB/ros.jpg",
"https://i.postimg.cc/3xkF2WZR/Cybergot-Cute-anime-pics-Dark-anime-Anime-monochrome.jpg",
"https://i.postimg.cc/63XVscx2/Icon.jpg",
"https://i.postimg.cc/D0YbzdHc/11.jpg",
"https://i.postimg.cc/nLt9MLRN/12.jpg",
"https://i.postimg.cc/2601H7kf/zod-ac.jpg",
"https://i.postimg.cc/g0drmTrW/13.jpg",
"https://i.postimg.cc/CKN51sff/Pin-on-icons.jpg",
"https://i.postimg.cc/pr9LsNcD/14.jpg",
"https://i.postimg.cc/VLCNM8Cw/anime-avatar.jpg",
"https://i.postimg.cc/Z5my5RD2/15.jpg",
"https://i.postimg.cc/XqFpVSKn/https-youtube-com-channel-UC3l3cgr-BNj-W5n7de68os-Fnw.jpg",
"https://i.postimg.cc/dQd1ZFdY/Draincore-Icon-Aesthetic.jpg",
"https://i.postimg.cc/zXFGpk02/B-L-A-C-K-P-I-N-K-balasultan-krulus-anime-gothic-edits-dp-profile-insta.jpg",
"https://i.postimg.cc/MGvZ6Jxg/16.jpg",
"https://i.postimg.cc/76zxz15V/Bbbb.jpg",
"https://i.postimg.cc/Wp6VP1gh/image.jpg",
"https://i.postimg.cc/pTfwxs9g/17.jpg",
"https://i.postimg.cc/ZnjXv0xH/18.jpg",
"https://i.postimg.cc/vZ4CDYg7/image.jpg",
"https://i.postimg.cc/PfK74p1z/19.jpg",
"https://i.postimg.cc/mrQXFtb9/Icon.jpg",
"https://i.postimg.cc/9MbLJKwF/20.jpg",
"https://i.postimg.cc/v8PP9Rd0/distorted.jpg",
    ];

    const imgURL = links[Math.floor(Math.random() * links.length)];
    const fileName = path.basename(imgURL); 
    const downloadDir = path.join(__dirname, "cache", "anidp");
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const filePath = path.join(downloadDir, fileName);

    try {
      if (!fs.existsSync(filePath)) {
        await downloadFile(filePath, imgURL);
      }

      await message.reply({
        body: '🔰𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐀𝐧𝐢𝐛𝐥𝐮𝐫 𝐏𝐢𝐜🔰',
        attachment: fs.createReadStream(filePath),
      });
    } catch (error) {
      console.error("Image fetch failed:", error.message);
      await message.reply("Image load failed (rate limited or error). Please try again later.");
    }

    setTimeout(() => {
      api.unsendMessage(loadingMessage.messageID);
    }, 800);
  },
};

async function downloadFile(filePath, url) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", (err) => {
      fs.unlink(filePath, () => {}); 
      reject(err);
    });
  });
}