const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const productController = require('../controllers/productController');
const isAdmin = require('../middleware/adminMiddleware');
const csvUpload = require('../middleware/csvUpload');

// All /api/admin routes require admin authentication
router.use(isAdmin);

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get top-level platform statistics (Admin Only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics fetched
 */
router.get('/dashboard', dashboardController.getOverview);

/**
 * @swagger
 * /api/admin/products/export:
 *   get:
 *     summary: Export all products to CSV (Admin Only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A CSV file containing all products
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/products/export', productController.exportProducts);

/**
 * @swagger
 * /api/admin/products/import:
 *   post:
 *     summary: Import products via CSV (Admin Only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Products imported successfully
 */
router.post('/products/import', csvUpload.single('file'), productController.importProducts);

/**
 * @swagger
 * /api/admin/products/export/pdf:
 *   get:
 *     summary: Export all products to PDF (Admin Only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A PDF file containing all products
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/products/export/pdf', productController.exportProductsPDF);

module.exports = router;
