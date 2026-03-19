const express = require('express');
const CategoryController = require('../controllers/categoryController.js');
const isAuthenticated = require('../middleware/auth.js');
const authorize = require('../middleware/role.js');
const validate = require('../middleware/validate.js');
const { createCategoryRules, updateCategoryRules } = require('../validations/categoryValidation.js');

const router = express.Router();

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', CategoryController.getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', CategoryController.getCategoryById);

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private (Admin)
 */
router.post('/', isAuthenticated, authorize('admin'), createCategoryRules, validate, CategoryController.createCategory);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Private (Admin)
 */
router.put('/:id', isAuthenticated, authorize('admin'), updateCategoryRules, validate, CategoryController.updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category
 * @access  Private (Admin)
 */
router.delete('/:id', isAuthenticated, authorize('admin'), CategoryController.deleteCategory);

module.exports = router;
