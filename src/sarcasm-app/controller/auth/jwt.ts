import jwt from "jsonwebtoken";
import { jwtExpiry, TokenPayload } from "./auth.controller.types.js";
import { STATUS_CODES, StatusCodes } from "../../utils/utils.types.js";

class JWT {
    constructor(
        private readonly jwtSecret: string,
        private readonly jwtExpiry: jwtExpiry = "7d"
    ) { }

    public createUserToken(userId: string): string {
        return jwt.sign({ userId }, this.jwtSecret, {
            expiresIn: this.jwtExpiry
        });
    }

    public createResetPasswordToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiry
        });
    }

    public async verify(token: string): Promise<TokenPayload> {
        try {
            const decoded = await this.decodeToken(token);
            this.validatePayload(decoded);
            return decoded as TokenPayload;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private decodeToken(token: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.jwtSecret, (err, decoded) => {
                if (err) reject(err);
                resolve(decoded);
            });
        });
    }

    private validatePayload(decoded: unknown): void {
        if (!decoded || typeof decoded === 'string') {
            throw new TokenError('Invalid token payload', STATUS_CODES.BAD_REQUEST);
        }

        const payload = decoded as TokenPayload;

        if (!payload.userId) {
            throw new TokenError('Token payload missing user id', STATUS_CODES.BAD_REQUEST);
        }
    }

    private handleError(error: unknown): TokenError {
        if (error instanceof jwt.JsonWebTokenError) {
            return new TokenError(error.message, STATUS_CODES.UNAUTHORIZED);
        }

        if (error instanceof TokenError) {
            return error;
        }

        return new TokenError(
            'Token verification failed',
            STATUS_CODES.INTERNAL_SERVER_ERROR
        );
    }
}

class TokenError extends Error {
    constructor(
        message: string,
        public statusCode: StatusCodes,
        public isOperational: boolean = true
    ) {
        super(message);
        this.name = 'TokenError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export default JWT

export { TokenError }