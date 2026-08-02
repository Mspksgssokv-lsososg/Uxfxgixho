module.exports = {
  config: {
    name: "spy",
    version: "1.1.0",
    role: 0,
    usePrefix: false,
    author: "SK-SIDDIK-KHAN (fixed by ChatGPT)",
    description: "Get user information and profile photo",
    category: "information",
    countDown: 10
  },

  onStart: async function ({ event, message, usersData, api, args }) {
    try {
      let uid;
      const uid1 = event.senderID;
      const uid2 = Object.keys(event.mentions || {})[0];

      if (args[0]) {
        if (/^\d+$/.test(args[0])) {
          uid = args[0];
        } else {
          const match = args[0].match(/profile\.php\?id=(\d+)/);
          if (match) uid = match[1];
        }
      }

      if (!uid) {
        uid =
          event.type === "message_reply"
            ? event.messageReply.senderID
            : uid2 || uid1;
      }

      api.getUserInfo(uid, async (err, userInfo) => {
        if (err || !userInfo[uid]) {
          return message.reply("❌ Failed to retrieve user information.");
        }

        const user = userInfo[uid];

        const avatarUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

        let genderText;
        switch (user.gender) {
          case 1:
            genderText = "Girl";
            break;
          case 2:
            genderText = "Boy";
            break;
          default:
            genderText = "Private";
        }

        const userData = await usersData.get(uid) || { money: 0, exp: 0 };
        const allUser = await usersData.getAll();

        const rank =
          allUser
            .slice()
            .sort((a, b) => b.exp - a.exp)
            .findIndex(u => u.userID == uid) + 1;

        const moneyRank =
          allUser
            .slice()
            .sort((a, b) => b.money - a.money)
            .findIndex(u => u.userID == uid) + 1;

        const info = `
⊙────[ 𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎 ]────⊙

├‣ 𝙽𝚊𝚖𝚎: ${userInfo[uid].name}

├‣ 𝙶𝚎𝚗𝚍𝚎𝚛: ${genderText}

├‣ 𝚄𝙸𝙳: ${uid}

├‣ 𝚄𝚜𝚎𝚛𝚗𝚊𝚖𝚎: ${userInfo[uid].vanity ? userInfo[uid].vanity : "𝙽𝚘𝚗𝚎"}

├‣ 𝙿𝚛𝚘𝚏𝚒𝚕𝚎 𝚄𝚁𝙻: ${userInfo[uid].profileUrl}

├‣ 𝙱𝚒𝚛𝚝𝚑𝚍𝚊𝚢: ${userInfo[uid].isBirthday !== false ? userInfo[uid].isBirthday : "𝙿𝚛𝚒𝚟𝚊𝚝𝚎"}

├‣ 𝙽𝚒𝚌𝚔𝙽𝚊𝚖𝚎: ${userInfo[uid].alternateName || "𝙽𝚘𝚗𝚎"}

├‣ 𝙼𝚘𝚗𝚎𝚢: $${formatMoney(money)}

├‣ 𝚁𝚊𝚗𝚔: #${rank}/${allUser.length}

├‣ 𝙼𝚘𝚗𝚎𝚢 𝚁𝚊𝚗𝚔: #${moneyRank}/${allUser.length}

╰‣ 𝚃𝙷𝙰𝙽𝙺𝚂 𝙵𝙾𝚁 𝚄𝚂𝙸𝙽𝙶 𝚂𝙺 𝙱𝙾𝚃`;

        message.reply({
          body: info,
          attachment: await global.utils.getStreamFromURL(avatarUrl)
        });
      });
    } catch (e) {
      message.reply("❌ An error occurred.");
      console.error(e);
    }
  }
};

function formatMoney(num = 0) {
  const units = ["", "K", "M", "B", "T", "Q"];
  let unit = 0;
  while (num >= 1000 && unit < units.length - 1) {
    num /= 1000;
    unit++;
  }
  return num.toFixed(1).replace(/\.0$/, "") + units[unit];
}
