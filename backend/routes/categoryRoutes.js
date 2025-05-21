const express = require('express');
const router = express.Router();
const {createCategory, getAllCategories, getCategoryByName} = require('../controllers/categoryController');
const { verifyAuth, admin } = require('../middleware/authMiddleware');

router.post('/', verifyAuth, admin, createCategory);
router.get('/', getAllCategories);
router.get('/:name', getCategoryByName);

module.exports = router