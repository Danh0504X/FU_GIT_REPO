import express from "express";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes/api";

const app = express();

app.disable("x-powered-by");
// Chỉ cho phép frontend đã cấu hình gửi kèm cookie xác thực
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok", message: "API is healthy" });
});

app.use("/api", (request, response, next) => {
    response.set("Cache-Control", "no-store");
    next();
});

app.use("/api", apiRoutes);

export default app;
