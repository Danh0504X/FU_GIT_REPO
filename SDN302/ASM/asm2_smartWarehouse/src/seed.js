import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/userModel.js";
import Warehouse from "./models/warehouseModel.js";


// Tài khoản mẫu theo đề (mật khẩu 123456)
const users = [
    { username: "manager1", password: "123456", fullName: "Manager One", role: "warehouse_manager" },
    { username: "keeper1", password: "123456", fullName: "Keeper One", role: "stock_keeper" },
    { username: "auditor1", password: "123456", fullName: "Auditor One", role: "auditor" },
    // tài khoản bị khoá, dùng để test login 403
    { username: "inactive1", password: "123456", fullName: "Inactive User", role: "stock_keeper", isActive: false }
];

const warehouses = [
    { code: "WH-01", name: "Hai Chau Warehouse", location: "Hai Chau, Da Nang", maxCapacity: 5000 },
    { code: "WH-02", name: "Son Tra Warehouse", location: "Son Tra, Da Nang", maxCapacity: 3000 },
    { code: "WH-03", name: "Lien Chieu Warehouse", location: "Lien Chieu, Da Nang", maxCapacity: 1000 }
];


try {
    await mongoose.connect(process.env.MONGO_URI);

    // chỉ tạo nếu chưa có, không ghi đè dữ liệu cũ
    for (const user of users) {
        const existing = await User.findOne({ username: user.username });
        if (existing) {
            console.log(`User ${user.username} already exists, skipped.`);
        } else {
            await User.create(user);
            console.log(`User ${user.username} created.`);
        }
    }

    for (const warehouse of warehouses) {
        const existing = await Warehouse.findOne({ code: warehouse.code });
        if (existing) {
            console.log(`Warehouse ${warehouse.code} already exists, skipped.`);
        } else {
            await Warehouse.create(warehouse);
            console.log(`Warehouse ${warehouse.code} created.`);
        }
    }

} catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
