import { getAllDepartmentsService } from "../services/Department.service.js";
import { handleError } from "../utils/httpError.js";

export const getDepartments = async (req, res) => {
    try {
        const departments = await getAllDepartmentsService();

        return res.status(200).json({
            success: true,
            data: departments
        });
    } catch (error) {
        return handleError(res, error);
    }
};
