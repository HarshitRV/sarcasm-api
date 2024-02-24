import { Router } from "express";
import { protect } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";
import paginatedResults from "../../middlewares/paginatedResults.js";
import { User } from "../../models/user.model.js";

/**
 * Funciton Import from controller
 */
import { getAllUsers } from "../../controller/user/user.controller.js";
import { register, login } from "../../controller/user/auth.controller.js";

/**
 * Declarations
 */
const UserRouter = Router();

/**
 * Routes
 */
UserRouter.route("/user/all").get(
	protect,
	role.checkRole(role.ROLES.Admin),
	paginatedResults(User),
	getAllUsers
);

UserRouter.route("/user/register").post(register);

UserRouter.route("/user/login").post(login);

export default UserRouter;
