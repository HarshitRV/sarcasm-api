import mongoose, { Schema, SchemaOptions } from "mongoose";
import { ROLES, IUser, USER_MODEL } from "./user.model.types.js";
import bcrypt from 'bcryptjs';
import { SARCASM_MODEL } from "../sarcasm/sarcasm.model.types.js";

const userSchemaOptions: SchemaOptions = { toJSON: { virtuals: true }, timestamps: true };

const userSchema: Schema<IUser> = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: ROLES.USER,
        enum: [...Object.values(ROLES)],
    },
    otp: {
        type: String,
        trim: true
    },
}, userSchemaOptions);


/**
 * Before saving hash and salt the password if it has been modified.
 */
userSchema.pre<IUser>('save', async function (next) {
    try {
        const salt = bcrypt.genSaltSync();

        if (this.isModified('password')) {
            this.password = bcrypt.hashSync(this.password, salt);
        }

        if (this.otp && this.isModified('otp')) {
            this.otp = bcrypt.hashSync(this.otp, salt);
        }

        next();
    } catch (err) {
        next(err as mongoose.CallbackError);
    }
});

/**  Compare the hashed password with the password provided */
userSchema.methods.checkPassword = function (password: string): boolean {
    return bcrypt.compareSync(password, this.password);
}

/** Compare the hashed otp with the otp provided */
userSchema.methods.checkOTP = function (otp: string): boolean {
    return bcrypt.compareSync(otp, this.otp);
}

userSchema.virtual('added_comments', {
    ref: SARCASM_MODEL,
    localField: '_id',
    foreignField: 'user',
});

const User = mongoose.model(USER_MODEL, userSchema);

export default User;