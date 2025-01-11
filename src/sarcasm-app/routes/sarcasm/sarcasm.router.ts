import { Router } from "express";
import SarcasmController from "../../controller/sarcasm/sarcasm.controller.js";
import { SarcasmRoute } from "./sarcasm.router.types.js";
import { attachDatabase } from "../../middlewares/utils.ts/middlewares.utils.js";

const sarcasmController = new SarcasmController();
const sarcasmRouter = Router();

sarcasmRouter.route<SarcasmRoute>('/sarcasm/all').get(...attachDatabase(sarcasmController.getAllSarcasm));
sarcasmRouter.route<SarcasmRoute>('/sarcasm/random').get(...attachDatabase(sarcasmController.getRandomSarcasm));

export default sarcasmRouter;