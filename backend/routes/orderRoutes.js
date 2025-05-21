const express = require('express');
const router = express.Router();
const {createOrder,getUserOrders,getAllOrders,updateOrderStatus} = require('../controllers/orderControllers');
const { verifyAuth, admin } = require('../middleware/authMiddleware');

router.post('/', verifyAuth, createOrder);
router.get('/', verifyAuth, getUserOrders);
router.get('/all', verifyAuth, admin, getAllOrders);
router.put('/:id/status', verifyAuth, admin, updateOrderStatus);

module.exports = router;
