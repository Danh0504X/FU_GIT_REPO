import mongoose from "mongoose";
import QueueTicket from "../models/queueTicketModel.js";
import Department from "../models/departmentModel.js";
import { HttpError } from "../utils/httpError.js";

const ACTIVE_STATUSES = ["waiting", "called"];

// Sinh số ticket tiếp theo của khoa: CARD-001, CARD-002, ...
// Lấy ticket mới nhất của khoa rồi +1 (không dùng count để tránh trùng khi có ticket bị xoá)
const generateTicketNumber = async (department) => {
    const lastTicket = await QueueTicket.findOne({ departmentId: department._id })
        .sort({ _id: -1 })
        .lean();

    const lastNumber = lastTicket
        ? parseInt(lastTicket.ticketNumber.split("-")[1], 10)
        : 0;

    const nextNumber = String(lastNumber + 1).padStart(3, "0");

    return `${department.deptCode}-${nextNumber}`;
};

const findTicketOrThrow = async (id) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new HttpError(400, "Invalid ticket id");
    }

    const ticket = await QueueTicket.findById(id);

    if (!ticket) {
        throw new HttpError(404, "Ticket not found");
    }

    return ticket;
};

export const getQueueService = async (user) => {
    // Doctor xem tất cả, receptionist chỉ xem ticket do mình đăng ký
    const filter = user.role === "doctor" ? {} : { registeredBy: user.userId };

    return await QueueTicket.find(filter)
        .populate("departmentId", "name deptCode floor")
        .populate("registeredBy", "username fullName")
        .sort({ registeredAt: 1 })
        .lean();
};

export const registerTicketService = async (ticketData, user) => {
    const {
        patientName,
        patientPhone,
        departmentId,
        priority,
        registeredAt,
        note
    } = ticketData;

    // 1. registeredAt không được ở quá khứ (không gửi thì lấy thời điểm hiện tại)
    const registeredTime = registeredAt ? new Date(registeredAt) : new Date();

    if (isNaN(registeredTime.getTime())) {
        throw new HttpError(400, "registeredAt is not a valid date");
    }

    if (registeredTime < new Date()) {
        throw new HttpError(400, "registeredAt must not be in the past");
    }

    // 2. Kiểm tra khoa tồn tại và trạng thái khoa
    if (!mongoose.isValidObjectId(departmentId)) {
        throw new HttpError(400, "Invalid department id");
    }

    const department = await Department.findById(departmentId);

    if (!department) {
        throw new HttpError(404, "Department not found");
    }

    if (department.status === "closed") {
        throw new HttpError(400, "This department is currently closed.");
    }

    if (department.status === "full") {
        throw new HttpError(409, "This department queue is full. Please try another department.");
    }

    // 3. Một bệnh nhân chỉ có 1 ticket đang hoạt động trong cùng một khoa
    const activeTicket = await QueueTicket.findOne({
        patientPhone,
        departmentId,
        status: { $in: ACTIVE_STATUSES }
    });

    if (activeTicket) {
        throw new HttpError(409, "This patient already has an active ticket in this department.");
    }

    // 4. Tạo ticket, registeredBy lấy từ JWT (req.user), KHÔNG lấy từ body
    const newTicket = await QueueTicket.create({
        ticketNumber: await generateTicketNumber(department),
        patientName,
        patientPhone,
        departmentId,
        registeredBy: user.userId,
        priority,
        registeredAt: registeredTime,
        note
    });

    // 5. Số ticket đang chờ chạm maxCapacity thì chuyển khoa sang "full"
    const waitingCount = await QueueTicket.countDocuments({
        departmentId,
        status: "waiting"
    });

    if (waitingCount >= department.maxCapacity) {
        department.status = "full";
        await department.save();
    }

    return newTicket;
};

export const callTicketService = async (id) => {
    const ticket = await findTicketOrThrow(id);

    if (ticket.status !== "waiting") {
        throw new HttpError(400, "Only waiting tickets can be called");
    }

    ticket.status = "called";
    ticket.calledAt = new Date();
    await ticket.save();

    return ticket;
};

export const completeTicketService = async (id) => {
    const ticket = await findTicketOrThrow(id);

    if (ticket.status === "completed") {
        throw new HttpError(400, "This ticket is already completed");
    }

    if (ticket.status !== "called") {
        throw new HttpError(400, "Only called tickets can be completed");
    }

    ticket.status = "completed";
    ticket.completedAt = new Date();
    await ticket.save();

    // Thời gian chờ (phút) = calledAt - registeredAt, làm tròn 1 chữ số thập phân
    const waitMs = ticket.calledAt - ticket.registeredAt;
    const waitMinutes = Math.round((waitMs / (1000 * 60)) * 10) / 10;

    // Khoa đang "full" mà số ticket đang hoạt động giảm dưới maxCapacity thì mở lại
    const department = await Department.findById(ticket.departmentId);

    if (department && department.status === "full") {
        const activeCount = await QueueTicket.countDocuments({
            departmentId: department._id,
            status: { $in: ACTIVE_STATUSES }
        });

        if (activeCount < department.maxCapacity) {
            department.status = "open";
            await department.save();
        }
    }

    return { ticket, waitMinutes };
};
