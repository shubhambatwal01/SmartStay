const express = require("express");
const PaymentRouter = express.Router();
const razorpay = require("../utils/razorpay");

router.post("/create-order", paymentController.createOrder);

module.exports = PaymentRouter;
