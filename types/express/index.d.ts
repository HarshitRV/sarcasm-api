import { Request } from "express";
import { IUser } from "../../src/sarcasm-app/models/user/user.model.types.ts";
import { CustomRequest } from "../../src/sarcasm-app/utils/utils.types.ts";

declare module "express" {
    export interface Request extends CustomRequest { }
}