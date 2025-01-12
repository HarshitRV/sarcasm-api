import { ObjectValues } from '../../utils/type.utils.js';

export const AUTH_ROUTE = {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    RESET_PASSWORD_DATA: '/auth/reset-password-data',
    RESET_PASSWORD: '/auth/reset-password',
    GET_RESET_PASSWORD_PAGE: '/auth/reset-password/:userId/:token',
} as const;

export type AuthRoute = ObjectValues<typeof AUTH_ROUTE>;
