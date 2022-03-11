import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        validate: (value) => (validator.isAlpha(value))
    },
    lastName: {
        type: String,
        required: true,
        validate: (value) => (validator.isAlpha(value))
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: (value) => (validator.isEmail(value))
    },
    role: {
        type: String,
        default: 'ROLE_MEMBER',
        enum: ['ROLE_MEMBER', 'ROLE_CONTRIBUTOR', 'ROLE_ADMIN']
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        trim: true,
    },
    schema_version: {
        type: Number,
        default: 0 //Increment this everytime there's change in schema
    },
    comments_added: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sarcasm'
    }],
}, {
    timestamps: true
})

/**
 * PRE
 * These funcitons will execute everytime "BEFORE" a document is saved in users collection
 * 
 * @param {string} -  mongoose command
 * @param {function} - middleware anonymous function
 * @returns {funciton} - next method stating return to the call stack
 * 
 * 
 */
UserSchema.pre("save", async function (next) {
    try {
        const hash = await bcrypt.hash(this.password, 8);
        this.password = hash;
        next();
    } catch (err) {
        next(err);
    }
});


/**
 * This function is attached to UserSchema, i.e. Every document would have access to this funciton, where
 * it can validate the password hash using becrypt
 * 
 * @param {string}  user password
 * @returns {Promise} - If does not match, returns rejecton and if matched, resolves the value
 */
UserSchema.methods.checkPassword = function (password) {
    const passwordHash = this.password;
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, passwordHash, (err, same) => {
            if (err) {
                return reject(err);
            }
            resolve(same);
        });
    });
};

export const User = mongoose.model("user", UserSchema);