import mongoose from "mongoose";
const Schema = mongoose.Schema;

const voteSchema = new Schema({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
});
const Vote = mongoose.model('Vote', voteSchema);

export default Vote;