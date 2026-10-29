import { Router } from "express";
import authRoute from "./authRoute";
import taskRoute from "./taskRoute";

const router = Router();

router.get("/", (_request, response) => {
    response.json({ message: "Welcome to the API" });
});

router.use("/auth", authRoute);
router.use("/tasks", taskRoute);

export default router;
