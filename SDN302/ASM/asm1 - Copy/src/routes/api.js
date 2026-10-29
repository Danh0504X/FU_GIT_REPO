import express from "express";

import UserRoutes from "./user.routes.js";
import LaptopRoutes from "./laptop.routes.js";
import OrderRoutes from "./order.routes.js";

const router = express.Router();

router.use("/users", UserRoutes);
router.use("/laptops", LaptopRoutes);
router.use("/", OrderRoutes);

export default router;
