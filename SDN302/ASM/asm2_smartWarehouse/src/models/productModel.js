import mongoose from "mongoose";


const productSchema = new mongoose.Schema({

    sku: {

        type: String,

        required: true,

        unique: true,

        trim: true

    },


    name: {

        type: String,

        required: true,

        trim: true

    },


    category: {

        type: String,

        required: true,

        trim: true

    },


    unit: {

        type: String,

        required: true,

        trim: true

    },


    unitPrice: {

        type: Number,

        required: true,

        min: 0.01

    },


    reorderLevel: {

        type: Number,

        required: true,

        min: 0

    },


    isActive: {

        type: Boolean,

        default: true

    }


},{

    timestamps:true

});



const Product = mongoose.model(
    "Product",
    productSchema
);


export default Product;