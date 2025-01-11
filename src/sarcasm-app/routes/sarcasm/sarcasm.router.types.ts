import { ObjectValues } from "../../utils/type.utils.js";

export const SARCASM_ROUTE = {
    GET_ALL: "/sarcasm/all",
    GET_RANDOM: "/sarcasm/random"
} as const;

export type SarcasmRoute = ObjectValues<typeof SARCASM_ROUTE>;