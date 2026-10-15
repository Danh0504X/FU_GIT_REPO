import mongoose from "mongoose";
import ParkingSession from "../models/parkingSessionModel.js";

export async function getSession(req, res, next) {


    try{

        const ParkingSessions = await ParkingSession.find();
        res.json(ParkingSessions);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

    res.status(200).json(ParkingSession);
}

export async function Checkin (req, res) { 
    
    try{

        const ParkingSessions = await ParkingSession.create(req.body);

        res.status(201).json({
            message:"ParkingSession created successfully",
            data: ParkingSessions
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }
}

// export async function checkout (req, res) { 
    
//     try{

//         const {c } = req.body;

//         res.status(201).json({
//             message:"ParkingSession created successfully",
//             data: ParkingSessions
//         });


//     }catch(error){

//         res.status(500).json({
//             message:error.message
//         });

//     }
// }

