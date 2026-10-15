import mongoose from "mongoose";


const warehouseSchema = new mongoose.Schema({

    code: {

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


    location: {

        type: String,

        required: true,

        trim: true

    },


    maxCapacity: {

        type: Number,

        required: true,

        min: 0

    },


    currentLoad: {

        type: Number,

        default: 0,

        min: 0

    },


    status: {

        type: String,

        enum: [
            "active",
            "inactive",
            "full"
        ],

        default: "active"

    }


},{

    timestamps:true

});



const Warehouse = mongoose.model(
    "Warehouse",
    warehouseSchema
);


export default Warehouse;