import mongoose, { type Document, type Types } from "mongoose";

export interface TaskDocument extends Document {
    userId: Types.ObjectId;
    title: string;
    content: string;
    date: string;
    type: string;
    completed: boolean;
    // Do { timestamps: true } tự thêm
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new mongoose.Schema<TaskDocument>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index: true,
        },
        title: { type: String, required: true, trim: true, maxlength: 200 },
        content: { type: String, default: "", trim: true, maxlength: 2000 },
        date: { type: String, default: "", trim: true, maxlength: 50 },
        type: { type: String, default: "", trim: true, maxlength: 50 },
        completed: { type: Boolean, default: false },
    },
    { timestamps: true },
);

const Task = mongoose.model<TaskDocument>("task", taskSchema);
export default Task;
