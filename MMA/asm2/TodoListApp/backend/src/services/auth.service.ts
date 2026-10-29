import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { StatusCodes } from "http-status-codes";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import User, { type UserDocument } from "../models/user";
import Session from "../models/session";
import { JwtProvider } from "../providers/JwtProvider";
import ApiError from "../utils/ApiError";

interface CredentialsBody {
    username?: unknown;
    password?: unknown;
    rememberMe?: unknown;
}

export interface UserInfo {
    _id: string;
    username: string;
}

export interface AuthResult {
    token: string;
    expiresAt: Date;
    // false: app chỉ giữ token trong bộ nhớ, mở lại app phải đăng nhập lại
    rememberMe: boolean;
    userInfo: UserInfo;
}

export const buildUserInfo = (user: UserDocument): UserInfo => ({
    _id: user._id.toString(),
    username: user.username,
});

const asCredentials = (body: unknown): CredentialsBody =>
    typeof body === "object" && body !== null ? (body as CredentialsBody) : {};

const validateCredentials = (
    body: unknown,
): { username: string; password: string } => {
    const { username, password } = asCredentials(body);
    if (
        typeof username !== "string" ||
        username.trim().length < 3 ||
        username.trim().length > 50
    ) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Username must be 3-50 characters",
        );
    }
    // bcrypt chỉ dùng 72 byte đầu của mật khẩu
    if (
        typeof password !== "string" ||
        !password ||
        Buffer.byteLength(password, "utf8") > 72
    ) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Password is required and must not exceed 72 bytes",
        );
    }
    return { username: username.trim().toLowerCase(), password };
};

const register = async (body: unknown): Promise<UserInfo> => {
    const { username, password } = validateCredentials(body);
    if (password.length < 6) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Password must be at least 6 characters",
        );
    }
    if (await User.exists({ username })) {
        throw new ApiError(StatusCodes.CONFLICT, "Username already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({ username, passwordHash });
        return buildUserInfo(user);
    } catch (error) {
        if ((error as { code?: number }).code === 11000) {
            throw new ApiError(StatusCodes.CONFLICT, "Username already exists");
        }
        throw error;
    }
};

const login = async (body: unknown): Promise<AuthResult> => {
    const { username, password } = validateCredentials(body);
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "Invalid username or password",
        );
    }
    if (!env.JWT_SECRET) {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "JWT secret must be configured",
        );
    }

    const rememberMe = asCredentials(body).rememberMe === true;
    const jti = randomUUID();
    const token = await JwtProvider.generateToken(
        { sub: user._id.toString(), jti },
        env.JWT_SECRET,
        (rememberMe ? env.JWT_TTL_REMEMBER : env.JWT_TTL) as SignOptions["expiresIn"],
    );
    const payload = await JwtProvider.verifyToken(token, env.JWT_SECRET);
    if (typeof payload.exp !== "number") {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Token expiration could not be determined",
        );
    }
    const expiresAt = new Date(payload.exp * 1000);

    await Session.create({ userId: user._id, jti, rememberMe, expiresAt });

    return { token, expiresAt, rememberMe, userInfo: buildUserInfo(user) };
};

const logout = async (jti: string): Promise<void> => {
    await Session.deleteOne({ jti });
};

export const authService = { register, login, logout };
