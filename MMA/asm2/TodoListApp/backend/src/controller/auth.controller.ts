import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authService, buildUserInfo } from "../services/auth.service";

export const register: RequestHandler = asyncHandler(async (request, response) => {
    const userInfo = await authService.register(request.body);
    response.status(StatusCodes.CREATED).json({
        status: "success",
        message: "Register successful",
        data: { userInfo },
    });
});

// Token trả trong body (không dùng cookie) để app tự lưu:
// rememberMe = true thì lưu vào AsyncStorage, false thì chỉ giữ trong bộ nhớ
export const login: RequestHandler = asyncHandler(async (request, response) => {
    const result = await authService.login(request.body);
    response.status(StatusCodes.OK).json({
        status: "success",
        message: "Login successful",
        data: result,
    });
});

// App gọi khi khởi động để kiểm tra token đã lưu còn hợp lệ không (auto-login)
export const getMe: RequestHandler = asyncHandler(async (request, response) => {
    response.status(StatusCodes.OK).json({
        status: "success",
        message: "Session is valid",
        data: { userInfo: buildUserInfo(request.user!) },
    });
});

export const logout: RequestHandler = asyncHandler(async (request, response) => {
    await authService.logout(request.sessionJti!);
    response.status(StatusCodes.OK).json({
        status: "success",
        message: "Logout successful",
    });
});
