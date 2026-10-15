import express from "express";
import {getSession, Checkin, checkout } from "../controller/Session.controller.js"

const router = express.Router();

router.post("/checkin", Checkin);

router.get("/", getSession); 

router.put("/:id/checkout", checkout);


export default router;