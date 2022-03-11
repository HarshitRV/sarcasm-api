import {
    Sarcasm
} from "../../models/sarcasm.model.js";
import { User } from "../../models/user.model.js";
import catchAsync from "../../utils/catchAsync.js";
import { ServerError } from "../../utils/ServerError.js";

/**
 * Get one random comment
 */
export const getRandomComment = catchAsync(async (req, res) => {
    const count = await Sarcasm.countDocuments();

    const random = Math.trunc(1 + Math.random() * count);

    const comment = await Sarcasm.findOne({
        sno: random
    });

    res.status(200).send({
        sarcasm: comment._doc.sarcasm
    });

});

/**
 * Get all comments
 */
export const getAllComments = catchAsync(async (req, res) => {
    const comments = await Sarcasm.find({}).populate('added_by', 'firstName');
    res.status(200).send(comments);
})

/**
 * Add new comment
 */
export const addNewComment = catchAsync(async (req, res)=>{
    const { sno, comment } = req.body;
    if(!sno || !comment) throw new ServerError(401, "both sno and comment are required");

    const sarcasm = await Sarcasm.findOne({sno});
    if(sarcasm) throw new ServerError(401, "comment already exists with that sno");

    const _user = req.user;

    if(!_user) throw new ServerError(401, "Login first to add new sarcastic comment");

    const addNewComment = new Sarcasm({
        sno,
        comment,
        added_by: _user._id
    });
    // _user.comments_added.push(addNewComment._id);
    // console.log(_user)
    const user = await User.findById(_user._id);
    user.comments_added.push(addNewComment._id);

    await user.save();
    await addNewComment.save();

    res.status(200).send({
        status: "ok",
        msg: "Successfully added the new sarcastic comment",
        added_by: user.name,
    })
});

/**
 * Delete one comment
 */

export const deleteOneComment = catchAsync(async (req, res)=> {
    const { sno } = req.body;
    if(!sno) throw new ServerError(401, "sno is required");

    const user = req.user;
    if(!user) throw new ServerError(401, "Login first to add new sarcastic comment");

    const deletedComment = await Sarcasm.findOneAndDelete({
        sno: sno
    });

    if(!deletedComment) throw new ServerError(401, "Comment not found");

    res.status(200).send({
        status: "ok",
        msg: "Successfully deleted the comment",
        deleted: deletedComment
    })
})

/**
 * Put one comment
 */
export const putOneComment = catchAsync(async (req, res)=> {
    const { sno, comment } = req.body;
    if(!sno || !comment) throw new ServerError(401, "sno is required");

    const patchedComment = await Sarcasm.findOneAndUpdate({
        sno
    },{
        sno,
        comment
    },
    {
        overwrite: true
    });

    if(!patchedComment) throw new ServerError(401, "Comment not found");

    res.status(200).send({
        status: "ok",
        msg: "Successfully patched the comment",
        patched: patchedComment
    })
})

/**
 * Patch one comment
 */
export const patchOneComment = catchAsync(async (req, res)=> {
    const { sno, comment } = req.body;
    if(!sno || !comment) throw new ServerError(401, "sno and comment is required");

    const putOneComment = await Sarcasm.findOneAndUpdate({
        sno 
    },{
        $set: req.body
    });

    if(!putOneComment) throw new ServerError(401, "Comment not found");

    res.status(200).send({
        status: "ok",
        msg: "Successfully put the comment",
        put: putOneComment
    })
})
