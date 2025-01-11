import { ObjectValues } from "../../utils/type.utils.js";

export const USER_ROUTE = {
    ADD_SARCASM: "/user/sarcasm/add",
} as const;

export type UserRoute = ObjectValues<typeof USER_ROUTE>;