const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "kiss",
    version: "1.0",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 0,
    shortDescription: "Kiss another user with an image",
    longDescription: "Generates a kiss image between you and the person you mention",
    category: "fun",
    guide: "{pn} @mention",
  },

  onStart: async function ({ api, message, event, args, usersData }) {
    const mention = Object.keys(event.mentions);

    if (mention.length === 0) {
      return message.reply("Please mention someone");
    }

    let one, two;

    if (mention.length === 1) {
      one = event.senderID;
      two = mention[0];
    } else {
      one = mention[1];
      two = mention[0];
    }

    try {
      const avatarURL1 = await usersData.getAvatarUrl(one);
      const avatarURL2 = await usersData.getAvatarUrl(two);
      const img = await new DIG.Kiss().getImage(avatarURL1, avatarURL2);

      const pathSave = `${__dirname}/tmp/${one}_${two}_kiss.png`;
      fs.ensureDirSync(`${__dirname}/tmp`);
      fs.writeFileSync(pathSave, Buffer.from(img));

      message.reply({
        body: "🎀😘",
        attachment: fs.createReadStream(pathSave),
      }, () => fs.unlinkSync(pathSave));
    } catch (error) {
      console.error("Error generating kiss image:", error);
      message.reply("Something went wrong while creating the image.");
    }
  }
};