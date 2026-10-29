import { StatusCodes } from "http-status-codes";
import mongoose, { type Types } from "mongoose";
import Task, { type TaskDocument } from "../models/task";
import ApiError from "../utils/ApiError";

interface TaskBody {
    title?: unknown;
    content?: unknown;
    date?: unknown;
    type?: unknown;
    completed?: unknown;
}

// Trả về "id" (không phải "_id") để khớp với kiểu Task ở app mobile
export interface TaskInfo {
    id: string;
    title: string;
    content: string;
    date: string;
    type: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

type TaskFields = Partial<Pick<TaskDocument, "title" | "content" | "date" | "type" | "completed">>;

const TEXT_FIELDS = ["content", "date", "type"] as const;

const buildTaskInfo = (task: TaskDocument): TaskInfo => ({
    id: task._id.toString(),
    title: task.title,
    content: task.content,
    date: task.date,
    type: task.type,
    completed: task.completed,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
});

const asTaskBody = (body: unknown): TaskBody =>
    typeof body === "object" && body !== null ? (body as TaskBody) : {};

const validateTaskId = (id: unknown): string => {
    if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid task id");
    }
    return id;
};

// Chỉ lấy các trường được phép sửa, bỏ qua userId, _id... do client gửi lên
const validateTaskFields = (body: unknown, requireTitle: boolean): TaskFields => {
    const input = asTaskBody(body);
    const fields: TaskFields = {};

    if (input.title !== undefined || requireTitle) {
        if (typeof input.title !== "string" || !input.title.trim()) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Title is required");
        }
        fields.title = input.title.trim();
    }
    for (const key of TEXT_FIELDS) {
        if (input[key] === undefined) continue;
        if (typeof input[key] !== "string") {
            throw new ApiError(StatusCodes.BAD_REQUEST, `${key} must be a string`);
        }
        fields[key] = input[key].trim();
    }
    if (input.completed !== undefined) {
        if (typeof input.completed !== "boolean") {
            throw new ApiError(StatusCodes.BAD_REQUEST, "completed must be a boolean");
        }
        fields.completed = input.completed;
    }
    return fields;
};

const notFound = () => new ApiError(StatusCodes.NOT_FOUND, "Task not found");

const getTasks = async (userId: Types.ObjectId): Promise<TaskInfo[]> => {
    const tasks = await Task.find({ userId }).sort({ createdAt: 1 });
    return tasks.map(buildTaskInfo);
};

const getTask = async (userId: Types.ObjectId, id: unknown): Promise<TaskInfo> => {
    const task = await Task.findOne({ _id: validateTaskId(id), userId });
    if (!task) throw notFound();
    return buildTaskInfo(task);
};

const createTask = async (userId: Types.ObjectId, body: unknown): Promise<TaskInfo> => {
    const fields = validateTaskFields(body, true);
    const task = await Task.create({ ...fields, userId });
    return buildTaskInfo(task);
};

const updateTask = async (userId: Types.ObjectId, id: unknown, body: unknown): Promise<TaskInfo> => {
    const taskId = validateTaskId(id);
    const fields = validateTaskFields(body, false);
    if (Object.keys(fields).length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No fields to update");
    }

    const task = await Task.findOneAndUpdate(
        { _id: taskId, userId },
        { $set: fields },
        { returnDocument: "after", runValidators: true },
    );
    if (!task) throw notFound();
    return buildTaskInfo(task);
};

// Đảo trạng thái completed ngay trong MongoDB, không cần đọc task trước
const toggleTask = async (userId: Types.ObjectId, id: unknown): Promise<TaskInfo> => {
    const task = await Task.findOneAndUpdate(
        { _id: validateTaskId(id), userId },
        [{ $set: { completed: { $not: "$completed" } } }],
        { returnDocument: "after", updatePipeline: true },
    );
    if (!task) throw notFound();
    return buildTaskInfo(task);
};

const deleteTask = async (userId: Types.ObjectId, id: unknown): Promise<void> => {
    const result = await Task.deleteOne({ _id: validateTaskId(id), userId });
    if (result.deletedCount === 0) throw notFound();
};

export const taskService = { getTasks, getTask, createTask, updateTask, toggleTask, deleteTask };
