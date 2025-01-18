import { Request, Response } from 'express';
import {
    AddSarcasmErrorResponse,
    AddSarcasmRequestBody,
    addSarcasmSchema,
    AddSarcasmSuccessResponse,
} from './user.controller.types.js';
import { AppError } from '../../utils/AppError.js';
import { STATUS_CODES } from '../../utils/utils.types.js';
import Sarcasm from '../../models/sarcasm/sarcasm.model.js';
import SarcasmSimilarityChecker from '../../utils/SarcasmSimilarityChecker.js';
import { ERROR_CODES } from '../../../common/common.types.js';

export default class UserController {
    private sarcasmSimilarityChecker: SarcasmSimilarityChecker;

    constructor() {
        this.sarcasmSimilarityChecker = new SarcasmSimilarityChecker({
            similarityMethod: 'cosine',
        });
    }

    private validateRequest = (req: Request) => {
        const { error, value } = addSarcasmSchema.validate(req.body);

        if (error) {
            throw new AppError(
                error.message,
                STATUS_CODES.BAD_REQUEST,
                ERROR_CODES.BAD_REQUEST,
            );
        }

        return value as AddSarcasmRequestBody;
    };

    private addSarcasticCommentResponse = ({
        success,
        requestBody,
        similarSarcasms,
    }: {
        success: boolean;
        requestBody: AddSarcasmRequestBody;
        similarSarcasms: string[];
    }): AddSarcasmSuccessResponse | AddSarcasmErrorResponse => {
        if (success) {
            return { sarcasm: requestBody.sarcasm };
        }

        return {
            hasSimilarSarcasms: true,
            similarSarcasms,
            code: ERROR_CODES.DUPLICATE_SARCASM,
        };
    };

    addSarcasticComment = async (req: Request, res: Response) => {
        const { sarcasm } = this.validateRequest(req);

        const newSarcasm = new Sarcasm({
            sarcasm,
        });

        const allSarcasms = await Sarcasm.find({});
        const sarcasms: string[] = allSarcasms.map(
            sarcasm => sarcasm.sarcasm as unknown as string,
        );

        const { hasSimilarSarcasms, similarSarcasms } =
            this.sarcasmSimilarityChecker.checkSimilarSarcasms(
                sarcasm,
                sarcasms,
            );

        if (hasSimilarSarcasms) {
            res.status(STATUS_CODES.BAD_REQUEST).json(
                this.addSarcasticCommentResponse({
                    success: false,
                    requestBody: req.body,
                    similarSarcasms,
                }),
            );

            return;
        }

        await newSarcasm.save();

        res.status(STATUS_CODES.CREATED).json(
            this.addSarcasticCommentResponse({
                success: true,
                requestBody: req.body,
                similarSarcasms,
            }),
        );
    };
}
