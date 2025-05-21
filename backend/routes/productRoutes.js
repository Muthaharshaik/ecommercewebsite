const express = require('express');
const router = express.Router();
const {getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct} = require('../controllers/productController');
const { verifyAuth, admin } = require('../middleware/authMiddleware');

router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin (requires token + admin)
router.post('/', verifyAuth, admin, createProduct);
router.put('/:id', verifyAuth, admin, updateProduct);
router.delete('/:id', verifyAuth, admin, deleteProduct);

module.exports = router