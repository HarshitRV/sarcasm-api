import { Request, Response, NextFunction } from "express";
import { ObjectValues } from "./type.utils.js";
import { IUser } from "../models/user/user.model.types.js";
import MongoDatabase from "../mongo-db/MongoDatabase.js";

export interface CustomRequest {
    user?: IUser;
    db?: MongoDatabase;
}

export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;

export const STATUS_CODES = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 401,
    CREATED: 201,
    OK: 200,
} as const;

export type StatusCodes = ObjectValues<typeof STATUS_CODES>;