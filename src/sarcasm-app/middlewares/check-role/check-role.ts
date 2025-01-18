import { Roles } from '../../models/user/user.model.types.js';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';
import { ERROR_CODES } from '../../../common/common.types.js';

export default function checkRole(role: Roles) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            throw new AppError('Bad Request', 400, ERROR_CODES.USER_NOT_FOUND);
        }

        const hasRole = user.role === role;

        if (!hasRole) {
            throw new AppError(
                'Unauthorized',
                401,
                ERROR_CODES.MISSING_REQUIRED_ROLE,
            );
        }

        next();
    };
}
