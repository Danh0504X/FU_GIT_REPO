import { registerService, loginService } from "../services/Auth.service.js";
import { handleError } from "../utils/httpError.js";

export const register = async (req, res) => {
    try {
        const user = await registerService(req.body);

        return res.status(201).json({
            success: true,
            message: "Register successfully",
            data: user
        });
    } catch (error) {
        return handleError(res, error);
    }
};

export const login = async (req, res) => {
    try {
        const result = await loginService(req.body);

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            data: result
        });
    } catch (error) {
        return handleError(res, error);
    }
};
