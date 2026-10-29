import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Laptop from "../models/laptopModel.js";
import User from "../models/userModel.js";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;


function parseDate(value) {
    if (typeof value !== "string" || !DATE_REGEX.test(value)) {
        return null;
    }
    const date = new Date(`${value}T00:00:00.000Z`);
    if (isNaN(date) || date.toISOString().slice(0, 10) !== value) {
        return null;
    }
    return date;
}


export async function createOrder(req, res) {

    try {

        const { userId, laptopId } = req.body ?? {};
        const quantity = Number(req.body?.quantity);

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Invalid userId."
            });
        }

        if (!mongoose.isValidObjectId(laptopId)) {
            return res.status(400).json({
                message: "Invalid laptopId."
            });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be a positive integer."
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const laptop = await Laptop.findById(laptopId);
        if (!laptop) {
            return res.status(404).json({
                message: "Laptop not found."
            });
        }

    
        const updatedLaptop = await Laptop.findOneAndUpdate(
            { _id: laptopId, stockQuantity: { $gte: quantity } },
            { $inc: { stockQuantity: -quantity } },
            { returnDocument: "after" }
        );

        if (!updatedLaptop) {
            return res.status(400).json({
                message: `Insufficient stock. Only ${laptop.stockQuantity} left.`
            });
        }

        let order;
        try {
            order = await Order.create({
                user: userId,
                laptop: laptopId,
                quantity,
                orderDate: new Date()
            });
        } catch (error) {
            await Laptop.updateOne({ _id: laptopId }, { $inc: { stockQuantity: quantity } });
            throw error;
        }

        res.status(201).json({
            message: "Order created successfully",
            data: order
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}

// GET /orders
export async function getOrders(req, res) {

    try {

        const orders = await Order.find()
            .populate("user")
            .populate("laptop");

        res.status(200).json(orders);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}

// GET /ordersByDate
export async function getOrdersByDate(req, res) {

    try {

        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({
                message: "start and end are required (format YYYY-MM-DD)."
            });
        }

        const startDate = parseDate(start);
        const endDate = parseDate(end);

        if (!startDate || !endDate) {
            return res.status(400).json({
                message: "Invalid date format. Use YYYY-MM-DD."
            });
        }

        if (startDate >= endDate) {
            return res.status(400).json({
                message: "Invalid date range: start must be before end."
            });
        }

        const endOfRange = new Date(endDate);
        endOfRange.setUTCDate(endOfRange.getUTCDate() + 1);

        const orders = await Order.find({
            orderDate: { $gte: startDate, $lt: endOfRange }
        })
            .populate("user")
            .populate("laptop");

        res.status(200).json(orders);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}
