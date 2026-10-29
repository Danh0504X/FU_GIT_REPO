import "dotenv/config";

const NODE_ENVS = ["development", "production", "test"] as const;
type NodeEnv = (typeof NODE_ENVS)[number];

const NODE_ENV = process.env.NODE_ENV || "development";
if (!NODE_ENVS.includes(NODE_ENV as NodeEnv)) {
    throw new Error(`Invalid NODE_ENV "${NODE_ENV}". Expected one of: ${NODE_ENVS.join(", ")}`);
}

export const env = {
    NODE_ENV: NODE_ENV as NodeEnv,
    IS_PRODUCTION: NODE_ENV === "production",
    PORT: Number(process.env.PORT) || 3000,
    MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_TTL_REMEMBER: process.env.JWT_TTL_REMEMBER || "30d",
    JWT_TTL: process.env.JWT_TTL || "1d",
    // Tài khoản mặc định, chỉ được tạo tự động khi không chạy production
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || "admin",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123",
};
