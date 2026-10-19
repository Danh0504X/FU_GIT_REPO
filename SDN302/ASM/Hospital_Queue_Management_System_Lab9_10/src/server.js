import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import ApiRouter from "./routes/api.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
    res.json({
        message: "Hospital Queue Management API is running"
    });
});

// Đề yêu cầu đường dẫn /auth/..., /queue/... nên mount ở gốc (không có /api)
app.use("/", ApiRouter);

// Route không tồn tại
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
