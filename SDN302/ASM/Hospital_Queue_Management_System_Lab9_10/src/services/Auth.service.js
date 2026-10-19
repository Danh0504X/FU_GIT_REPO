import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { generateToken } from "../providers/jwt.provider.js";
import { HttpError } from "../utils/httpError.js";

export const registerService = async (userData) => {
    const { username, password, fullName, role } = userData;

    if (!username || !password) {
        throw new HttpError(400, "Username and password are required");
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        throw new HttpError(409, "Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Không gửi role thì mongoose tự gán default = "receptionist"
    const newUser = await User.create({
        username,
        password: hashedPassword,
        fullName,
        role
    });

    return {
        _id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        role: newUser.role,
        createdAt: newUser.createdAt
    };
};

export const loginService = async (userData) => {
    const { username, password } = userData;

    if (!username || !password) {
        throw new HttpError(400, "Username and password are required");
    }

    const user = await User.findOne({ username });

    if (!user) {
        throw new HttpError(401, "Invalid username or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new HttpError(401, "Invalid username or password");
    }

    // Đề yêu cầu token chứa: userId, role, fullName
    const token = generateToken({
        userId: user._id,
        role: user.role,
        fullName: user.fullName
    });

    return {
        token,
        user: {
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            role: user.role
        }
    };
};
