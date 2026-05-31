const { body } = require('express-validator');

const createCategoryRules = [
  body('name').notEmpty().withMessage('Category name is required'),
];

const updateCategoryRules = [
  body('name').optional().notEmpty().withMessage('Category name cannot be empty'),
];

module.exports = {
  createCategoryRules,
  updateCategoryRules
};
