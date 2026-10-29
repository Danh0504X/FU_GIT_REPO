import mongoose from "mongoose";


const laptopSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    brand: {
        type: String
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    stockQuantity: {
        type: Number,
        required: true,
        min: [0, "Stock quantity cannot be negative"]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Laptop = mongoose.model("Laptop", laptopSchema);

export default Laptop;
