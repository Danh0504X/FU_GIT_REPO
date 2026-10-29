import express from "express";
import { getLaptops, createLaptop } from "../controllers/laptop.controller.js";

const router = express.Router();

router.get("/", getLaptops);

router.post("/", createLaptop);


export default router;
