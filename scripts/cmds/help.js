const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "help",
    version: "1.0",
    author: "SK-SIDDIK-KHAN",
    role: 0,
    category: "help",
    shortDescription: "see the available commands",
    guide: {
      en: "{pn} [empty | <page number>]"
    }
  },

  onStart: async function ({ api, message, args, event, threadsData, getLang, getPrefix = () => "!" }) {
    const langCode = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    const page = parseInt(args[0]) || 1;
    const commandsPerPage = 10;

    const commands = await getCommandsFromDir(path.join(__dirname, '..', 'cmds'));
    const commandNames = Object.keys(commands);
    const totalPages = Math.ceil(commandNames.length / commandsPerPage);

    if (page < 1 || page > totalPages) {
      return message.reply(getLang("pageNotFound", page));
    }

    let SIDDIK = `‎╭────────────────⊙
╰➤𝐒𝐊-𝐒𝐈𝐃𝐃𝐈𝐊-𝐁𝐎𝐓-𝐂𝐌𝐃-𝐋𝐈𝐒𝐓`;
    let currentCategory = "";
    let commandIndex = (page - 1) * commandsPerPage;
    let commandNumber = (page - 1) * commandsPerPage + 1;

    for (let i = 0; i < commandsPerPage && commandIndex < commandNames.length; i++) {
      const commandName = commandNames[commandIndex];
      const command = commands[commandName];

      if (command.config.category !== currentCategory) {
        currentCategory = command.config.category;
        SIDDIK += `‎`;
      }

      SIDDIK += `‎\n╭────────────────⊙
╰➤${commandNumber}${commandNumber < 10 ? " " : ""}•──⋅☾ ${command.config.name}`;
      commandIndex++;
      commandNumber++;
    }

    SIDDIK += `\n╭────────────────⊙
╰➤𝐓𝐎𝐓𝐀𝐋 [•${global.GoatBot.commands.size}•] 𝐂𝐌𝐃𝐒\n‎╭────────────────⊙
╰➤𝐎𝐖𝐍𝐄𝐑 : 𝐒𝐊-𝐒𝐈𝐃𝐃𝐈𝐊`;

    const imageUrls = [
      "https://drive.google.com/uc?export=download&id=12j-tPCBUezcLf-jMo3I6joyt790fVpEb",
      "https://drive.google.com/uc?export=download&id=12it_dX_vOCV17SXerbLBZVQnSwNhjMa6",
      "https://drive.google.com/uc?export=download&id=12j-tPCBUezcLf-jMo3I6joyt790fVpEb"
    ];

    const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];

    try {
      const attachment = await global.utils.getStreamFromURL(imageUrl);
      message.reply({
        body: SIDDIK,
        attachment
      });
    } catch (err) {
      console.warn("Image fetch failed:", err.message);
      message.reply({
        body: SIDDIK + `\n\n(Note: Image failed to load)`
      });
    }
  }
};

async function getCommandsFromDir(dir) {
  const commands = {};
  const files = await fs.promises.readdir(dir).catch(() => []);

  for (const file of files) {
    if (file.endsWith('.js') && file !== 'help.js') {
      const filePath = path.join(dir, file);
      try {
        const command = require(filePath);
        if (command?.config?.name) {
          commands[command.config.name] = command;
        }
      } catch (error) {
        console.warn(`Failed to load command ${file}: ${error.message}`);
      }
    }
  }

  return commands;
}