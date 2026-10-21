import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import dotenv from "dotenv";

dotenv.config();

const startServer = async () => {
    await connectDB();
    app.listen(process.env.PORT, () => {
        console.info(`Server is running on port ${process.PORT} [${process.env.NODE_ENV}]`);
    });
};

startServer().catch((error: unknown) => {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
});
