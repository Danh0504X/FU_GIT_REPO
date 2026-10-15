import express from "express";

import bookRoutes from "./book.routes.js";
import authorRoutes from "./author.routes.js";
import categoryRoutes from "./category.routes.js";


const router = express.Router();


router.use("/books", bookRoutes);

router.use("/authors", authorRoutes);

router.use("/categories", categoryRoutes);

export default router;