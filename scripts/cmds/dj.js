module.exports = {
	config: {
		name: "dj",
		version: "1.0.0",
		author: "SK-SIDDIK-KHAN",
		countDown: 5,
		role: 0,
		category: "user",
	},
 
	 onStart: async function ({ api, event, message }) {
    const senderID = event.senderID;
 
    const loadingMessage = await message.reply({
      body: "Loading Dj Audio... Please Wait ⏰",
    });
     
	 var link = [
 
  "https://drive.google.com/uc?id=1C4XLaxrHJwcwT-uEMdzZb4Y-oQ98nS0p",
   
   "https://drive.google.com/uc?id=1B9VwVFRw-d2r__HTyGxfin3r6QFdGN9K",
   
   "https://drive.google.com/uc?id=1B9gArnCkpo1801TjiSAuvlVtAdIQP57k",
   
   "https://drive.google.com/uc?id=1C0iPpXrTWvBOqkKDEEwSo9i7u_9AVyg8",
   
   "https://drive.google.com/uc?id=1BDIcusE7B9jELmr6lvciFP-puWfy3WXs",
   
   "https://drive.google.com/uc?id=1C04Pul6GTyzfOQlRLmDk8eGK9z-q3BmA",
   
   "https://drive.google.com/uc?id=1BNH2gUTtD5zBaTnMDY08pQ4CIGq3Lriw",
   
   "https://drive.google.com/uc?id=1BUYSSL8poh9icrlp3YOTV5IiYrn7iHAW",
   
   "https://drive.google.com/uc?id=1BwqorvYxglPa6vptXlLXpI92g3LZBG9C",
   
   "https://drive.google.com/uc?id=1BbVCsUECiAcZBG95CYuobYpg-wTNtrTL",
   
   "https://drive.google.com/uc?id=1BSnn0ku6C0DYdlFtnErqKDOuAWhdqmBJ",
   
   "https://drive.google.com/uc?id=1BYSqt8wKUkZnULVq_W-5O2jC4O-mfLSA",
 
 ];
     let audio = link[Math.floor(Math.random()*link.length)]

   if (senderID !== null) {
      message.reply({
        body: '[ 🅓🅙-🅜🅤🅢🅘🅒 ]',
        attachment: await global.utils.getStreamFromURL(audio)
      });
 
      setTimeout(() => {
        api.unsendMessage(loadingMessage.messageID);
      }, 800);
    }
  },
};
