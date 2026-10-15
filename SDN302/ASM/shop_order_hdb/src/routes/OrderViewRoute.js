import express from "express";
import {
    renderOrders,
    renderCreateOrder,
    handleCreateOrder,
    renderUpdateOrder,
    handleUpdateOrder,
    handleDeleteOrder
} from "../controller/OrderView.controller.js";

const router = express.Router();

router.get("/", renderOrders);

router.get("/create", renderCreateOrder);

router.post("/create", handleCreateOrder);

router.get("/update/:id", renderUpdateOrder);

router.post("/update/:id", handleUpdateOrder);

router.post("/delete/:id", handleDeleteOrder);

export default router;