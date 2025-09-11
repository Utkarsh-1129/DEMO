import Chats from "../Schemas/Chats.model.js";
import { ai } from "../Utils/AIservice.js";

export const chat = async (req, res) => {
	try {
		const user = req.user;
		const { message } = req.body;

		if (!message)
			return res.status(400).json({ message: "Message is required" });

		const newMessage = await Chats.create({
			sender: "user",
			message: message,
		});

		// Ensure user.chats is always an array
		if (!Array.isArray(user.chats)) {
			user.chats = [];
		}

		user.chats.push(newMessage._id);
		await user.save();

		const resp = await ai(message);
		if (!resp) {
			return res.status(400).json({ message: "AI Server Failed" });
		}

		const newRes = await Chats.create({
			sender: "ai",
			message: resp,
		});

		user.chats.push(newRes._id);
		await user.save();

		return res
			.status(200)
			.json({ message: "Message Sent", newMessage, newRes });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getChats = async (req, res) => {
	try {
		const user = req.user;
		if (!user || !Array.isArray(user.chats)) {
			return res.status(404).json({ message: "No chats found" });
		}
		// Fetch all chat documents by their IDs
		const chats = await Promise.all(
			user.chats.map((id) => Chats.findById(id))
		);
		return res.status(200).json({ chats });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};
