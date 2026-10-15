import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import bookRouter from "./routes/books.js";

dotenv.config();


const app = express();
app.use(express.json());

connectDB();
app.use("/books", bookRouter);
app.get("/",(req,res)=>{

    res.json({
        message:"BookNest API running"
    });

});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});