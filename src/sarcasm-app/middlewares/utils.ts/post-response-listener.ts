import { Request, Response, NextFunction } from "express";

export async function postResponseListener(req: Request, res: Response, next: NextFunction) {
    res.on("finish", async () => {
        if (req.db) {
            await req.db.disconnect();
        }
    })

    next();
}