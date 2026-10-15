import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import ApiRouter from "./routes/api.js";
import OrderViewRouter from "./routes/OrderViewRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));


connectDB();

app.use("/api", ApiRouter);
app.use("/orders", OrderViewRouter);
app.get("/",(req,res)=>{

    res.json({
        message:"API running"
    });

});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});