module.exports = {
  config: {
    name: "lift",
    author: "SK-SIDDIK-KHAN",
    role: 2,
    category: "admin",
  },

  onStart: async function ({ api, event, args }) {
    const delayMinutes = parseInt(args[0]);

    if (!args[0] || isNaN(delayMinutes)) {
      return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID); 
    }

    api.sendMessage(`╭────────────────⊙\n├─☾ JUST WAIT \n├─☾ ${delayMinutes} MINUTE \n├─☾ SK SIDDIK KHAN\n╰────────────────⊙`, event.threadID); 

    setTimeout(() => {
      api.removeUserFromGroup(api.getCurrentUserID(), event.threadID); 
    }, delayMinutes * 60 * 1000);
  }
}
