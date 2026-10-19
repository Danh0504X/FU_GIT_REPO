import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },

    // Lưu mật khẩu đã hash bằng bcrypt, không lưu mật khẩu gốc
    password: {
        type: String,
        required: [true, "Password is required"]
    },

    role: {
        type: String,
        enum: {
            values: ["doctor", "receptionist"],
            message: "{VALUE} is not a valid role"
        },
        default: "receptionist"
    },

    fullName: {
        type: String,
        trim: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", userSchema);

export default User;
