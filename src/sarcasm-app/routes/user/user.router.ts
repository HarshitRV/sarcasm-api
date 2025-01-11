import { Router } from "express";
import UserController from "../../controller/user/user.controller.js";
import { UserRoute } from "./user.router.types.js";
import { attachDatabase } from "../../middlewares/utils.ts/middlewares.utils.js";
import protect from "../../middlewares/protect/protect.js";
import checkRole from "../../middlewares/check-role/check-role.js";

const userRouter = Router();
const userController = new UserController();

userRouter.route<UserRoute>('/user/sarcasm/add').post(...attachDatabase(protect, checkRole('ROLE_ADMIN'), userController.addSarcasticComment));

export default userRouter;