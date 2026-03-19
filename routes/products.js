const express = require('express');
const ProductController = require('../controllers/productController.js');
const isAuthenticated = require('../middleware/auth.js');
const authorize = require('../middleware/role.js');
const validate = require('../middleware/validate.js');
const { createProductRules, updateProductRules } = require('../validations/productValidation.js');

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', ProductController.getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', ProductController.getProductById);

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Admin)
 */
router.post('/', isAuthenticated, authorize('admin'), createProductRules, validate, ProductController.createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private (Admin)
 */
router.put('/:id', isAuthenticated, authorize('admin'), updateProductRules, validate, ProductController.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private (Admin)
 */
router.delete('/:id', isAuthenticated, authorize('admin'), ProductController.deleteProduct);

module.exports = router;
