// env.ts nạp biến môi trường từ .env, phải import trước các module khác
import { env } from "./config/env";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { StatusCodes } from "http-status-codes";

import { connectDB } from "./config/db";
import { seedAdminAccount } from "./config/seedAdmin";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import apiRoutes from "./routes/api";
import ApiError from "./utils/ApiError";

const app = express();

app.disable("x-powered-by");
app.use(morgan("dev"));
// App native (Android/iOS) không bị CORS chặn; cors() chỉ cần khi chạy app trên Expo Web.
// Không dùng cookie nên không cần credentials.
app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

app.get("/health", (_request, response) => {
    response.status(StatusCodes.OK).json({ status: "ok", message: "API is healthy" });
});

app.use("/api", (_request, response, next) => {
    response.set("Cache-Control", "no-store");
    next();
});

app.use("/api", apiRoutes);

app.use((request, _response, next) => {
    next(new ApiError(StatusCodes.NOT_FOUND, `Route ${request.method} ${request.path} not found`));
});
app.use(errorHandlingMiddleware);

const startServer = async () => {
    await connectDB();
    if (!env.IS_PRODUCTION) {
        await seedAdminAccount();
    }
    const server = app.listen(env.PORT, (error) => {
        if (error) {
            console.error(`Cannot listen on port ${env.PORT}:`, error.message);
            server.close();
            process.exit(1);
        }
        console.info(`Server is running on port ${env.PORT} [${env.NODE_ENV}]`);
    });
};

startServer().catch((error: unknown) => {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
});
