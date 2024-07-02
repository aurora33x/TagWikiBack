import mongoose from "mongoose";
const Schema = mongoose.Schema;


const communitySchema = new Schema({
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    intro: { type: String, required: false },
    memberId: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
    posts: [{ type: String, required: false }]
}, {
    timestamps: {}
});
const Community = mongoose.model('Community', communitySchema);

export { Community };
