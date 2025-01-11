import { ObjectValues } from "../../utils/type.utils.js";

export const AUTH_ROUTE = {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login"
} as const;

export type AuthRoute = ObjectValues<typeof AUTH_ROUTE>;