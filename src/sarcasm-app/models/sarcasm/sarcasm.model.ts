import mongoose, { SchemaOptions } from "mongoose";
import { SARCASM_MODEL } from "./sarcasm.model.types.js";
import { USER_MODEL } from "../user/user.model.types.js";

const sarcasmSchemaOptions: SchemaOptions = { toJSON: { virtuals: true }, timestamps: true };

const SarcasmSchema = new mongoose.Schema({
    sarcasm: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_MODEL
    }
}, sarcasmSchemaOptions);


const Sarcasm = mongoose.model(SARCASM_MODEL, SarcasmSchema);

export default Sarcasm;