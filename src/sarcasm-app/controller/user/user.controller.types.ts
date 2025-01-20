import Joi from 'joi';
import { ERROR_CODES } from '../../../common/common.types.js';

export interface AddSarcasmRequestBody {
    sarcasm: string;
    override?: boolean;
}

export interface AddSarcasmSuccessResponse {
    sarcasm: string;
}

export interface AddSarcasmErrorResponse {
    hasSimilarSarcasms: boolean;
    similarSarcasms: string[];
    code: typeof ERROR_CODES.DUPLICATE_SARCASM;
}

export const addSarcasmSchema = Joi.object({
    sarcasm: Joi.string().required(),
    override: Joi.boolean().optional(),
});
