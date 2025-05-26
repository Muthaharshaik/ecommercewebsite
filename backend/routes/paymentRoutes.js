const express = require('express');
const router = express.Router();
const { createRazorpayOrder } = require('../controllers/paymentController')
const { verifyAuth, admin } = require('../middleware/authMiddleware');

router.post("/create-order",verifyAuth, createRazorpayOrder);

module.exports = router