import { Request, Response } from 'express';
import {
    AUTH_CONTROLLER_ERRORS,
    TokenPayload,
    UserAuthRequestBody,
    UserAuthSuccessResponse,
    UserGetResetPasswordLinkRequestBody,
    UserResetPasswordRequestBody,
    UserGetResetPasswordLinkSuccessResponse,
    userAuthSchema,
    userGetResetPasswordLinkSchema,
    userResetPasswordSchema,
    UserResetPasswordSuccessResponse,
} from './auth.controller.types.js';
import { AppError } from '../../utils/AppError.js';
import User from '../../models/user/user.model.js';
import { IUser } from '../../models/user/user.model.types.js';
import JWT from './jwt.js';
import { STATUS_CODES } from '../../utils/utils.types.js';
import mongoose from 'mongoose';
import Joi from 'joi';
import { ERROR_CODES } from '../../../common/common.types.js';

export default class AuthController {
    private validateRequestBody = <ReturnType>(
        req: Request,
        schema: Joi.ObjectSchema,
    ): ReturnType => {
        const { error, value } = schema.validate(req.body);

        if (error) {
            throw new AppError(
                error.message,
                STATUS_CODES.BAD_REQUEST,
                ERROR_CODES.BAD_REQUEST,
            );
        }

        return value as ReturnType;
    };

    private getJWTSecret = (): string => {
        return process.env.JWT_SECRET as string;
    };

    private createAuthToken = (jwt: JWT, userId: string): string => {
        return jwt.createUserToken(userId);
    };

    private createAuthSuccessResponse = (
        authToken: string,
    ): UserAuthSuccessResponse => {
        return { authToken };
    };

    private findUserByEmail = async (
        email: string,
    ): Promise<
        | (mongoose.Document<unknown, {}, IUser> &
              IUser &
              Required<{
                  _id: unknown;
              }> & {
                  __v?: number;
              })
        | null
    > => {
        return await User.findOne({ email });
    };

    private getResetPasswordJWTSecret = (user: IUser) => {
        return this.getJWTSecret() + user.password;
    };

    public registerUser = async (req: Request, res: Response) => {
        const { email, password } =
            this.validateRequestBody<UserAuthRequestBody>(req, userAuthSchema);
        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            throw new AppError(
                AUTH_CONTROLLER_ERRORS.EXISTING_USER,
                STATUS_CODES.BAD_REQUEST,
                ERROR_CODES.DUPLICATE_USER,
            );
        }

        const newUser = new User({ email, password });
        await newUser.save();

        const jwt = new JWT(this.getJWTSecret());
        const authToken = this.createAuthToken(jwt, newUser.id);

        res.status(STATUS_CODES.CREATED).json(
            this.createAuthSuccessResponse(authToken),
        );
    };

    public loginUser = async (req: Request, res: Response) => {
        const { email, password } =
            this.validateRequestBody<UserAuthRequestBody>(req, userAuthSchema);
        const existingUser = await this.findUserByEmail(email);
        if (!existingUser) {
            throw new AppError(
                AUTH_CONTROLLER_ERRORS.NON_EXISTING_USER,
                STATUS_CODES.BAD_REQUEST,
                ERROR_CODES.USER_NOT_FOUND,
            );
        }

        const isCorrectPassword = existingUser.checkPassword(password);
        if (!isCorrectPassword) {
            throw new AppError(
                AUTH_CONTROLLER_ERRORS.INCORRECT_CREDENTIALS,
                STATUS_CODES.BAD_REQUEST,
                ERROR_CODES.INCORRECT_CREDENTIALS,
            );
        }

        const jwt = new JWT(this.getJWTSecret());
        const authToken = this.createAuthToken(jwt, existingUser.id);

        res.status(STATUS_CODES.CREATED).json(
            this.createAuthSuccessResponse(authToken),
        );
    };

    private createGetResetPasswordDataSuccessResponse = (
        userId: string,
        token: string,
    ): UserGetResetPasswordLinkSuccessResponse => {
        return { userId, token };
    };

    public getResetPasswordData = async (req: Request, res: Response) => {
        const { email } =
            this.validateRequestBody<UserGetResetPasswordLinkRequestBody>(
                req,
                userGetResetPasswordLinkSchema,
            );

        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new AppError(
                AUTH_CONTROLLER_ERRORS.NON_EXISTING_USER,
                STATUS_CODES.BAD_REQUEST,
                ERROR_CODES.USER_NOT_FOUND,
            );
        }

        const jwt = new JWT(this.getResetPasswordJWTSecret(user), '15m');
        const payload: TokenPayload = {
            email: user.email,
            userId: user.id,
        };
        const token = jwt.createResetPasswordToken(payload);

        res.status(STATUS_CODES.OK).json(
            this.createGetResetPasswordDataSuccessResponse(user.id, token),
        );
    };

    private createResetPasswordSuccessResponse =
        (): UserResetPasswordSuccessResponse => {
            return { message: 'Password reset successfully' };
        };

    private verifyResetPasswordToken = async (
        user: IUser | null,
        token: string,
    ) => {
        if (!user) {
            throw new AppError(
                AUTH_CONTROLLER_ERRORS.NON_EXISTING_USER,
                STATUS_CODES.BAD_REQUEST,
                ERROR_CODES.USER_NOT_FOUND,
            );
        }

        const secret = this.getResetPasswordJWTSecret(user);
        const jwt = new JWT(secret);
        await jwt.verify(token);

        return user;
    };

    public resetPassword = async (req: Request, res: Response) => {
        const { email, password, token } =
            this.validateRequestBody<UserResetPasswordRequestBody>(
                req,
                userResetPasswordSchema,
            );
        const user = await this.findUserByEmail(email);

        const verifiedUser = await this.verifyResetPasswordToken(user, token);

        verifiedUser.password = password;
        await verifiedUser.save();

        res.status(STATUS_CODES.OK).json(
            this.createResetPasswordSuccessResponse(),
        );
    };
}
