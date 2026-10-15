import mongoose from "mongoose";

const parkingSlotSchema = new mongoose.Schema( 
    
     {
        slotCode: {
            type: String,
            required: [true, "slotCode title is required"],
            unique: true
        },


        zone: {
            type: String,
            required: [true, "Zone is required"]

        },


        vehicleType: {
            type: String,
            enum: {
                values: [
                    "motorbike",
                    "car"
                ],
        },
    },

        status: {
            type: String,
            enum: {
                values: [
                    "available",
                    "occupied",
                    "maintenance"
                ],
            default:"available"

        },
    },

        pricePerHour: {
            type:Number,
            require:true
        }

    }
);


const ParkingSlot = mongoose.model("Parkingslot", parkingSlotSchema);


export default ParkingSlot;