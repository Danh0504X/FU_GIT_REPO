import express from "express";

import {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
} from "../controller/Order.controller.js";

const router = express.Router();

router.get("/", getOrders);

router.post("/", createOrder);

router.get("/:id", getOrderById);

router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

export default router;