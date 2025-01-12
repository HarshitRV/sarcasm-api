import mongoose from 'mongoose';

export interface ISarcasm extends mongoose.Document {
    comment: string;
    user: mongoose.Types.ObjectId;
}

export const SARCASM_MODEL = 'Sarcasm';
