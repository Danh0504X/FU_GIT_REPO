import bcrypt from "bcrypt";
import User from "../models/user";
import { env } from "./env";

// Tạo sẵn tài khoản admin (chỉ khi chưa có) để app dùng nút "Đăng nhập nhanh"
export const seedAdminAccount = async (): Promise<void> => {
    const username = env.ADMIN_USERNAME.trim().toLowerCase();

    if (await User.exists({ username })) {
        return;
    }

    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
    await User.create({ username, passwordHash });
    console.info(`Created default account "${username}".`);
};
