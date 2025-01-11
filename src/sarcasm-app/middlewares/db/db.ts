import { Request, Response, NextFunction } from "express";
import MongoDatabase from "../../mongo-db/MongoDatabase.js";

export async function dbConnection(req: Request, _res: Response, next: NextFunction) {
    const uri = process.env.MONGODB_CONNECTION_STRING as string;
    const db = new MongoDatabase(uri);
    await db.connect();
    req.db = db;
    next();
}