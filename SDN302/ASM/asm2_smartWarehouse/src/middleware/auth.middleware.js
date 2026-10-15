import { verifyToken as decodeToken } from "../utils/jwt.js";
import mongoose from "mongoose";

export function verifyToken(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token provided" });
    const match = /^Bearer\s+(\S+)$/i.exec(header);
    if (!match) return res.status(401).json({ message: "Use Authorization: Bearer <token>" });
    try {
        const decoded = decodeToken(match[1]);
        if (!mongoose.isObjectIdOrHexString(decoded.id) || !["warehouse_manager", "stock_keeper", "auditor"].includes(decoded.role)) {
            return res.status(401).json({ message: "Invalid token payload" });
        }
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({ message: error.name === "TokenExpiredError" ? "Token expired" : "Invalid token" });
    }
    next();
}
export const authenticate = verifyToken;
