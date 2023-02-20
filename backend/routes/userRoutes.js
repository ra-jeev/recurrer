const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../middleware/errorMiddleware');

const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/userController');

const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.get('/me', authenticateUser, asyncHandler(getMe));

module.exports = router;
