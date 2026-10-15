import express from "express";
import OrderRoutes from "./OrderRoute.js";

const router = express.Router();

router.use("/orders", OrderRoutes);

export default router;