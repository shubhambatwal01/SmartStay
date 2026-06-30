const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    home: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      required: true,
    },
    checkIn: Date,
    checkOut: Date,
    guests: Number,
    amount: Number,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
