const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../middleware/errorMiddleware');

const {
  getRecurs,
  createRecur,
  updateRecur,
  deleteRecur,
} = require('../controllers/recurController');

const { authenticateUser } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(authenticateUser, asyncHandler(getRecurs))
  .post(authenticateUser, asyncHandler(createRecur));
router
  .route('/:id')
  .delete(authenticateUser, asyncHandler(deleteRecur))
  .put(authenticateUser, asyncHandler(updateRecur));

module.exports = router;
