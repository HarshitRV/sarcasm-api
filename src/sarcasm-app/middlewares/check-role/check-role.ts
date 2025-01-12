import { Roles } from '../../models/user/user.model.types.js';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';

export default function checkRole(role: Roles) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            throw new AppError('Bad Request', 400);
        }

        const hasRole = user.role === role;

        if (!hasRole) {
            throw new AppError('Unauthorized', 401);
        }

        next();
    };
}
