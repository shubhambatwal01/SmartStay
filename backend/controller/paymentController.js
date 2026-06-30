const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Booking = require("../models/bookings");

exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Unable to create order",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      homeId,
      checkIn,
      checkOut,
      guests,
      amount,
    } = req.body;

    console.log("Booking Saved:", booking);

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Payment",
      });
    }
    console.log("Generated:", generatedSignature);
    console.log("Received:", razorpay_signature);

    const booking = await Booking.create({
      user: req.session.user._id,
      home: homeId,
      checkIn,
      checkOut,
      guests,
      amount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    res.status(200).json({
      success: true,
      message: "Booking confirmed",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
