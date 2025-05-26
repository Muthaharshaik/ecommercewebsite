const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config()
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User'); 

// Create Order (POST /api/orders)
async function createOrder(req, res) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body.paymentInfo;

    const sign = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate('products.product');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total price
    const totalAmount = cart.products.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Create an order
    const newOrder = new Order({
      user: req.user.id,
      product: cart.products.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      totalAmount,
      shippingAddress: req.body.shippingAddress,
      paymentInfo: {
        id: razorpayPaymentId,
        status: 'Paid'
      },
      paymentMethod: 'Razorpay'
    });

    const savedOrder = await newOrder.save();
    const orderedProducts = [...cart.products];  
    // Fetch user email
    const user = await User.findById(req.user.id);
    if (!user || !user.email) {
      return res.status(400).json({ message: 'User email not found' });
    }
    // Clear the cart
    cart.products = [];
    await cart.save();
    console.log(req.user)

    // Send confirmation email
    const emailHtml = `
      <h2>Order Confirmation</h2>
      <p>Thank you for shopping with us!</p>
      <p><strong>Order ID:</strong> ${savedOrder._id}</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
      <p><strong>Items:</strong></p>
      <ul>
        ${orderedProducts.map(item => `
          <li>${item.product.name} (x${item.quantity}) - ₹${item.product.price * item.quantity}</li>
        `).join('')}
      </ul>
      
    `;

    await sendEmail({
      to: user.email,
      subject: 'Your Order is Confirmed!',
      text: `Order #${savedOrder._id} confirmed. Total: ₹${totalAmount}`,
      html: emailHtml,
    });

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}


//Get Logged-in User's Orders (GET /api/orders)
async function getUserOrders(req,res) {
    try {
       const orders = await Order.findOne({user:req.user.id}).populate('product.product');
       if(!orders) res.status(400).json({message:'Orders are empty'})
       res.status(201).json(orders);
    } catch(error) {
        res.status(500).json({message:'Server Error', error:error.message})
    }
}

//Get All Orders (Admin Only)
async function getAllOrders(req,res) {
    try {
      const orders = await Order.find().populate('user', 'name email').populate('product.product')
      res.status(200).json(orders)
    } catch(error) {
       res.status(500).json({message:'Server Error', error:error.message})
    }
}

//Update Order Status (Admin Only)
async function updateOrderStatus(req,res) {
    try {
       const order = await Order.findById(req.params.id);
       if(!order) {
         return res.status(404).json({message:'Order not found'})
       }
       order.status = req.body.status || order.status
       const updatedOrder = await order.save();
       res.status(200).json(updatedOrder);
    } catch(error) {
       res.status(500).json({message:'Server Error', error:error.message})
    }
}


module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
}