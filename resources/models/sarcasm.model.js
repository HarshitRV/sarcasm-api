import mongoose from "mongoose";
import {
    User
} from "./user.model.js";
import catchAsync from "../utils/catchAsync.js";

const SarcasmSchema = new mongoose.Schema({
    sno: {
        type: Number,
        required: true,
        unique: true
    },
    comment: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    schema_version: {
        type: Number,
        default: 1 // Increment when there's a change in schema.
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
});

SarcasmSchema.post('findOneDelete', catchAsync(
    async function (comment) {
        const user = await User.findById(comment.added_by);
        user.comments_added.pull(comment._id);
        await user.save();
    }
))

const Sarcasm = mongoose.model("sarcasm", SarcasmSchema);

export {
    Sarcasm
};