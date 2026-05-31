const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const isAuthenticated = require('../middleware/auth');
const validate = require('../middleware/validate');
const { addToCartRules, updateCartRules } = require('../validations/cartValidation');

// All cart routes require authentication
router.use(isAuthenticated);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current user's shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved
 */
router.get('/', CartController.getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product added to cart
 */
router.post('/', addToCartRules, validate, CartController.addToCart);

/**
 * @swagger
 * /api/cart/{productId}:
 *   put:
 *     summary: Update quantity of a product in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
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
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated
 */
router.put('/:productId', updateCartRules, validate, CartController.updateCartItemQuantity);

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product removed from cart
 */
router.delete('/:productId', CartController.removeFromCart);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear the entire shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
router.delete('/', CartController.clearCart);

module.exports = router;
