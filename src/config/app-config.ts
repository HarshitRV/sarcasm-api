import { envSchema } from "../common/common.types.js";

const env = envSchema.parse(process.env);

export const appConfig = {
    env
}