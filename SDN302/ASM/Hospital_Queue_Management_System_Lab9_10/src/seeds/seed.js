import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import Department from "../models/departmentModel.js";
import QueueTicket from "../models/queueTicketModel.js";

dotenv.config();

// Đọc dữ liệu mẫu từ hospital.json (cùng thư mục với file này)
const dataPath = path.join(import.meta.dirname, "hospital.json");
const { users, departments, tickets } = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Xoá dữ liệu cũ để seed lại từ đầu
        await QueueTicket.deleteMany();
        await User.deleteMany();
        await Department.deleteMany();

        // 1. Users: hash password trước khi lưu
        const hashedUsers = await Promise.all(
            users.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10)
            }))
        );

        const createdUsers = await User.insertMany(hashedUsers);
        const createdDepartments = await Department.insertMany(departments);

        // 2. Tickets: trong JSON dùng deptCode / username cho dễ đọc,
        //    ở đây đổi sang _id thật để lưu vào departmentId / registeredBy
        const deptIdByCode = Object.fromEntries(createdDepartments.map((d) => [d.deptCode, d._id]));
        const userIdByUsername = Object.fromEntries(createdUsers.map((u) => [u.username, u._id]));

        const ticketDocs = tickets.map(({ deptCode, registeredBy, ...ticket }) => ({
            ...ticket,
            departmentId: deptIdByCode[deptCode],
            registeredBy: userIdByUsername[registeredBy]
        }));

        await QueueTicket.insertMany(ticketDocs);

        console.log(
            `Seeded ${createdUsers.length} users, ${createdDepartments.length} departments, ${ticketDocs.length} tickets`
        );

        process.exit();
    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
};

seed();
