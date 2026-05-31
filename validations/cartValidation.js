const { body } = require('express-validator');

const addToCartRules = [
  body('product_id')
    .notEmpty().withMessage('Product ID is required')
    .isInt().withMessage('Product ID must be an integer'),
  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

const updateCartRules = [
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

module.exports = {
  addToCartRules,
  updateCartRules
};
