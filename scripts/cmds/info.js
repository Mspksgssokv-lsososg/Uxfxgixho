module.exports = {
  config: {
    name: "info",
    aliases: ["in4"],
    version: "2.2",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 0,
    category: "Information",
  },

  onStart: async function ({ api, event }) {
    await sendInfo(api, event);
  },

  onChat: async function ({ api, event }) {
    if (event.body?.toLowerCase() === "info") {
      await sendInfo(api, event);
    }
  }
};

async function sendInfo(api, event) {
  const videoLink = "https://drive.google.com/uc?export=download&id=12WE_-Fg1YzO1AEI5dEPVehyd93FIge-j";

  const msg = `♡   ∩_∩
 （„• ֊ •„)♡
╭─∪∪───────────⟡
├‣ 𝗔𝗗𝗠𝗜𝗡 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗧𝗢𝗡
├──────────────⟡
├‣ 𝗕𝗢𝗧 𝗔𝗗𝗠𝗜𝗡 : 𝗦𝗞-𝗦𝗜𝗗𝗗𝗜𝗞
├──────────────⟡
├‣𝗔𝗗𝗗𝗥𝗘𝗦𝗦: 𝗡𝗔𝗢𝗚𝗔𝗢𝗡
├──────────────⟡
├‣ 𝗙𝗕: 𝗧𝗔𝗡𝙕𝙄𝘿 𝙃𝘼𝙎𝘼𝙉 𝙏𝘼𝙈𝙄𝙈
├──────────────⟡
├‣ 𝗧𝗚 : @busy1here
├──────────────⟡
├‣ 𝗕𝗢𝗧 𝗪𝗢𝗡𝗘𝗥: 𝗦𝗜𝗗𝗗𝗜𝗞 
╰──────────────⟡ `;

  const stream = await global.utils.getStreamFromURL(videoLink);

  api.sendMessage(
    { body: msg, attachment: stream },
    event.threadID,
    event.messageID
  );
}