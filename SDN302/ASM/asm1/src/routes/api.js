import express from "express";

import SessionRoutes from "./ParkingSessionRoute.js";

const router = express.Router();

router.use("/sessions", SessionRoutes);

export default router;