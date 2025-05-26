const Razorpay = require('razorpay');
require('dotenv').config();

const razorpay = new Razorpay ({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
})

//creating razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount,  // Use amount as received from frontend
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
      payment_capture: 1
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createRazorpayOrder
}