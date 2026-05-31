const { body } = require('express-validator');

const createProductRules = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isDecimal().withMessage('Valid price is required'),
  body('category_id').isInt().withMessage('Valid category ID is required'),
];

const updateProductRules = [
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('price').optional().isDecimal().withMessage('Valid price is required'),
  body('category_id').optional().isInt().withMessage('Valid category ID is required'),
];

module.exports = {
  createProductRules,
  updateProductRules
};
