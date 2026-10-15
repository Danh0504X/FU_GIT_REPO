import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";

dotenv.config();

const orders = [
    {
        customerName: "Nguyen Thi Lan",
        productName: "Wireless Mouse",
        quantity: 2,
        orderDate: new Date("2026-10-01"),
        totalPrice: 500000
    },
    {
        customerName: "Pham Van Duc",
        productName: "Mechanical Keyboard",
        quantity: 1,
        orderDate: new Date("2026-10-02"),
        totalPrice: 750000
    },
    {
        customerName: "Le Minh Anh",
        productName: "Laptop Stand",
        quantity: 2,
        orderDate: new Date("2026-10-03"),
        totalPrice: 700000
    }
];

const seedOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Order.deleteMany();

        await Order.insertMany(orders);

        console.log("Orders seeded successfully");

        process.exit();
    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
};

seedOrders();