import bcrypt from "bcryptjs";
import User from "../Schemas/User.model.js";
import { generateUserToken } from "../Utils/GenerateToken.js";

export const register = async (req, res) => {
	try {
		const { name, phone, password, location, confirm_password } = req.body;

		if (!name || !phone || !password || !location || !confirm_password) {
			return res.status(400).send("All fields are required");
		}
		if (password !== confirm_password) {
			return res.status(400).send("Passwords do not match");
		}

		const user = await User.findOne({ phone });
		if (user) {
			return res.status(400).send("User already exists");
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create new user
		const newUser = new User({
			name,
			phone,
			password: hashedPassword,
			location,
			chats: [],
		});

		if (newUser) {
			generateUserToken(newUser._id, res);

			await newUser.save();
			res.status(201).send({
				message: "User registered successfully",
				newUser,
			});
			console.log(`${newUser.name} Registered Successfully`);
			return;
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({ message: "Server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { phone, password } = req.body;

		if (!phone || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const user = await User.findOne({ phone: phone });

		if (!user) {
			return res.status(400).json({ message: "Invalid Credentials" });
		}

		const hashedPassword = user.password;
		const isMatch = await bcrypt.compare(password, hashedPassword);

		if (!isMatch) {
			return res.status(400).json({ message: "Invalid Credentials" });
		}

		generateUserToken(user._id, res);
		console.log("User logged in successfully");
		return res.status(200).json(user);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", {
			httpOnly: true,
			expires: new Date(0),
		});
		return res
			.status(200)
			.json({ message: "User logged out successfully" });
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};

export const getUserProfile = async (req, res) => {
	try {
		const user = req.user;
		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const data = await User.findById(req.user._id).select("-password");
		if (!data) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json(data);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		res.status(500).json({ message: "Server Error" });
	}
};
