import { User } from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * Middleware function to protect routes by checking for authorization token.
 * If the token is valid and the user is found, the user object is added to the request object.
 * Otherwise, an error response is sent.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The response object with a status and a body. The body contains a `status` property which is a string indicating if the request was successful. If `status` is "failed", the body also contains a `message` property with a string describing the error.
 */
export const protect = catchAsync(async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(401).send({
			status: "failed",
			message: "User not authorized",
		});
	}
	let token = authorization.split("Bearer ")[1];
	if (!token) {
		return res.status(401).send({
			status: "failed",
			message: "Token not found",
		});
	}
	const payload = await verifyToken(token);
	const user = await User.findById(payload.id)
		.select("-password")
		.lean()
		.exec();
	if (!user) {
		return res.status(401).send({
			status: "failed",
			message: "User not found",
		});
	}

	req.user = user;
	next();
});
