import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Product name is required"],
        unique: true
    },

    category: {
        type: String,
        required: [true, "Category is required"]
    },

    stockStatus: {
        type: String,
        enum: {
            values: [
                "in_stock",
                "out_of_stock",
                "discontinued"
            ],
            message: "{VALUE} is not a valid stock status"
        },
        required: [true, "Stock status is required"]
    },

    unitPrice: {
        type: Number,
        required: [true, "Unit price is required"],
        min: [0, "Unit price must be greater than or equal to 0"]
    },

    tags: {
        type: [String],
        required: true
    }
});

const Product = mongoose.model("Product", productSchema);

export default Product;