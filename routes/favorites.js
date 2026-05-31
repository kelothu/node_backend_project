const express = require('express');
const FavoriteProductController = require('../controllers/favoriteProductController');
const isAuthenticated = require('../middleware/auth.js');
const validate = require('../middleware/validate');
const { favoriteRules, bulkFavoriteRules } = require('../validations/favoriteValidation');

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add product to favorites
 *     tags: [Favorites]
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
 *     responses:
 *       201:
 *         description: Added to favorites
 */
router.post('/', favoriteRules, validate, FavoriteProductController.addToFavorites);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get all favorite products (Paginated)
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favorites list fetched
 */
router.get('/', FavoriteProductController.getAllFavorites);

/**
 * @swagger
 * /api/favorites/count:
 *   get:
 *     summary: Get total favorite count for user
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorite count fetched
 */
router.get('/count', FavoriteProductController.getFavoriteCount);

/**
 * @swagger
 * /api/favorites/check/{productId}:
 *   get:
 *     summary: Check if a product is in favorites
 *     tags: [Favorites]
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
 *         description: Check result returned
 */
router.get('/check/:productId', FavoriteProductController.checkIsFavorite);

/**
 * @swagger
 * /api/favorites/{productId}:
 *   delete:
 *     summary: Remove product from favorites
 *     tags: [Favorites]
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
 *         description: Removed from favorites
 */
router.delete('/:productId', FavoriteProductController.removeFromFavorites);

/**
 * @swagger
 * /api/favorites/bulk-remove:
 *   post:
 *     summary: Bulk remove products from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Products removed from favorites
 */
router.post('/bulk-remove', bulkFavoriteRules, validate, FavoriteProductController.bulkRemoveFromFavorites);

module.exports = router;
