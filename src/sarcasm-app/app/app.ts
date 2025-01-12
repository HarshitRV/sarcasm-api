import express, {
    urlencoded,
    json,
    Request,
    Response,
    Express,
    NextFunction,
} from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ERROR_TYPES } from '../../common/common.types.js';
import { AppError } from '../utils/AppError.js';
import authRouter from '../routes/auth/auth.router.js';
import { APP_ROUTE, AppRoute } from './app.constants.js';
import sarcasmRouter from '../routes/sarcasm/sarcasm.router.js';
import userRouter from '../routes/user/user.router.js';
import { TokenError } from '../controller/auth/jwt.js';

const app: Express = express();

app.use(json());
app.use(
    urlencoded({
        extended: true,
    }),
);
app.use(cors());
app.use(morgan('dev'));

app.use(sarcasmRouter);
app.use(APP_ROUTE.V1, authRouter);
app.use(APP_ROUTE.V1, sarcasmRouter);
app.use(APP_ROUTE.V1, userRouter);

app.route<AppRoute>('/api/v1/status').get((_req: Request, res: Response) => {
    res.status(200).json({
        message: 'Server running',
    });
});

app.all('*', (_req, _res, next) => {
    next(new Error(ERROR_TYPES[404]));
});

app.use(
    async (err: Error, req: Request, res: Response, _next: NextFunction) => {
        console.log(err);

        if (err instanceof AppError) {
            res.status(err.statusCode).json({
                message: err.message,
            });

            return;
        }

        if (err instanceof TokenError) {
            res.status(err.statusCode).json({
                message: 'Unauthorized',
            });

            return;
        }

        if (err.message === ERROR_TYPES[404]) {
            res.status(404).json({
                message: ERROR_TYPES[404],
            });

            return;
        }

        res.status(500).json({
            message: 'Oops! Something went wrong!',
        });
    },
);

export default app;
