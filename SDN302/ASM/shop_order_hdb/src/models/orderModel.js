import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, "Customer name is required"]
    },

    productName: {
        type: String,
        required: [true, "Product name is required"]
    },

    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"]
    },

    orderDate: {
        type: Date,
        required: [true, "Order date is required"]
    },

    totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
        min: [0, "Total price must be greater than or equal to 0"]
    }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;