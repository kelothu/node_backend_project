const { body } = require('express-validator');

const createOrderRules = [
  body('order_number').notEmpty().withMessage('Order number is required'),
  body('total_amount').isDecimal().withMessage('Valid total amount is required'),
  body('shipping_address').notEmpty().withMessage('Shipping address is required'),
];

const updateOrderRules = [
  body('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid order status'),
  body('payment_status').optional().isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status'),
];

module.exports = {
  createOrderRules,
  updateOrderRules
};
