module.exports = {
  config: {
    name: "call",
    aliases: ["report", "calling"],
    version: "9.9",
    author: "SK-SIDDIK-KHAN",
    countDown: 1,
    role: 0,
    description: "Add my owner into this group.",
    category: "Admins",
    usages: "user",
  },

  onStart: async function ({ api, message, event }) {
    const { threadID, messageID } = event;
    const botID = api.getCurrentUserID();
    const send = (msg, mentions = []) => api.sendMessage({ body: msg, mentions }, threadID, messageID);
    const targetUserID = "100005002412625"; 
    const targetUserName = "SK SIDDIK KHAN"; 

    try {
      const { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
      const participants = participantIDs.map(e => parseInt(e));
      const admins = adminIDs.map(e => parseInt(e.id));

      if (participants.includes(parseInt(targetUserID))) {
        return send(`My Boss is already in this group ✅\n\n⚡ Just mention @${targetUserName}.`, [
          { id: targetUserID, tag: targetUserName },
        ]);
      }

      await api.addUserToGroup(parseInt(targetUserID), threadID);

      if (approvalMode === true && !admins.includes(botID)) {
        return send(`My Boss Sk Siddik has been added to the approved list ✅.`, [
          { id: targetUserID, tag: targetUserName },
        ]);
      } else {
        return send(`Successfully added My Boss Sk Siddik to your group ✅.`, [
          { id: targetUserID, tag: targetUserName },
        ]);
      }
    } catch (error) {
      console.error("Error adding user to group:", error);
      return send("Failed to add the user to the group ❎");
    }
  },
};