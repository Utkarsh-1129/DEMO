import express from 'express';
import { getUserProfile, login, logout, register } from '../Controllers/UserAuth.controller.js';
import UserProtectRoute from '../Middlewares/User.middleware.js';
import { agrisignup, agrilogin, agrilogout, agriprofile } from '../Controllers/AgriAuth.controller.js';
import AgriProtectRoute from '../Middlewares/Agri.middleware.js';

const router = express.Router();

// Auth routes go here
router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/logout", logout);
router.get("/user/profile", UserProtectRoute ,getUserProfile);

router.post("/agri/register", agrisignup);
router.post("/agri/login", agrilogin);
router.post("/agri/logout", agrilogout);
router.get("/agri/profile", AgriProtectRoute, agriprofile);

export default router;
