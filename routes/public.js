const express = require('express');
const PublicController = require('../controllers/publicController');

const router = express.Router();

/**
 * @swagger
 * /api/public/config:
 *   get:
 *     summary: Get public API configuration (Discovery)
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Configuration metadata retrieved
 */
router.get('/config', PublicController.getPublicConfig);

module.exports = router;
