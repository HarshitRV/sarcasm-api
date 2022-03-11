import {
    Router
} from "express";

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
    deleteOneComment
} from "../../controller/sarcasm/sarcasm.controller.js";

const SarcasmRouter = Router();

/**
 * Get one random comment
 */
SarcasmRouter.route('/')
    .get(getRandomComment);

/**
 * Get all comments
 */
SarcasmRouter.route('/all')
    .get(getAllComments);

/**
 * Add new comment
 */
SarcasmRouter.route('/add')
    .post(protect,role.checkRole(role.ROLES.Admin),addNewComment);

/**
 * Patch one comment
 */
SarcasmRouter.route('/patch_one')
    .patch(protect,role.checkRole(role.ROLES.Admin),patchOneComment);

/**
 * Put one comment
 */
SarcasmRouter.route('/put_one')
    .put(protect,role.checkRole(role.ROLES.Admin),putOneComment);

/**
 * Delete one comment
 */
SarcasmRouter.route('/delete_one')
    .delete(protect,role.checkRole(role.ROLES.Admin),deleteOneComment);

export default SarcasmRouter;