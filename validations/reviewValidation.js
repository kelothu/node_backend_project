const { body } = require('express-validator');

const createReviewRules = [
  body('product_id').isInt().withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
];

const updateReviewRules = [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
];

module.exports = {
  createReviewRules,
  updateReviewRules
};
