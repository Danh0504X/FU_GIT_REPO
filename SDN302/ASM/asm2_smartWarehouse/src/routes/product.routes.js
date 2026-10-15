import express from "express";

import {
    createProduct,
    getProducts
} from "../controllers/product.controller.js";


import {
    authenticate
} from "../middleware/auth.middleware.js";


import {
    requireRole
} from "../middleware/role.middleware.js";



const router = express.Router();


router.post(
    "/",
    authenticate,
    requireRole("warehouse_manager"),
    createProduct
);


router.get(
    "/",
    authenticate,
    getProducts
);


export default router;