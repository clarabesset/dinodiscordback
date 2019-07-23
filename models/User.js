const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  score: { Number, default: 0 },
  avatar: { type: String, enum: ["img1", "img2"], default: "img1" }
});
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
