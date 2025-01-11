import Joi from "joi";

export interface AddSarcasmRequestBody {
    sarcasm: string;
}

export interface AddSarcasmSuccessResponse {
    sarcasm: string;
}

export interface AddSarcasmErrorResponse {
    hasSimilarSarcasms: boolean;
    similarSarcasms: string[];
}

export const addSarcasmSchema = Joi.object({
    sarcasm: Joi.string().required()
});