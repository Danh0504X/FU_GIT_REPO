import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(
    process.env.MONGODB_URI
);

let db;

export async function connectDB(){
    try{

        await client.connect();

        db = client.db(
            process.env.DB_NAME
        );
        console.log("MongoDB connected");
    }
    
    catch(error){
        console.log(
            "MongoDB connection error:",
            error.message
        );
    }
}
export function getDB(){
    return db;
}