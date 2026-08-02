module.exports = {
    config: {
        name: "owner",
        aliases: ["admin", "addmin"],
        version: "1.2",
        author: "SK-SIDDIK-KHAN",
        countDown: 2,
        role: 0,
        shortDescription: {
            en: "Addmin & Owners Information"
        },
        longDescription: {
            en: "get information."
        },
        category: "user",
        guide: {
            en: "{pn}"
        }
    },
 
  onStart: async function () {},
 
  onStart: async function ({ event, message, getLang, usersData, threadsData }) {
 
      const data = await usersData.get(event.senderID);
 
      const name = data.name;
 
      const thread = await threadsData.get(event.threadID);
 
      const threadName = thread.threadName;
 
      const currentDate = new Date();
 
      const options = { year: "numeric", month: "numeric", day: "numeric" };
 
      const date = currentDate.toLocaleDateString("en-US", options);
 
      const time = currentDate.toLocaleTimeString("en-US", {
        timeZone: "Asia/Dhaka",
        hour12: true,
      });
 
      const img = `https://graph.facebook.com/100005002412625/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
 
      const msg = `╭─────────────|
╰‣ 𝗔𝗗𝗠𝗜𝗡 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗧𝗢𝗡
╭─────────────|
╰‣ 𝗕𝗢𝗧 𝗔𝗗𝗠𝗜𝗡 : 𝗦𝗞-𝗦𝗜𝗗𝗗𝗜𝗞
╭─────────────|
╰‣ 𝗔𝗗𝗗𝗥𝗘𝗦𝗦: 𝗡𝗔𝗢𝗚𝗔𝗢𝗡
╭─────────────|
╰‣ 𝗖𝗢𝗡𝗧𝗔𝗖𝗧
╭─────────────|
╰‣ 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞: https://www.facebook.com/SK.SIDDIK.HERE
╭─────────────|
╰‣ 𝗧𝗔𝙇𝗘𝗚𝗥𝗔𝗠 𝗟𝗜𝗡𝗞:t.me/busy1here
╭─────────────|
╰‣ 𝗕𝗢𝗧 𝗪𝗢𝗡𝗘𝗥: 𝗦𝗜𝗗𝗗𝗜𝗞`;
 
      message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(img)
      });
    }
  };
