import express from "express";
import AuthRoutes from "./AuthRoute.js";
import QueueRoutes from "./QueueRoute.js";
import DepartmentRoutes from "./DepartmentRoute.js";

const router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/queue", QueueRoutes);
router.use("/departments", DepartmentRoutes);

export default router;
