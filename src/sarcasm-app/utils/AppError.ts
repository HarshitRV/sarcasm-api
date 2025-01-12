import { NextFunction, Response, Request } from 'express';
import { AsyncHandler, RequestHandler, StatusCodes } from './utils.types.js';

/**
 * Wraps an async handler function to properly handle errors
 */
export const handleAsyncError = (f: AsyncHandler): RequestHandler => {
    return function (req: Request, res: Response, next: NextFunction): void {
        f(req, res, next).catch(e => next(e));
    };
};

/**
 * Takes multiple async handlers and returns them as individual arguments
 * instead of an array
 */
export function wrapAsyncHandler(
    ...handlers: AsyncHandler[]
): RequestHandler[] {
    return handlers.map(handler => handleAsyncError(handler));
}

export class AppError extends Error {
    public statusCode: StatusCodes;
    public message: string;

    constructor(message: string, statusCode: StatusCodes) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }

    public get errorMessage(): string {
        return this.message;
    }

    public get errorCode(): StatusCodes {
        return this.statusCode;
    }
}
