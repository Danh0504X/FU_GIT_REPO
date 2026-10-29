import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async (): Promise<void> => {
    if (!env.MONGODB_CONNECTION_STRING) {
        throw new Error("MONGODB_CONNECTION_STRING is not set in .env");
    }

    try {
        await mongoose.connect(env.MONGODB_CONNECTION_STRING);
        console.info("Connected to MongoDB successfully.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};
