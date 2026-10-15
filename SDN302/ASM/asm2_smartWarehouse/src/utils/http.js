import mongoose from "mongoose";

export function fail(status, message) {
    const error = new Error(message);
    error.status = status;
    throw error;
}

export function objectId(value, name) {
    if (typeof value !== "string" || !mongoose.isObjectIdOrHexString(value)) {
        fail(400, `${name} must be a valid ObjectId`);
    }
    return value;
}

export function positiveNumber(value, name) {
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
        fail(400, `${name} must be greater than 0`);
    }
    return value;
}

export function errorHandler(error, req, res, next) {
    if (res.headersSent) return next(error);
    if (error.code === 11000) return res.status(409).json({ message: "Duplicate value already exists" });
    if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({ message: error.message });
    }
    const status = error.status || 500;
    if (status >= 500) console.error(error);
    return res.status(status).json({ message: status === 500 ? "Internal server error" : error.message });
}
