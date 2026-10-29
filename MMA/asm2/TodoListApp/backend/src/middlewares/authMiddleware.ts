import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { env } from "../config/env";
import Session from "../models/session";
import User, { type UserDocument } from "../models/user";
import { JwtProvider } from "../providers/JwtProvider";
import ApiError from "../utils/ApiError";
import { asyncHandler } from "./asyncHandler";

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument;
            // jti của session hiện tại, dùng khi logout
            sessionJti?: string;
        }
    }
}

export const protectedRoute: RequestHandler = asyncHandler(
    async (request, _response, next) => {
        // App mobile không dùng cookie: token gửi qua header "Authorization: Bearer <token>"
        const [scheme, token] = request.headers.authorization?.split(" ") ?? [];
        if (scheme !== "Bearer" || !token) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
        }
        if (!env.JWT_SECRET) {
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "JWT secret must be configured",
            );
        }

        let payload;
        try {
            payload = await JwtProvider.verifyToken(token, env.JWT_SECRET);
        } catch (error) {
            if (error instanceof Error && error.name === "TokenExpiredError") {
                throw new ApiError(
                    StatusCodes.UNAUTHORIZED,
                    "Session expired, please log in again",
                );
            }
            if (
                error instanceof Error &&
                ["JsonWebTokenError", "NotBeforeError"].includes(error.name)
            ) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
            }
            throw error;
        }

        if (
            typeof payload.sub !== "string" ||
            !mongoose.isValidObjectId(payload.sub) ||
            typeof payload.jti !== "string"
        ) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
        }

        // Token hợp lệ nhưng session đã bị xoá (logout) thì không cho dùng tiếp
        const session = await Session.exists({
            jti: payload.jti,
            userId: payload.sub,
            expiresAt: { $gt: new Date() },
        });
        if (!session) {
            throw new ApiError(
                StatusCodes.UNAUTHORIZED,
                "Session expired or revoked",
            );
        }

        const user = await User.findById(payload.sub).select("-passwordHash");
        if (!user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");
        }

        request.user = user;
        request.sessionJti = payload.jti;
        next();
    },
);
