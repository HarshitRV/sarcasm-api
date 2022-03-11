import { Router } from "express";
import { protect } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";
import paginatedResults from "../../middlewares/paginatedResults.js";
import { User } from "../../models/user.model.js"; 

/**
 * Funciton Import from controller
 */
import { getAllUsers } from "../../controller/user/user.controller.js";
import { register, signin } from "./admin.router.js";

/**
 * Declarations
 */
const UserRouter = Router();

/** 
 * Routes
 */

UserRouter.route("/all")
    .get(protect,role.checkRole(role.ROLES.Admin),paginatedResults(User),getAllUsers);

UserRouter.route('/register')
    .post(register);

UserRouter.route('/signin')
    .post(signin);

/**
 * Export
 */
export default UserRouter;