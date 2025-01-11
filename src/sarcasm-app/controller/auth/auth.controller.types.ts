import { JwtPayload } from "jsonwebtoken";
import Joi from "joi";

export const AUTH_CONTROLLER_ERRORS = {
    EXISTING_USER: "user already exists",
    NON_EXISTING_USER: "user does not exists",
    INCORRECT_CREDENTIALS: "incorrect credentials entered"
} as const

export type AuthControllerErrors = typeof AUTH_CONTROLLER_ERRORS[keyof typeof AUTH_CONTROLLER_ERRORS];

export interface UserAuthRequestBody {
    email: string;
    password: string;
}

export interface UserAuthSuccessResponse {
    authToken: string;
}

export const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{12,})"
);

export const userAuthSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordRegex).required(),
});

export interface TokenPayload extends JwtPayload {
    userId: string;
}

export const JWT_EXPIRY = {
    ONE_DAY: "1d",
    ONE_WEEK: "7d",
    ONE_MONTH: "30d",
    ONE_YEAR: "365d"
} as const;

export type jwtExpiry = typeof JWT_EXPIRY[keyof typeof JWT_EXPIRY];