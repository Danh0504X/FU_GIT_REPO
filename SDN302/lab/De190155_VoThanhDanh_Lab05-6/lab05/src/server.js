import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import bookRouter from "./routes/books.js";
import { errorHandler } from "./middleware/errorHandler.js";

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

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});