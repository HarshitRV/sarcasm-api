import Sarcasm from "../../models/sarcasm/sarcasm.model.js";
import { Request, Response } from "express";

export default class SarcasmController {
    /** Get one random sarcastic comment */
    getRandomSarcasm = async (_req: Request, res: Response) => {
        const comments = await Sarcasm.find({});

        const random = Math.trunc(Math.random() * comments.length);

        res.status(200).send({
            sarcasm: comments[random]?.sarcasm
        });
    };

    /** Get all sarcastic comments */
    getAllSarcasm = async (_req: Request, res: Response) => {
        const sarcasms = await Sarcasm.find({});
        res.status(200).send(sarcasms);
    }
}