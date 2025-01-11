import { NextFunction, Request, Response } from "express";
import { AUTH_CONTROLLER_ERRORS, UserAuthRequestBody, UserAuthSuccessResponse, userAuthSchema } from "./auth.controller.types.js";
import { AppError } from "../../utils/AppError.js";
import User from "../../models/user/user.model.js";
import { IUser } from "../../models/user/user.model.types.js";
import JWT from "./jwt.js";
import { STATUS_CODES } from "../../utils/utils.types.js";
import mongoose from "mongoose";

export default class AuthController {
    private validateRequest = (req: Request): UserAuthRequestBody => {
        const { error, value } = userAuthSchema.validate(req.body);

        if (error) {
            throw new AppError(error.message, STATUS_CODES.BAD_REQUEST);
        }

        return value as UserAuthRequestBody;
    }

    private getJWTSecret = (req?: Request): string => {
        return process.env.JWT_SECRET as string;
    }

    private createAuthToken = (jwt: JWT, userId: string): string => {
        return jwt.create(userId);
    }

    private createSuccessResponse = (authToken: string): UserAuthSuccessResponse => {
        return { authToken };
    }

    private findUserByEmail = async (email: string): Promise<(mongoose.Document<unknown, {}, IUser> & IUser & Required<{
        _id: unknown;
    }> & {
        __v?: number;
    }) | null> => {
        return await User.findOne({ email });
    }

    public registerUser = async (req: Request, res: Response) => {
        const { email, password } = this.validateRequest(req);

        const existingUser = await this.findUserByEmail(email);

        if (existingUser) {
            throw new AppError(AUTH_CONTROLLER_ERRORS.EXISTING_USER, STATUS_CODES.BAD_REQUEST);
        }

        const newUser = new User({ email, password });
        await newUser.save();

        const jwt = new JWT(this.getJWTSecret(req));
        const authToken = this.createAuthToken(jwt, newUser.id);

        res.status(STATUS_CODES.CREATED).json(this.createSuccessResponse(authToken));
    }

    public loginUser = async (req: Request, res: Response) => {
        const { email, password } = this.validateRequest(req);

        const existingUser = await this.findUserByEmail(email);

        if (!existingUser) {
            throw new AppError(AUTH_CONTROLLER_ERRORS.NON_EXISTING_USER, STATUS_CODES.BAD_REQUEST);
        }

        const isCorrectPassword = existingUser.checkPassword(password);

        if (!isCorrectPassword) {
            throw new AppError(AUTH_CONTROLLER_ERRORS.INCORRECT_CREDENTIALS, STATUS_CODES.BAD_REQUEST);
        }

        const jwt = new JWT(this.getJWTSecret(req));
        const authToken = this.createAuthToken(jwt, existingUser.id);

        res.status(STATUS_CODES.CREATED).json(this.createSuccessResponse(authToken));
    }
}