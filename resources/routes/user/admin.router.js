import {
    User
} from '../../models/user.model.js';
import {
    newToken
} from '../../utils/jwt.js';
import validator from 'validator';
import catchAsync from '../../utils/catchAsync.js';
/**
 * This function Registers a new user
 * 
 * @param {object} req contains object of data required for registration
 * @param {object} res response object 
 * @returns {undefined}
 */
export const register = catchAsync(async (req, res) => {
    const {
        email,
        firstName,
        lastName,
        password,
    } = req.body;

    let { role } = req.body;
    
    if (!role) {
        role = "ROLE_MEMBER"
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

    const existingUser = await User.findOne({
        email
    }); // Check for email and phoneNumber
    if (existingUser) {
        return res
            .status(400)
            .send({
                error: 'That email address is already in use.'
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
        }
    });
})



/**
 * This login function checks if the user exists, if yes then
 * checks if the password verifies to the hash. If matched provides a JWT Token
 * 
 * @param {object} req contains email/phoneNumber Password
 * @param {object} res response object
 * @returns undefined
 */
export const signin = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).send({
            message: "email and password required"
        });

    const user = await User.findOne({email})
        .exec();
    if (!user) {
        return res.status(200).send({
            status: "failed",
            message: "Email not registered"
        });
    }
    const match = await user.checkPassword(req.body.password);
    if (!match) {
        return res.status(200).send({
            status: "failed",
            message: "Invalid Email or Password"
        });
    }
    const token = newToken(user);
    return res.status(201).send({
        status: "ok",
        token: token,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        }
    });
})