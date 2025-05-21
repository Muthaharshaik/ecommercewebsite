const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, logoutUser } = require('../controllers/userController');
const { verifyAuth } = require('../middleware/authMiddleware');
const { verify } = require('jsonwebtoken');

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', verifyAuth, getUserProfile);
router.put('/profile',verifyAuth, updateUserProfile );
router.post('/logout', logoutUser);

module.exports = router;