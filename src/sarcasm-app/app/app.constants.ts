import { ObjectValues } from '../utils/type.utils.js';

export const APP_ROUTE = {
    V1: '/api/v1',
    STATUS: '/api/v1/status',
} as const;

export type AppRoute = ObjectValues<typeof APP_ROUTE>;
