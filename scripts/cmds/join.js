const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "join",
    version: "2.2",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 2,
    category: "owner",
  },

  onStart: async function ({ api, event }) {
    try {
      const threadList = await api.getThreadList(20, null, ["INBOX"]);

      const groupList = threadList
        .filter(thread =>
          thread.isGroup &&
          thread.threadID &&
          Array.isArray(thread.participantIDs)
        )
        .map(thread => ({
          threadName: thread.name || thread.threadName || "⛔ Unknown Group",
          threadID: thread.threadID,
          participantIDs: thread.participantIDs
        }));

      if (groupList.length === 0) {
        return api.sendMessage("⚠️ No groups found", event.threadID);
      }

      const formatted = groupList.map((g, i) =>
        `│ ${i + 1}. ${g.threadName}\n│ 🆔 ID: ${g.threadID}\n│ 👥 Members: ${g.participantIDs.length}`
      ).join("\n│\n");

      const msg =
        `♡   ∩_∩\n` +
        ` （„• ֊ •„)♡\n` +
        `╭─∪∪────────────⟡\n` +
        `│ 𝗕𝗢𝗧 𝗚𝗥𝗢𝗨𝗣 𝗟𝗜𝗦𝗧\n` +
        `├───────────────⟡\n` +
        `${formatted}\n` +
        `╰───────────────⟡\n` +
        `📌 Max 250 members\n🔁 Reply with group number to join`;

      const sent = await api.sendMessage(msg, event.threadID);
      global.GoatBot.onReply.set(sent.messageID, {
        commandName: "join",
        author: event.senderID,
        messageID: sent.messageID,
        groupList
      });

    } catch (err) {
      console.error("Error fetching group list:", err);
      api.sendMessage("❌ Couldn't load group list.", event.threadID);
    }
  },

  onReply: async function ({ api, event, args, Reply }) {
    const { author, groupList } = Reply;
    if (event.senderID !== author) return;

    const index = parseInt(args[0]);
    if (isNaN(index) || index < 1 || index > groupList.length) {
      return api.sendMessage("❌ Invalid number", event.threadID, event.messageID);
    }

    const selected = groupList[index - 1];

    try {
      const info = await api.getThreadInfo(selected.threadID);

      if (info.participantIDs.includes(event.senderID)) {
        return api.sendMessage(`⚠️ You're already in "${selected.threadName}"`, event.threadID, event.messageID);
      }

      if (info.participantIDs.length >= 250) {
        return api.sendMessage(`🚫 Group "${selected.threadName}" is full`, event.threadID, event.messageID);
      }

      await api.addUserToGroup(event.senderID, selected.threadID);
      return api.sendMessage(
        `✅ Joined "${selected.threadName}" Successfully`,
        event.threadID,
        event.messageID
      );

    } catch (err) {
      console.error("Add error:", err);
      return api.sendMessage(
        "❌ Failed to add. Check privacy or send bot a friend request",
        event.threadID,
        event.messageID
      );
    } finally {
      global.GoatBot.onReply.delete(event.messageID);
    }
  }
};