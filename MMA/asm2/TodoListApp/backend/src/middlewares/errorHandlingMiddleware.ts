import type { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";

type ErrorWithStatus = Error & {
    statusCode?: number;
    status?: number;
    errors?: unknown[];
    code?: unknown;
};

export const errorHandlingMiddleware: ErrorRequestHandler = (error, request, response, _next) => {
    const normalizedError = error as ErrorWithStatus;
    // express.json() báo lỗi JSON sai cú pháp qua trường status (400)
    const statusCode =
        normalizedError.statusCode ?? normalizedError.status ?? StatusCodes.INTERNAL_SERVER_ERROR;
    const isServerError = statusCode >= StatusCodes.INTERNAL_SERVER_ERROR;
    // Lỗi server có thể chứa chi tiết nội bộ (lỗi DB, đường dẫn file): không trả về ở production
    const hideDetails = env.IS_PRODUCTION && isServerError;
    const responseError = {
        statusCode,
        ...(typeof normalizedError.code === "string" && { code: normalizedError.code }),
        message: hideDetails ? "Internal Server Error" : normalizedError.message || "Internal Server Error",
        errors: hideDetails ? [] : normalizedError.errors || [],
        stack: env.IS_PRODUCTION ? null : normalizedError.stack,
    };

    if (isServerError) {
        console.error(`[${request.method} ${request.path}]`, normalizedError.stack ?? normalizedError);
    } else {
        console.error("Error:", responseError.message);
    }
    response.status(statusCode).json(responseError);
};
