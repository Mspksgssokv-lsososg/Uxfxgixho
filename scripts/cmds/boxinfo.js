const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "boxinfo",
    aliases: ["groupinfo"],
    version: "3.0.0",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 0,
    shortDescription: "Show detailed info about group",
    category: "box chat",
    guide: {
      en: "{p}boxinfo",
    },
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;
    const threadInfo = await api.getThreadInfo(threadID);
    const members = threadInfo.userInfo;

    let male = 0, female = 0, unknown = 0;
    for (const user of members) {
      if (user.gender === "MALE") male++;
      else if (user.gender === "FEMALE") female++;
      else unknown++;
    }

    const adminList = threadInfo.adminIDs;
    let listad = "";
    for (const admin of adminList) {
      const info = await api.getUserInfo(admin.id);
      listad += `│ 👑 ${info[admin.id].name}\n`;
    }

    const sex = threadInfo.approvalMode;
    const pd = sex === false ? 'Turn off' : sex === true ? 'Turn on' : 'Unknown';
    const pdd = sex === false ? '❎' : sex === true ? '✅' : '⭕';

    const threadName = threadInfo.threadName || "Unnamed Group";
    const icon = threadInfo.emoji || "❔";
    const sl = threadInfo.messageCount || "N/A";
    const threadMem = members.length;
    const nam = male;
    const nu = female;
    const qtv = adminList.length;

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);
    const imagePath = path.join(cacheDir, "1.png");
    const imageUrl = threadInfo.imageSrc || "https://i.imgur.com/U7xN0xl.png";

    const callback = () =>
      api.sendMessage(
        {
          body:
`♡   ∩_∩
 （„• ֊ •„)♡
╭─∪∪────────────⟡
│ 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢
├───────────────⟡
│ 📛 Name: ${threadName}
│ 🆔 ID: ${threadID}
│ ${pdd} Approve Mode: ${pd}
│ 😊 Emoji: ${icon}
│ 💬 Total Messages: ${sl}
│ 👥 Members: ${threadMem}
├───────────────⟡
│ ♂️ Male: ${nam}
│ ♀️ Female: ${nu}
├───────────────⟡
│ 👑 Admins [${qtv}]
${listad}╰───────────────⟡`,
          attachment: fs.createReadStream(imagePath),
        },
        threadID,
        () => fs.unlinkSync(imagePath),
        event.messageID
      );

    return request(encodeURI(imageUrl))
      .pipe(fs.createWriteStream(imagePath))
      .on("close", callback);
  },
};