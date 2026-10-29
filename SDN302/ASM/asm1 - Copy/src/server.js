import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import ApiRouter from "./routes/api.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();
app.use("/api", ApiRouter);
app.get("/",(req,res)=>{

    res.json({
        message:"API running"
    });

});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});