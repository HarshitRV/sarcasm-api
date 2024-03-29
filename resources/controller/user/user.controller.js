import catchAsync from "../../utils/catchAsync.js";
import { ServerError } from "../../utils/ServerError.js";

/**
 * Find all the users and send them in response object
 * 
 * @param {Object} req object 
 * @param {Object} res array of objects of user data
 * 
 */
export const getAllUsers = catchAsync(async(req,res) =>{
    const model = req.model;
    const {limit, startIndex } = req.paginationParams;
    const users = await model.find()
        .limit(limit)
        .skip(startIndex)
        .select("-password")
        .exec();
    if (!users) throw new ServerError(404, "Users not found")
    res.status(200).send({success :true , data : users})

})