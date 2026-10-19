import express from "express";

import {
    getQueue,
    registerTicket,
    callTicket,
    completeTicket
} from "../controllers/Queue.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Tất cả route queue đều yêu cầu đăng nhập
router.use(authenticate);

router.get("/", getQueue);

router.post("/register", authorize("receptionist"), registerTicket);

router.put("/:id/call", authorize("doctor"), callTicket);

router.put("/:id/complete", authorize("doctor"), completeTicket);

export default router;
