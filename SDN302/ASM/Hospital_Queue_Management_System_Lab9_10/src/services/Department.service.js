import Department from "../models/departmentModel.js";

// Dùng để lấy _id của khoa khi test POST /queue/register trên Postman
export const getAllDepartmentsService = async () => {
    return await Department.find().sort({ deptCode: 1 }).lean();
};
