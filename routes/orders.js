const express = require('express');
const OrderController = require('../controllers/orderController.js');
const isAuthenticated = require('../middleware/auth.js');
const authorize = require('../middleware/role.js');
const validate = require('../middleware/validate.js');
const { createOrderRules, updateOrderRules } = require('../validations/orderValidation.js');

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

/**
 * @route   GET /api/orders
 * @desc    Get all orders for the authenticated user/admin
 * @access  Private
 */
router.get('/', OrderController.getAllOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get('/:id', OrderController.getOrderById);

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post('/', createOrderRules, validate, OrderController.createOrder);

/**
 * @route   PUT /api/orders/:id
 * @desc    Update an order's status
 * @access  Private (Admin)
 */
router.put('/:id', authorize('admin'), updateOrderRules, validate, OrderController.updateOrder);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete an order
 * @access  Private (Admin)
 */
router.delete('/:id', authorize('admin'), OrderController.deleteOrder);

module.exports = router;
