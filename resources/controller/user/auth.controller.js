import validator from "validator";
/**
 * Model
 */
import { User } from "../../models/user.model.js";
/**
 * Utils
 */
import catchAsync from "../../utils/catchAsync.js";
import { newToken } from "../../utils/jwt.js";
import { ServerError } from "../../utils/ServerError.js";

/**
 * Registers a new user
 *
 * @param {object} req contains object of data required for registration
 * @param {object} res response object
 * @returns {undefined}
 */
export const register = catchAsync(async (req, res) => {
	const { email, firstName, lastName, password, role } = req.body;

	const { pass_code } = req.query;

	/**
	 * Default role is member
	 */
	if (!role) {
		role = "ROLE_MEMBER";
	}

	/**
	 * If registering as admin, check if pass_code is correct
	 */
	if (role === "ROLE_ADMIN") {
		if (pass_code !== process.env.PASS_CODE) {
			throw new ServerError(
				401,
				"Invalid pass_code, you are not authorized to register as admin"
			);
		}
	}

	if (!email) {
		return res.status(400).send({
			success: false,
			error: "You must enter an email address.",
		});
	}
	if (!firstName || !lastName) {
		return res.status(400).send({
			success: false,
			error: "You must enter your full name.",
		});
	}
	if (!password) {
		return res.status(400).send({
			success: false,
			error: "You must enter a password.",
		});
	}

	/**
	 * Check if user already registered
	 */
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return res.status(400).send({
			success: false,
			error: "This email is already in use.",
		});
	}

	if (!validator.isEmail(email)) {
		return res.status(400).send({
			success: false,
			error: "Invalid email",
		});
	}

	if (!validator.isAlpha(firstName)) {
		return res.status(400).send({
			success: false,
			error: "Invalid first Name",
		});
	}

	if (!validator.isAlpha(lastName)) {
		return res.status(400).send({
			success: false,
			error: "Invalid last Name",
		});
	}

	const user = new User({
		email,
		password,
		firstName,
		lastName,
		role,
	});

	const registeredUser = await user.save();

	const token = newToken(registeredUser);

	res.status(200).send({
		success: true,
		token: `${token}`,
		user: {
			id: registeredUser.id,
			firstName: registeredUser.firstName,
			lastName: registeredUser.lastName,
			email: registeredUser.email,
			role: registeredUser.role,
		},
	});
});

/**
 * Handles user login.
 *
 * @param {Object} req - The request object from Express.js. It should have a body with `email` and `password` properties.
 * @param {Object} res - The response object from Express.js. This function will send a response using this object.
 * @returns {Object} The response object with a status and a body. The body contains a `success` property which is a boolean indicating if the login was successful. If `success` is true, the body also contains a `token` property with the new token and a `user` property with the user's information. If `success` is false, the body contains an `error` property with a string describing the error.
 *
 * @throws {Error} If there is an error with the database or with generating the token, this function will throw an error.
 */
export const login = catchAsync(async (req, res) => {
	const { email, password } = req.body;

	if (!email) {
		return res.status(400).send({
			success: false,
			error: "You must enter an email address.",
		});
	}
	if (!password) {
		return res.status(400).send({
			success: false,
			error: "You must enter a password.",
		});
	}

	const user = await User.findOne({ email });

	if (!user) {
		return res.status(404).send({
			success: false,
			error: "User not found",
		});
	}

	const match = await user.checkPassword(password);

	if (!match) {
		return res.status(401).send({
			success: false,
			error: "Invalid email or password",
		});
	}

	const token = newToken(user);

	return res.status(200).send({
		success: true,
		token: `${token}`,
		user: {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			role: user.role,
		},
	});
});
