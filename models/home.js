const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
  houseName: { type: String, required: true },
  houseAddr: { type: String, required: true },
  houseImg: { type: String, required: true },
  // houseImgId: { type: String },
  houseDesc: String,
  housePrice: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

// homeSchema.pre("findOneAndDelete", async function (next) {
//   const homeId = this.getQuery()._id;
//   await Favourite.deleteMany({ homeId: homeId });
// });

module.exports = mongoose.model("Home", homeSchema);

/**
 * this._id = _id;
    this.houseName = houseName;
    this.houseAddr = houseAddr;
    this.houseImg = houseImg;
    this.houseDesc = houseDesc;
    this.housePrice = housePrice;


    save()
    find()
    findById(homeId)
    deleteById(homeId)
 */
