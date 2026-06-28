const express = require("express");
const PaymentRouter = express.Router();
const paymentController = require("../controller/paymentController");

router.post("/create-order", paymentController.createOrder);

module.exports = PaymentRouter;
