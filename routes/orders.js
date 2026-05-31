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
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for the authenticated user/admin
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched
 */
router.get('/', OrderController.getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details fetched
 */
router.get('/:id', OrderController.getOrderById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order (Checkout)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipping_address:
 *                 type: string
 *               billing_address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order placed successfully
 */
router.post('/', createOrderRules, validate, OrderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update order status (Admin Only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.put('/:id', authorize('admin'), updateOrderRules, validate, OrderController.updateOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order record (Admin Only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order deleted
 */
router.delete('/:id', authorize('admin'), OrderController.deleteOrder);

module.exports = router;
