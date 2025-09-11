import Agri from "../Schemas/Agri.model.js";
import bcrypt from "bcryptjs";
import { generateAgriToken } from "../Utils/GenerateToken.js";

export const agrisignup = async (req, res) => {
	try {
		const {
			name,
			phone,
			password,
			location,
			email,
			licenseNumber,
			aadhar,
			confirm_password,
		} = req.body;

		if (
			!name ||
			!phone ||
			!password ||
			!location ||
			!email ||
			!licenseNumber ||
			!aadhar
		) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if user already exists
		const existingAgri = await Agri.findOne({
			$or: [
				{ email: email },
				{ phone: phone },
				{ aadhar: aadhar },
				{ licenseNumber: licenseNumber },
			],
		});
		if (existingAgri) {
			return res.status(400).json({ message: "User already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create new user
		const newAgri = new Agri({
			name,
			phone,
			password: hashedPassword,
			location,
			email,
			licenseNumber,
			aadhar,
			tasks: [],
		});

		if (newAgri) {
			await newAgri.save();
			generateAgriToken(newAgri._id, res);
			res.status(201).json({
				message: "User registered successfully",
				newAgri,
			});
			console.log(`${newAgri.name} Registered Successfully`);
			return;
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const agrilogin = async (req, res) => {
	try {
		const { licenseNumber, password } = req.body;
		if (!licenseNumber || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const agri = await Agri.findOne({ licenseNumber: licenseNumber });
		if (!agri) {
			return res.status(400).json({ message: "Invalid Credentials" });
		}

		const hashedPassword = agri.password;
		const isMatch = await bcrypt.compare(password, hashedPassword);

		if (!isMatch) {
			return res.status(400).json({ message: "Invalid Credentials" });
		}

		generateAgriToken(agri._id, res);
		return res.status(200).json({ message: "Login successful", agri });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const agrilogout = (req, res) => {
	res.cookie("agriToken", "", {
		httpOnly: true,
		expires: new Date(0),
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});
	return res.status(200).json({ message: "Logged out successfully" });
};

export const agriprofile = async (req, res) => {
	try {
		const agri = req.agri;
		const data = await Agri.findById(agri._id);
		if (!data) {
			return res.status(404).json({ message: "User not found" });
		}
		return res.status(200).json({ agri: data });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};
