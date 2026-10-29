import express from "express";
import { getMe, login, logout, register } from "../controller/auth.controller";
import { protectedRoute } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protectedRoute, getMe);
router.post("/logout", protectedRoute, logout);

export default router;
