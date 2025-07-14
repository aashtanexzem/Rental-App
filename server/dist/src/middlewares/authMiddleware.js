"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const authMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        try {
            const decoded = (0, jsonwebtoken_1.decode)(token);
            const userRole = decoded["custom:role"] || "";
            req.user =
                {
                    id: decoded.sub,
                    role: userRole
                };
            const hasAccess = allowedRoles.includes(userRole.toLowerCase());
            if (!hasAccess) {
                res.status(403).json({ message: "Forbidden" });
                return;
            }
        }
        catch (error) {
            console.error("Error decoding token:", error);
            res.status(400).json({ message: "Unauthorized token" });
            return;
        }
        next();
    };
};
exports.authMiddleware = authMiddleware;
