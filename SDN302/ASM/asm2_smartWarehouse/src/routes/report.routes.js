import express from "express";

import {
    stockSummary,
    transactionReport
} from "../controllers/report.controller.js";

import {
    authenticate
} from "../middleware/auth.middleware.js";

import {
    requireRole
} from "../middleware/role.middleware.js";


const router = express.Router();


// GET /reports/stock-summary
// warehouse_manager, auditor
router.get(
    "/stock-summary",
    authenticate,
    requireRole("warehouse_manager", "auditor"),
    stockSummary
);

// GET /reports/transactions
// warehouse_manager, auditor
router.get(
    "/transactions",
    authenticate,
    requireRole("warehouse_manager", "auditor"),
    transactionReport
);


export default router;
