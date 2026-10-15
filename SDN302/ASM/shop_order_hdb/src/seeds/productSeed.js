import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/productModel.js";

dotenv.config();

const products = [
    {
        productName: "Wireless Mouse",
        category: "Electronics",
        stockStatus: "in_stock",
        unitPrice: 250000,
        tags: [
            "bestseller",
            "wireless",
            "accessory"
        ]
    },
    {
        productName: "Mechanical Keyboard",
        category: "Electronics",
        stockStatus: "in_stock",
        unitPrice: 750000,
        tags: [
            "keyboard",
            "mechanical",
            "gaming"
        ]
    },
    {
        productName: "USB-C Hub",
        category: "Accessories",
        stockStatus: "out_of_stock",
        unitPrice: 420000,
        tags: [
            "usb-c",
            "hub",
            "accessory"
        ]
    },
    {
        productName: "Laptop Stand",
        category: "Accessories",
        stockStatus: "in_stock",
        unitPrice: 350000,
        tags: [
            "laptop",
            "stand",
            "desk"
        ]
    },
    {
        productName: "Webcam HD",
        category: "Electronics",
        stockStatus: "discontinued",
        unitPrice: 680000,
        tags: [
            "webcam",
            "camera",
            "video-call"
        ]
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Product.deleteMany();

        console.log("Old products deleted");

        await Product.insertMany(products);

        console.log("Products seeded successfully");

        process.exit();
    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
};

seedProducts();