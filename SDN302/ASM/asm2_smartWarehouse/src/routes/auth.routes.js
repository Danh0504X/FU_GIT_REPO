import express from "express";

import {
    register,
    login
} from "../controllers/auth.controller.js";
import {
    authenticate
} from "../middleware/auth.middleware.js";


const router = express.Router();

router.post(
    "/register",
    authenticate,
    register
);

router.post(
    "/login",
    login
);


export default router;