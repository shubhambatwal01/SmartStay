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

// When a user is removed, keep their homes but unset the owner field
userSchema.pre("remove", async function (next) {
  const Home = require("./home");
  try {
    await Home.updateMany({ owner: this._id }, { $unset: { owner: "" } });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
