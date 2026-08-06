const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Booking = require("../models/bookings");
const User = require("../models/user");
const Home = require("../models/home");
const { sendBookingEmails } = require("../config/emailService");

exports.createOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message:
          "Razorpay is not configured yet. Please set the Razorpay keys.",
      });
    }

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
    console.log("Request Body:", req.body);
    console.log("Session:", req.session);

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

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("Generated:", generatedSignature);
    console.log("Received :", razorpay_signature);

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Payment Signature",
      });
    }

    console.log("User in session:", req.session.user);

    // Validate check-in and check-out dates before creating the booking
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Check-in and check-out dates are required.",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid check-in or check-out date.",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date.",
      });
    }

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

    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "fullName email")
      .populate({
        path: "home",
        select: "houseName houseAddr owner",
        populate: { path: "owner", select: "fullName email" },
      });

    await sendBookingEmails(populatedBooking);

    console.log("Booking Saved:", booking);

    res.json({
      success: true,
      booking: populatedBooking,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
