const razorpay = require("../config/razorpay");

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
