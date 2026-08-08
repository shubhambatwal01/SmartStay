require("dotenv").config();
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
    console.log("🔄 Payment Verification Started");
    console.log("Request Body:", req.body);
    console.log("Session User:", req.session.user?._id);

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

    // Step 1: Verify Payment Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("💳 Payment Signature Verification:", {
      generated: generatedSignature,
      received: razorpay_signature,
      match: generatedSignature === razorpay_signature,
    });

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Payment Signature",
      });
    }

    // Step 2: Validate user in session
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "User session not found. Please login again.",
      });
    }

    // Step 3: Validate booking dates
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

    // Step 4: Create booking
    console.log("📝 Creating Booking...");
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

    console.log("✓ Booking Created:", booking._id);

    // Step 5: Populate booking with user and home details
    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "fullName email")
      .populate({
        path: "home",
        select: "houseName houseAddr owner",
        populate: { path: "owner", select: "fullName email" },
      });

    console.log("✓ Booking Populated with user and home details");

    // Step 6: Send emails asynchronously (don't block response)
    let emailResult = { success: false, reason: "Emails not sent" };
    try {
      emailResult = await sendBookingEmails(populatedBooking);
      console.log("✓ Email Result:", emailResult);
    } catch (emailError) {
      console.error("❌ Email Error:", {
        message: emailError.message,
        stack: emailError.stack,
      });
      // Continue even if email fails - booking was successful
    }

    // Step 7: Return response with booking + email status
    res.json({
      success: true,
      booking: populatedBooking,
      emailStatus: emailResult,
    });
  } catch (error) {
    console.error("❌ Payment Verification Error:", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
