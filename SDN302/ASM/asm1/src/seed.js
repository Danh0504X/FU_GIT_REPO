// Seed script: loads parking.json into MongoDB
// Usage: node seed.js   (reads MONGO_URI from .env, defaults to local "parking" DB)

// require("dotenv").config();
// const mongoose = require("mongoose");
// const data = require("./parking.json");
// const ParkingSlot = require("./models/parkingSlotModel");
// const ParkingSession = require("./models/parkingSessionModel");
import dotenv from "dotenv" 
dotenv.config();
import mongoose from "mongoose"
import data from "./parking.json" with { type: "json"}
import ParkingSlot from "./models/parkingSlotModel.js"
import ParkingSession from "./models/parkingSessionModel.js"

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/parking";

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await ParkingSession.deleteMany({});
    await ParkingSlot.deleteMany({});
    await ParkingSlot.insertMany(data.parkingslots);
    await ParkingSession.insertMany(data.parkingsessions);
    console.log(`Seeded ${data.parkingslots.length} slots and ${data.parkingsessions.length} sessions`);
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
