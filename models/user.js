const mongoose = require("mongoose");
const Favourite = require("./favourites");

const userSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ["user", "admin"],
    required: true,
    default: "user",
  },
});

module.exports = mongoose.model("User", userSchema);
