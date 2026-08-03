module.exports = {
  config: {
    name: "supportgc",
    aliases: ["supportbox"],
    version: "1.8",
    author: "SK-SIDDIK",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Add user to support group",
    },
    longDescription: {
      en: "This command adds the user to the admin support group, notifies the support group, and sends a copy to the admin inbox.",
    },
    category: "supportgc",
    guide: {
      en: "To use this command, type /supportgc",
    },
  },
 
  onStart: async function ({ api, event }) {
    const supportGroupId = "1660026462150531"; 
    const commandThreadID = event.threadID; 
    const adminUID = "100078820725435"; 
    const userID = event.senderID;
 
    const userInfo = await api.getUserInfo(userID);
    const userName = userInfo[userID].name;
 
    const threadInfo = await api.getThreadInfo(supportGroupId);
    const participantIDs = threadInfo.participantIDs;
 
    if (participantIDs.includes(userID)) {
      api.sendMessage(
        `📌 𝐀ᴅᴍɪɴ Sᴜᴘᴘᴏʀᴛ Gʀᴏᴜᴘ\n\n🤖 Nᴏᴛɪᴄᴇ: ${userName}, you are already a member of the support group.\n📩 Check spam or message requests if not visible.`,
        commandThreadID
      );
    } else {
      api.addUserToGroup(userID, supportGroupId, (err) => {
        if (err) {
          api.sendMessage(
            `📌 𝐀ᴅᴍɪɴ Sᴜᴘᴘᴏʀᴛ Gʀᴏᴜᴘ\n\n⚠️ Eʀʀᴏʀ: Unable to add ${userName} (ID: ${userID}).\n❗ Account might be private or message requests blocked.`,
            commandThreadID
          );
        } else {
          api.sendMessage(
            `✅ ${userName} (ID: ${userID}) has been added to the support group.`,
            commandThreadID
          );
 
          const notificationMessage = `📌 𝐀ᴅᴍɪɴ Sᴜᴘᴘᴏʀᴛ Gʀᴏᴜᴘ\n\n👤 New user added: ${userName} (ID: ${userID})\n✅ Please approve or check the user in the support group.`;
 
          api.sendMessage(notificationMessage, supportGroupId);
 
          api.sendMessage(notificationMessage, adminUID);
        }
      });
    }
  },
};
