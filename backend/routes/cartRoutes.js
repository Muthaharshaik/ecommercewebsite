const express = require('express');
const router = express.Router();
const {getCart,addToCart,updateCartProduct,removeFromCart} = require('../controllers/cartControllers');
const { verifyAuth } = require('../middleware/authMiddleware');

router.get('/', verifyAuth, getCart);
router.post('/', verifyAuth, addToCart);
router.put('/', verifyAuth, updateCartProduct);
router.delete('/:productId', verifyAuth, removeFromCart);

module.exports = router;