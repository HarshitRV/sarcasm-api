import mongoose from "mongoose";

export const ROLES = {
    USER: 'ROLE_USER',
    ADMIN: 'ROLE_ADMIN'
} as const;

export type Roles = typeof ROLES[keyof typeof ROLES];

export interface IUser extends mongoose.Document {
    email: string;
    verified: boolean;
    password: string;
    role: Roles;
    otp?: string;
    checkPassword(password: string): boolean;
    checkOTP(otp: string): boolean;
    isModified: (path: string) => boolean;
    added_comments?: mongoose.Types.Array<mongoose.Types.ObjectId>;
}

export const USER_MODEL = "User";