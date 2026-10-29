import express from "express";
import { createOrder, getOrders, getOrdersByDate } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/orders", createOrder);

router.get("/orders", getOrders);

router.get("/ordersByDate", getOrdersByDate);


export default router;
