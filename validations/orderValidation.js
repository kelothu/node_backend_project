const { body } = require('express-validator');

const createOrderRules = [
  body('shipping_address').notEmpty().withMessage('Shipping address is required'),
  body('billing_address').optional().isString(),
  body('notes').optional().isString(),
];

const updateOrderRules = [
  body('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid order status'),
  body('payment_status').optional().isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status'),
];

module.exports = {
  createOrderRules,
  updateOrderRules
};
