import express from 'express';
import UserProtectRoute from '../Middlewares/User.middleware.js';
import { chat, getChats } from '../Controllers/User.controller.js';

const router = express.Router();

// Auth routes go here
router.post("/chat", UserProtectRoute, chat);
router.get("/getchats", UserProtectRoute, getChats);

export default router;
