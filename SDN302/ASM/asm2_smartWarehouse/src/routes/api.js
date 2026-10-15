import express from "express";

import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import transactionRoutes from "./transaction.routes.js";
import reportRoutes from "./report.routes.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/transactions", transactionRoutes);
router.use("/reports", reportRoutes);
export default router;
