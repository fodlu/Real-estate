import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

// protect
export const protect = async (req, res, next) => {
	try {
		let token;

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Not authorized. Token missing",
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = await UserModel.findById(decoded.id).select("-password");

		if (req.user && req.user.isBlocked) {
			return res.status({
				success: false,
				message: "Your account has been blocked by an admin",
			});
		}
		next();
	} catch (error) {
        res.status(401).json({
            success: false,
            message: "Token invalid"
        })
    }
};

// role based authentication
export const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access Denied. You don't have the permission."
            })
        }
        next()
    }
}