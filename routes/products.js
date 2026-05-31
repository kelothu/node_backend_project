const express = require('express');
const ProductController = require('../controllers/productController.js');
const isAuthenticated = require('../middleware/auth.js');
const authorize = require('../middleware/role.js');
const validate = require('../middleware/validate.js');
const { createProductRules, updateProductRules } = require('../validations/productValidation.js');

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or description
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of products fetched
 */
router.get('/', ProductController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product fetched
 *       404:
 *         description: Product not found
 */
router.get('/:id', ProductController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin Only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               compare_price:
 *                 type: number
 *               category_id:
 *                 type: integer
 *               sku:
 *                 type: string
 *               barcode:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *               is_featured:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               specifications:
 *                 type: object
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', isAuthenticated, authorize('admin'), createProductRules, validate, ProductController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (Admin Only)
 *     tags: [Products]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               compare_price:
 *                 type: number
 *               category_id:
 *                 type: integer
 *               sku:
 *                 type: string
 *               barcode:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *               is_featured:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               specifications:
 *                 type: object
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put('/:id', isAuthenticated, authorize('admin'), updateProductRules, validate, ProductController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin Only)
 *     tags: [Products]
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
 *         description: Product deleted
 */
router.delete('/:id', isAuthenticated, authorize('admin'), ProductController.deleteProduct);

module.exports = router;
