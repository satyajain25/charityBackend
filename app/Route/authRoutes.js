import express from "express";
import { registerUser, loginUser,sendOtp,verifyOtp } from "../controllers/index.js";
import { validateUser } from '../middlewares/validateUser.js'; 

const router = express.Router();

router.post("/register", validateUser, registerUser);


router.post("/login",loginUser);

router.post("/sendOtp", sendOtp);     
router.post("/verifyOtp", verifyOtp);

export default router;

