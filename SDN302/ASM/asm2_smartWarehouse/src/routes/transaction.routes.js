import express from "express";

import {
    importStock,
    exportStock,
    transferStock
} from "../controllers/transaction.controller.js";

import {
    authenticate
} from "../middleware/auth.middleware.js";

import {
    requireRole
} from "../middleware/role.middleware.js";


const router = express.Router();


// POST /transactions/import
// stock_keeper, warehouse_manager
router.post(
    "/import",
    authenticate,
    requireRole("stock_keeper", "warehouse_manager"),
    importStock
);

// POST /transactions/export
// stock_keeper, warehouse_manager
router.post(
    "/export",
    authenticate,
    requireRole("stock_keeper", "warehouse_manager"),
    exportStock
);

// POST /transactions/transfer
// Chỉ warehouse_manager
router.post(
    "/transfer",
    authenticate,
    requireRole("warehouse_manager"),
    transferStock
);


export default router;
