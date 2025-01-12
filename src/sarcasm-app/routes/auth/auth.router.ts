import { Router } from 'express';
import { AuthRoute } from './auth.router.types.js';
import AuthController from '../../controller/auth/auth.controller.js';
import { attachDatabase } from '../../middlewares/utils.ts/middlewares.utils.js';

const authRouter = Router();
const authController = new AuthController();

authRouter
    .route<AuthRoute>('/auth/register')
    .post(...attachDatabase(authController.registerUser));
authRouter
    .route<AuthRoute>('/auth/login')
    .post(...attachDatabase(authController.loginUser));
authRouter
    .route<AuthRoute>('/auth/reset-password-data')
    .post(...attachDatabase(authController.getResetPasswordData));
authRouter
    .route<AuthRoute>('/auth/reset-password')
    .post(...attachDatabase(authController.resetPassword));

export default authRouter;
