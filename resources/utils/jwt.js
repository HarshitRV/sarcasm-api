import jwt from "jsonwebtoken";

/**
 * Creates a JWT Token based on user._id, secret key and expiration time
 * 
 * @param {object} user 
 * @returns {string} JWT Token  
 */
export const newToken = (user) => {
    return jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXP,
    });
};

/**
 * Verifies JWT token and give out id of the user it belongs to.
 * We can further use the id to find the user and authenticate accordingly.
 * 
 * @param {string} JWT token 
 * @returns {object} payload i.e. user._id 
 */
export const verifyToken = (token) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) return reject(err);
            resolve(payload);
        });
    });