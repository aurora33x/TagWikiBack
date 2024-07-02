import mongoose from "mongoose";
var passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  communitiy: { type: Schema.Types.ObjectId, ref: 'Community' }
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

export default User;
