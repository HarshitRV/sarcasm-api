import { JwtPayload } from 'jsonwebtoken';
import Joi from 'joi';

export const AUTH_CONTROLLER_ERRORS = {
    EXISTING_USER: 'user already exists',
    NON_EXISTING_USER: 'user does not exists',
    INCORRECT_CREDENTIALS: 'incorrect credentials entered',
} as const;

export type AuthControllerErrors =
    (typeof AUTH_CONTROLLER_ERRORS)[keyof typeof AUTH_CONTROLLER_ERRORS];

export interface UserAuthRequestBody {
    email: string;
    password: string;
}

export interface UserAuthSuccessResponse {
    authToken: string;
}

export interface UserGetResetPasswordLinkRequestBody {
    email: string;
}

export interface UserGetResetPasswordPageParams {
    token: string;
    userId: string;
}

export interface UserResetPasswordRequestBody {
    email: string;
    password: string;
    confirmPassword: string;
    token: string;
}

export interface UserGetResetPasswordLinkSuccessResponse {
    userId: string;
    token: string;
}

export interface UserResetPasswordSuccessResponse {
    message: string;
}

export const passwordRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{12,})',
);

export const userAuthSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordRegex).required(),
});

export const userGetResetPasswordLinkSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const userGetResetPasswordPageParamsSchema = Joi.object({
    token: Joi.string().required(),
    userId: Joi.string().required(),
});

export const userResetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordRegex).required(),
    confirmPassword: Joi.ref('password'),
    token: Joi.string().required(),
});

export interface TokenPayload extends JwtPayload {
    userId: string;
    email?: string;
}

export const JWT_EXPIRY = {
    ONE_DAY: '1d',
    ONE_WEEK: '7d',
    ONE_MONTH: '30d',
    ONE_YEAR: '365d',
    FIVE_MINUTES: '5m',
    FIVE_SECONDS: '5s',
    FIFTEEN_MINUTES: '15m',
} as const;

export type jwtExpiry = (typeof JWT_EXPIRY)[keyof typeof JWT_EXPIRY];
