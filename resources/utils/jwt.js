import jwt from "jsonwebtoken";
import {
    SECRETS
} from "../configs/config.js";

/**
 * This function create a JWT Token based on user._id, secret key and expiration time
 * 
 * @param {object} user 
 * @returns {string} JWT Token  
 */
export const newToken = (user) => {
    return jwt.sign({
        id: user._id
    }, SECRETS.JWT_SECRET, {
        expiresIn: SECRETS.JWT_EXP,
    });
};

/**
 * This function varifies JWT token and give out id of the user it belongs to.
 * We can further use the id to find the user and authenticate accordingly.
 * 
 * @param {string} JWT token 
 * @returns {object} payload i.e. user._id 
 */
export const verifyToken = (token) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, SECRETS.JWT_SECRET, (err, payload) => {
            if (err) return reject(err);
            resolve(payload);
        });
    });