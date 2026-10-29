import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    laptop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Laptop",
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"]
    },

    orderDate: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
