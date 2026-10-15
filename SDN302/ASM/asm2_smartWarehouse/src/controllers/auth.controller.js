import User from "../models/userModel.js";
import {
    createToken
} from "../utils/jwt.js";

export const register = async (req, res) => {
    try {
        const {
            username,
            password,
            fullName,
            role,
            assignedWarehouse
        } = req.body ?? {};

        if (![username, password, fullName].every(value => typeof value === "string" && value.trim())) {
            return res.status(400).json({ message: "username, password and fullName are required strings" });
        }


        if (!req.user || req.user.role !== "warehouse_manager") {
            return res.status(403).json({
                message: "Only warehouse_manager can register new users"
            });

        }

        if (role === "warehouse_manager") {
            return res.status(400).json({
                message:
                "Cannot register another manager via API"
            });
        }

        const existingUser = await User.findOne({ username: username.trim() });

        if (existingUser) {
            return res.status(409).json({
                message:
                "Username already exists"
            });
        }

        const user = await User.create({
            username,
            password,
            fullName,
            role,
            assignedWarehouse
        });

        return res.status(201).json({
            message:"User registered successfully",
            
            user:{
                id:user._id,
                username:user.username,
                fullName:user.fullName,
                role:user.role
            }
        });

    } catch(error){
        return res.status(error.code === 11000 ? 409 : error.name === "ValidationError" ? 400 : 500).json({
            message:error.message
        });
    }
};

export const login = async(req,res)=>{
    try{
        const {
            username,
            password
        } = req.body ?? {};

        if (![username, password].every(value => typeof value === "string" && value.trim())) {
            return res.status(400).json({ message: "username and password are required strings" });
        }

        const user = await User.findOne({
            username: username.trim()
        });

        if(!user){
            return res.status(401).json({
                message:"Invalid username or password"
            });
        }

        if(!user.isActive){
            return res.status(403).json({
                message:
                "Account is deactivated. Contact your manager."
            });
        }

        const isMatch =
            await user.comparePassword(password);

        if(!isMatch){
            return res.status(401).json({
                message:
                "Invalid username or password"
            });

        }

        // tạo JWT
        const token = createToken({
            id:user._id,
            role:user.role
        });

        return res.status(200).json({
            message:
            "Login successful",
            token,
            user:{
                id:user._id,
                username:user.username,
                fullName:user.fullName,
                role:user.role
            }
        });

    }catch(error){
        return res.status(500).json({
            message:error.message
        });
    }
}
