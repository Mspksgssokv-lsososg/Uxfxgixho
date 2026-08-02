module.exports.config = {
  name: "age",
  version: "6.9.6",
  author: "SK-SIDDIK-KHAN",
  countDown: 5,
  role: 0,
  category: "calculator",
  description: {
    en: "Mention your friend and provide their birthday in MM/DD/YYYY format to calculate age.",
  },
  guide: {
    en: "Use the command followed by your birthday in MM/DD/YYYY format.",
  },
};

module.exports.onStart = async function ({ message, args, usersData, event }) {
  const birthday = args[0];
  const userID = args[1] || event.senderID;
  const userData = await usersData.get(userID);
  const userName = userData.name;

  if (!birthday) {
    return message.reply("Please provide your birthday in MM/DD/YYYY format.");
  }

  const today = new Date();
  const birthDate = new Date(birthday);

  if (isNaN(birthDate)) {
    return message.reply("Invalid date format! Please use MM/DD/YYYY.");
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  let monthDiff = today.getMonth() - birthDate.getMonth();
  let dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
    monthDiff += (monthDiff < 0) ? 12 : 0;
    if (dayDiff < 0) {
      const lastMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      dayDiff += lastMonthDays;
    }
  }

  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (today > nextBirthday) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const timeDiff = nextBirthday - today;
  const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const monthsLeft = Math.floor(daysLeft / 30);
  const remainingDays = daysLeft % 30;
  const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  const weekDays = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
  const todayDay = weekDays[today.getDay()];

  const profilePicURL = `https://graph.facebook.com/${userID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

  message.reply(
    {
      body: `☽━━━━━━━━━━━━━━━━━━☾\n` +
        `● ${userName} ●\n\n` +
        `● আপনার বর্তমান বয়স ও জন্মদিনের সময়সূচী ●\n☽━━━━━━━━━━━━━━━━━━☾\n\n` +
        `● ${userName} ● \nআজ ${todayDay} ●\n\n` +
        `● আপনার বয়স: ${age} বছর, ${monthDiff} মাস, ${dayDiff} দিন ●\n\n` +
        `● আপনার জন্মদিন আসতে বাকি: ${monthsLeft} মাস, ${remainingDays} দিন ●\n\n` +
        `● মোট: ${daysLeft} দিন, ${hoursLeft} ঘন্টা, ${minutesLeft} মিনিট বাকি ●\n\n` +
        `☽━━━━━━━━━━━━━━━━━━☾`,
      attachment: await global.utils.getStreamFromURL(profilePicURL),
    },
    event.threadID,
    event.messageID
  );
};
