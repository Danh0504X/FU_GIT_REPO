import mongoose from "mongoose";

const parkingSessionSchema = new mongoose.Schema( 
    
     {
         userId : {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'user',
            },


        slotId: {
            type: mongoose.Schema.Types.ObjectId,
             ref: 'Parkingslot',
             required: true

        },

        vehiclePlate: {
            type: String,
            required: [true, "vehiclePlate is required"]
        },
   
        checkInTime : {
            type: Date,
            required: [true, "Time is required"]

        },

        checkOutTime : {
            type: Date,
        },
    
        totalFee : {
            type:Number,

        },

        note: {
            type:String,
            optional:[true]
        }

    }
);


const ParkingSession = mongoose.model("ParkingSession", parkingSessionSchema);


export default ParkingSession;