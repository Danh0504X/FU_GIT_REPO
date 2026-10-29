import mongoose, { type Document, type Types } from "mongoose";

export interface SessionDocument extends Document {
    userId: Types.ObjectId;
    jti: string;
    rememberMe: boolean;
    expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index: true,
        },
        jti: { type: String, required: true, unique: true },
        rememberMe: { type: Boolean, required: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

// MongoDB tự xoá session khi đến expiresAt
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model<SessionDocument>("session", sessionSchema);
export default Session;
