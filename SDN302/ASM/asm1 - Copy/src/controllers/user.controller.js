import mongoose from "mongoose";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

// GET /users
export async function getUsers(req, res) {

    try {

        const users = await User.find();
        res.status(200).json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}

// POST /users
export async function createUser(req, res) {

    try {

        const { username, password } = req.body ?? {};

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required."
            });
        }

        const existed = await User.findOne({ username: username.trim() });
        if (existed) {
            return res.status(400).json({
                message: "Username already exists."
            });
        }

        const user = await User.create({ username, password });

        res.status(201).json({
            message: "User added successfully",
            data: user
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Username already exists."
            });
        }

        res.status(500).json({
            message: error.message
        });

    }
}

// // DELEusers/:idTE /
// export async function deleteUser(req, res) {

//     try {

//         const { id } = req.params;

//         if (!mongoose.isValidObjectId(id)) {
//             return res.status(400).json({
//                 message: "Invalid user id."
//             });
//         }

//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found."
//             });
//         }

//         const hasOrders = await Order.exists({ user: id });
//         if (hasOrders) {
//             return res.status(400).json({
//                 message: "Cannot delete user with existing orders."
//             });
//         }

//         await user.deleteOne();

//         res.status(200).json({
//             message: "User deleted successfully"
//         });

//     } catch (error) {

//         res.status(500).json({
//             message: error.message
//         });

    // }
// }
