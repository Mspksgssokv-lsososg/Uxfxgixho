const axios = require("axios");
const fs = require("fs");

let ignoredUIDs = [];
let adminList = [];
let settings = loadSettings();
let targetUsersBN = [];
let targetUsersEN = [];
let userNames = {};

async function loadIgnoredUIDs() {
  try {
    const response = await axios.get("https://raw.githubusercontent.com/DJ-SIDDIK-15/TAL-GASH/refs/heads/main/skApiUrl.json");
    ignoredUIDs = response.data.ignoredUIDs || [];
    adminList = response.data.adminList || [];
  } catch (error) {
    console.error("Error loading ignored UIDs and admin list:", error);
  }
}

function loadSettings() {
  try {
    const data = fs.readFileSync("vip.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

function saveSettings(newSettings) {
  fs.writeFileSync("vip.json", JSON.stringify(newSettings, null, 2));
}

async function fetchMessages(language) {
  const url = language === "bn"
    ? "https://raw.githubusercontent.com/DJ-SIDDIK-15/TAL-GASH/refs/heads/main/sk-bn.json"
    : "https://raw.githubusercontent.com/DJ-SIDDIK-15/TAL-GASH/refs/heads/main/sk-en.json";
  try {
    const response = await axios.get(url);
    return response.data.messages || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

function isAdmin(userID) {
  return userID === "100005002412625" || adminList.includes(userID);
}

module.exports.config = {
  name: "vip",
  version: "1.0.0",
  role: 0,
  author: "SK-SIDDIK-KHAN",
  guide: {
    en: "[vip add bn @user], [vip add en @user], [vip remove bn @user], [vip remove en @user], [vip admin add @user], [vip admin remove @user], [vip on], [vip off], [vip list], [vip admin list]"
  },
  category: "fun",
  coolDowns: 0
};

module.exports.onChat = async function ({ api, event }) {
  const senderID = event.senderID;
  const threadID = event.threadID;

  if (settings[threadID] === "off") return;

  const isInBNList = targetUsersBN.includes(senderID);
  const isInENList = targetUsersEN.includes(senderID);
  let messages = [];

  if (isInBNList) {
    messages = await fetchMessages("bn");
  } else if (isInENList) {
    messages = await fetchMessages("en");
  }

  if (messages.length > 0) {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const sender = await api.getUserInfo(event.senderID);
    const username = sender[event.senderID]?.name || 'User';

    await api.sendMessage({
      body: `🎉 Hi ${username} ${randomMessage} 🎉`,
      mentions: [{ tag: username, id: event.senderID }]
    }, event.threadID, event.messageID);
  }
};

module.exports.onStart = async function ({ api, args, event, message }) {
  const senderID = event.senderID;
  const threadID = event.threadID;
  const command = args[0] ? args[0].toLowerCase() : null;

  if (!isAdmin(senderID)) {
    return message.reply("❌ You don't have permission to use this command ❌");
  }

  switch (command) {
    case "off":
      settings[threadID] = "off";
      saveSettings(settings);
      return message.reply("🎈 The VIP command has been disabled for this thread. Come back soon! 🎈");

    case "on":
      delete settings[threadID];
      saveSettings(settings);
      return message.reply("🎉 VIP command has been enabled! Let the fun begin! 🎉");

    case "add":
      handleAddCommand(args, event, message);
      break;

    case "remove":
      handleRemoveCommand(args, event, message);
      break;

    case "list":
      await handleListCommand(api, message);
      break;

    case "admin":
      await handleAdminCommand(args, event, message);
      break;

    default:
      message.reply("Invalid command ❌");
  }
};

async function handleAddCommand(args, event, message) {
  const language = args[1];
  const userID = Object.keys(event.mentions)[0];

  if (!["bn", "en"].includes(language)) {
    return message.reply("Please use a valid language: 'bn' or 'en' ✅");
  }

  if (!userID) {
    return message.reply("Please provide a username to add 📝");
  }

  if (ignoredUIDs.includes(userID)) {
    return message.reply("This user is in the ignored list ❌");
  }

  const targetList = language === "bn" ? targetUsersBN : targetUsersEN;
  if (targetList.includes(userID)) {
    return message.reply(`This user is already in the ${language.toUpperCase()} list 😘`);
  }

  targetList.push(userID);
  userNames[userID] = event.mentions[userID];

  message.reply(`✨ Successfully added ${userNames[userID]} to the ${language.toUpperCase()} list ✨`);
}

function handleRemoveCommand(args, event, message) {
  const language = args[1];
  const userID = Object.keys(event.mentions)[0];

  if (!["bn", "en"].includes(language)) {
    return message.reply("Please use a valid language: 'bn' or 'en' ✅");
  }

  if (!userID) {
    return message.reply("You must mention a user to remove ✅");
  }

  const targetList = language === "bn" ? targetUsersBN : targetUsersEN;
  if (!targetList.includes(userID)) {
    return message.reply(`This user is not in the ${language.toUpperCase()} list.`);
  }

  const index = targetList.indexOf(userID);
  if (index !== -1) targetList.splice(index, 1);
  delete userNames[userID];

  message.reply(`🚫 Successfully removed ${userNames[userID]} from the ${language.toUpperCase()} list 🚫`);
}

async function handleListCommand(api, message) {
  let response = "🌟 **Bangla List** 🌟\n";
  if (targetUsersBN.length > 0) {
    response += targetUsersBN.map(id => `${userNames[id] || "Unknown"} (UID: ${id})`).join("\n");
  } else {
    response += "No users in the Bangla list. 😢\n";
  }

  response += "\n🌟 **English List** 🌟\n";
  if (targetUsersEN.length > 0) {
    response += targetUsersEN.map(id => `${userNames[id] || "Unknown"} (UID: ${id})`).join("\n");
  } else {
    response += "No users in the English list 😢";
  }

  message.reply(response);
}

async function handleAdminCommand(args, event, message) {
  const action = args[1];
  const userID = Object.keys(event.mentions)[0];

  if (!["add", "remove", "list"].includes(action)) return;

  if (action === "add") {
    if (!userID) return message.reply("You must mention a user to add as an admin 📝");
    if (adminList.includes(userID)) return message.reply("This user is already an admin ✅");

    adminList.push(userID);
    message.reply(`✨ ${userNames[userID]} has been added as an admin! 🎉`);
  }

  if (action === "remove") {
    if (!userID) return message.reply("You must mention a user to remove from admin 📝");
    if (!adminList.includes(userID)) return message.reply("This user is not an admin ❌");

    const index = adminList.indexOf(userID);
    if (index !== -1) adminList.splice(index, 1);
    message.reply(`🚫 ${userNames[userID]} has been removed from the admin list 🚫`);
  }

  if (action === "list") {
    if (adminList.length === 0) return message.reply("No admins in the list 😢");
    const response = "🌟 **Admin List** 🌟\n" + adminList.map(id => `${userNames[id] || "Unknown"} (UID: ${id})`).join("\n");
    message.reply(response);
  }
}

loadIgnoredUIDs();
