import mongoose from "mongoose";
const Schema = mongoose.Schema;
const commentSchema = new Schema(
    {
        title: { type: String, required: false },
        body: { type: String, required: true },
        author: { type: String, required: true },
        parentID: { type: String, required: false },
        rootID: { type: String, required: false },
        postedAt: { type: Date, default: Date.now },
        keywords: { type: String, required: false },
        reference: { type: String, required: false },
        community: { type: String, required: false },
        introduce: { type: String, required: false }
    }
)
const Comment = mongoose.model('Comment', commentSchema);

export default Comment;