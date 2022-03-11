import { config } from "dotenv";
config();
const SECRETS = {
    PORT: process.env.PORT,
    MONGODB_CONNECTION_STRING : process.env.MONGODB_CONNECTION_STRING,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXP: process.env.JWT_EXP,
    PASS_CODE: process.env.PASS_CODE,
    MOGODB_LOCAL_CONNECTION: process.env.MOGODB_LOCAL_CONNECTION,
};
export { SECRETS };
