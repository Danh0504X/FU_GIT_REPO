import mongoose from "mongoose";

const queueTicketSchema = new mongoose.Schema({
    // Tự sinh trong service, dạng DEPTCODE-XXX (VD: CARD-001)
    ticketNumber: {
        type: String,
        unique: true
    },

    patientName: {
        type: String,
        required: [true, "Patient name is required"],
        trim: true
    },

    patientPhone: {
        type: String,
        required: [true, "Patient phone is required"],
        trim: true
    },

    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: [true, "Department is required"]
    },

    // Lấy từ JWT, không lấy từ body
    registeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    priority: {
        type: String,
        enum: {
            values: ["normal", "urgent", "emergency"],
            message: "{VALUE} is not a valid priority"
        },
        default: "normal"
    },

    registeredAt: {
        type: Date,
        required: [true, "Registered time is required"]
    },

    calledAt: {
        type: Date,
        default: null
    },

    completedAt: {
        type: Date,
        default: null
    },

    status: {
        type: String,
        enum: {
            values: ["waiting", "called", "completed", "cancelled"],
            message: "{VALUE} is not a valid status"
        },
        default: "waiting"
    },

    note: {
        type: String
    }
});

const QueueTicket = mongoose.model("QueueTicket", queueTicketSchema);

export default QueueTicket;
