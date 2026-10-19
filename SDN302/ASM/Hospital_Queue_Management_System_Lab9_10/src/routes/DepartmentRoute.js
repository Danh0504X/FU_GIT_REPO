import express from "express";

import { getDepartments } from "../controllers/Department.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getDepartments);

export default router;
