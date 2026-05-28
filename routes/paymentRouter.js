const express = require("express");
const router = express.Router();
const razorpay = require("../utils/razorpay");

router.post("/create-order", async (req, res) => {
  const amount = req.body.amount * 100; // Razorpay uses paisa

  const options = {
    amount: amount,
    currency: "INR",
    receipt: "order_rcptid_" + Date.now(),
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating order");
  }
});

module.exports = router;
