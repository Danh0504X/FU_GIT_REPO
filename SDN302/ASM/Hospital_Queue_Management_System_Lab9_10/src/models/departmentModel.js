import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    deptCode: {
        type: String,
        required: [true, "Department code is required"],
        unique: true,
        uppercase: true,
        trim: true
    },

    name: {
        type: String,
        required: [true, "Department name is required"]
    },

    specialty: {
        type: String
    },

    floor: {
        type: Number
    },

    status: {
        type: String,
        enum: {
            values: ["open", "closed", "full"],
            message: "{VALUE} is not a valid status"
        },
        default: "open"
    },

    // Số ticket "waiting" tối đa cùng lúc
    maxCapacity: {
        type: Number,
        required: [true, "Max capacity is required"],
        min: [1, "Max capacity must be at least 1"]
    }
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;
