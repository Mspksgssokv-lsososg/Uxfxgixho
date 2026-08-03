const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
 
const API_BASE_URL = "https://noobs-api-sable.vercel.app/";
 
async function alldown(url) {
	try {
		const response = await axios.get(`${API_BASE_URL}alldown`, { params: { url } });
		return response.data;
	} catch (e) {
		console.error("[autodl] Alldown API error:", e);
		return { status: false, msg: "Alldown API error" };
	}
}
 
module.exports = {
	config: {
		name: "autodl",
		version: "2.1.3",
		author: "SK-SIDDIK",
		countDown: 2,
		role: 0,
		shortDescription: "Auto detect any link and download directly",
		category: "utility",
		guide: ""
	},
 
	onStart: async function () {},
 
	onChat: async function ({ api, event }) {
		let filePath = null;
		try {
			const body = event.body ? event.body.trim() : "";
			if (!body) return;
 
			const linkMatch = body.match(
				/(https?:\/\/(?:[a-zA-Z0-9_-]+\.)*(?:youtube\.com|youtu\.be|tiktok\.com|instagram\.com|facebook\.com|fb\.watch)[^\s]*)/i
			);
			if (!linkMatch) return;
 
			const content = linkMatch[1];
			console.log("[autodl] link detected:", content);
 
			let site = "Unknown";
			if (content.includes("youtube.com") || content.includes("youtu.be")) site = "YouTube";
			else if (content.includes("tiktok.com")) site = "TikTok";
			else if (content.includes("instagram.com")) site = "Instagram";
			else if (content.includes("facebook.com") || content.includes("fb.watch")) site = "Facebook";
 
			api.setMessageReaction("⏳", event.messageID, () => {}, true);
 
			const data = await alldown(content);
			if (!data || data.status === false || !data.url) {
				api.setMessageReaction("❌", event.messageID, () => {}, true);
			}
 
			const title = data.t || data.title || "video";
			const dlUrl = data.url;
 
			const bufferResponse = await axios.get(dlUrl, { responseType: "arraybuffer" });
			const buffer = bufferResponse.data;
			const safeTitle = title.replace(/[^\w\s]/gi, "_");
 
			const cacheDir = path.join(__dirname, "cache");
			fs.ensureDirSync(cacheDir);
			filePath = path.join(cacheDir, `${safeTitle}_${Date.now()}.mp4`);
			fs.writeFileSync(filePath, buffer);
 
			api.sendMessage(
				{
					body: `🎀 Download Complete!\n📍 Platform: ${site}\n🎬 Title: ${title}`,
					attachment: fs.createReadStream(filePath)
				},
				event.threadID,
				(err) => {
					try {
						if (filePath && fs.existsSync(filePath)) {
							fs.unlinkSync(filePath);
						}
					} catch (cleanupErr) {
						console.error("[autodl] Cleanup error in callback:", cleanupErr);
					}
					
					api.setMessageReaction("✅", event.messageID, () => {}, true);
				}
			);
 
		} catch (e) {
			console.log("[autodl] direct download error:", e);
			try {
				if (filePath && fs.existsSync(filePath)) {
					fs.unlinkSync(filePath);
				}
			} catch (cleanupErr) {
				console.error("[autodl] Cleanup error in catch:", cleanupErr);
			}
			
			api.setMessageReaction("❌", event.messageID, () => {}, true);
		}
	}
};
