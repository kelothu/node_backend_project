const { body } = require('express-validator');

const favoriteRules = [
  body('product_id')
    .notEmpty().withMessage('Product ID is required')
    .isInt().withMessage('Product ID must be an integer')
];

const bulkFavoriteRules = [
  body('product_ids')
    .isArray({ min: 1 }).withMessage('Product IDs must be a non-empty array')
];

module.exports = {
  favoriteRules,
  bulkFavoriteRules
};
