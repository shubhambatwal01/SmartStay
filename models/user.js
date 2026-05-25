const mongoose = require("mongoose");

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
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Home" }],
});

module.exports = mongoose.model("User", userSchema);
