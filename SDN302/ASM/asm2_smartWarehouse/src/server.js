import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import apiRouter from "./routes/api.js";
import { errorHandler } from "./utils/http.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

await connectDB();

app.use("/api", apiRouter);
app.get("/", (req, res) => {
    res.json({ message: "API running" });
});
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
app.use(errorHandler);

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
