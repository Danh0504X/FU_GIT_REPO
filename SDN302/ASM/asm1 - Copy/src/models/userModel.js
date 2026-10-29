import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Never return password in JSON responses
userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});


const User = mongoose.model("User", userSchema);

export default User;
