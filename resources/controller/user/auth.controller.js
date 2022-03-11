import {
    SECRETS
} from "../../configs/config";
import {
    User
} from "../../models/user.model.js";

/**
 * This function Registers a new user
 * 
 * @param {object} req contains object of data required for registration
 * @param {object} res response object 
 * @returns {undefined}
 */
export const register = wrapAsync(async (req, res) => {
    const {
        email,
        firstName,
        lastName,
        password,
        role
    } = req.body;

    const {
        pass_code
    } = req.params;

    /**
     * Default role is member
     */
    if (!role) {
        role = "ROLE_MEMBER"
    }

    /**
     * If registering as admin, check if pass_code is correct
     */
    if (role === 'ROLE_ADMIN') {
        if (pass_code !== SECRETS.PASS_CODE) {
            throw new CustomError(401, "Invalid pass_code, you are not authorized to register as admin");
        }
    }

    if (!email) {
        return res
            .status(400)
            .send({
                error: 'You must enter an email address.'
            });
    }
    if (!firstName || !lastName) {
        return res.status(400).send({
            error: 'You must enter your full name.'
        });
    }
    if (!password) {
        return res.status(400).send({
            error: 'You must enter a password.'
        });
    }

    /**
     * Check if user already registered
     */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res
            .status(400)
            .send({
                error: 'That email is already in use.'
            });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).send({
            error: 'Invalid email'
        });
    }

    if (!validator.isAlpha(firstName)) {
        return res.status(400).send({
            error: 'Invalid First Name'
        });
    }

    if (!validator.isAlpha(lastName)) {
        return res.status(400).send({
            error: 'Invalid Last Name'
        });
    }

    const user = new User({
        email,
        password,
        firstName,
        lastName,
        role
    });

    const registeredUser = await user.save();

    const token = newToken(registeredUser);

    res.status(200).send({
        success: true,
        token: `${token}`,
        user: {
            id: registeredUser.id,
            firstName: registeredUser.firstName,
            lastName: registeredUser.lastName,
            email: registeredUser.email,
            role: registeredUser.role,
            phoneNumber: registeredUser.phoneNumber
        }
    });
})