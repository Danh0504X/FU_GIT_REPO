import mongoose, { type Document } from "mongoose";

export interface UserDocument extends Document {
    username: string;
    passwordHash: string;
}

const userSchema = new mongoose.Schema<UserDocument>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
        passwordHash: { type: String, required: true },
    },
    { timestamps: true },
);

const User = mongoose.model<UserDocument>("user", userSchema);
export default User;
