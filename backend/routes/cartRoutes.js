const express = require('express');
const router = express.Router();
const {getCart,addToCart,updateCartProduct,removeFromCart} = require('../controllers/cartControllers');
const { checkAuth  } = require('../middleware/authMiddleware');

//optional auth
router.use(checkAuth)
router.get('/',  getCart);
router.post('/',  addToCart);
router.put('/',  updateCartProduct);
router.delete('/:productId',  removeFromCart);

module.exports = router;