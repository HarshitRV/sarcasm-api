import { Response, NextFunction, Request } from 'express';
import { IUser } from '../../models/user/user.model.types.js';
import { AppError } from '../../utils/AppError.js';
import User from '../../models/user/user.model.js';
import JWT from '../../controller/auth/jwt.js';
import { ERROR_CODES } from '../../../common/common.types.js';

export default async function protect(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const JWT_SECRET = process.env.JWT_SECRET as string;

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        throw new AppError(
            'Unauthorized',
            401,
            ERROR_CODES.AUTH_TOKEN_NOT_FOUND,
        );
    }

    const jwt = new JWT(JWT_SECRET);

    const { userId } = await jwt.verify(token);

    const user: IUser | null = await User.findById(userId);

    if (!user) {
        throw new AppError('Unauthorized', 401, ERROR_CODES.USER_NOT_FOUND);
    }

    req.user = user;

    next();
}
