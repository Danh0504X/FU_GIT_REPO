import { verifyToken } from "../providers/jwt.provider.js";

// Kiểm tra header: Authorization: Bearer <token>
// Nếu hợp lệ thì gắn payload { userId, role, fullName } vào req.user
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = verifyToken(token);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

// Phân quyền theo role, phải dùng sau authenticate
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action"
            });
        }

        next();
    };
};
