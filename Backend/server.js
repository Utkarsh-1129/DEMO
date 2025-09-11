import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { ConnectDB } from "./Database/ConnectDB.js";
import AuthRoutes from "./Routes/Auth.route.js";
import UserRoutes from "./Routes/User.route.js";
import AgriRoutes from "./Routes/Agri.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MongoDB_URI;

// 🚀 Health Check Endpoint
app.get("/", (req, res) => {
	res.status(200).send("✅ Health Check: OK");
});

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
);

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/agri", AgriRoutes);

// Connect to MongoDB and start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	ConnectDB(mongoURI);
});
