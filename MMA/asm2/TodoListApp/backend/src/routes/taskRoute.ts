import express from "express";
import {
    createTask,
    deleteTask,
    getTask,
    getTasks,
    toggleTask,
    updateTask,
} from "../controller/task.controller";
import { protectedRoute } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(protectedRoute);
router.get("/", getTasks);
router.post("/", createTask);
router.get("/:id", getTask);
router.patch("/:id", updateTask);
router.patch("/:id/toggle", toggleTask);
router.delete("/:id", deleteTask);

export default router;
