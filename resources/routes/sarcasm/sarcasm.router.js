import { Router } from "express";

/**
 * Middleware
 */

import { protect } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

/**
 * Import Contoller functions
 */
import {
	getAllComments,
	getRandomComment,
	addNewComment,
	patchOneComment,
	putOneComment,
	deleteOneComment,
} from "../../controller/sarcasm/sarcasm.controller.js";

const SarcasmRouter = Router();

/**
 * Get one random comment
 */
SarcasmRouter.route("/").get(getRandomComment);
/**
 * Patch one comment
 */
SarcasmRouter.route("/sarcasm")
	.patch(protect, role.checkRole(role.ROLES.Admin), patchOneComment)
	.put(protect, role.checkRole(role.ROLES.Admin), putOneComment)
	.delete(protect, role.checkRole(role.ROLES.Admin), deleteOneComment);

/**
 * Get all comments
 */
SarcasmRouter.route("/sarcasm/all").get(getAllComments);

/**
 * Add new comment
 */
SarcasmRouter.route("/sarcasm/add").post(
	protect,
	role.checkRole(role.ROLES.Admin),
	addNewComment
);

export default SarcasmRouter;
