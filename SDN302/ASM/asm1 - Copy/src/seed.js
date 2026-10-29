// Seed script: loads laptop_order_db.*.json into MongoDB
// Usage: npm run seed   (reads MONGO_URI from .env)

import dotenv from "dotenv"
dotenv.config();
import mongoose from "mongoose"
import laptops from "../laptop_order_db.laptops.json" with { type: "json" }
import users from "../laptop_order_db.users.json" with { type: "json" }
import Laptop from "./models/laptopModel.js"
import User from "./models/userModel.js"
import Order from "./models/orderModel.js"

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/laptoporder";

// Compass exports use { "$oid": "..." } for ids
const toDoc = ({ _id, ...rest }) => ({ _id: _id.$oid, ...rest });

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await Order.deleteMany({});
    await Laptop.deleteMany({});
    await User.deleteMany({});
    await Laptop.insertMany(laptops.map(toDoc));
    // insertMany skips the pre("save") hook, so the already-hashed passwords are kept as is
    await User.insertMany(users.map(toDoc));
    console.log(`Seeded ${laptops.length} laptops and ${users.length} users`);
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
