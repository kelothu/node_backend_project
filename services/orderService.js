const { Order, User } = require('../models/index.js');

const getAllOrders = async () => {
  return await Order.findAll({
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }]
  });
};

const getOrderById = async (id) => {
  const order = await Order.findByPk(id, {
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }]
  });
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
};

const createOrder = async (orderData, userId) => {
  return await Order.create({
    ...orderData,
    user_id: userId
  });
};

const updateOrder = async (id, updateData) => {
  const order = await Order.findByPk(id);
  if (!order) {
    throw new Error('Order not found');
  }
  await order.update(updateData);
  return order;
};

const deleteOrder = async (id) => {
  const order = await Order.findByPk(id);
  if (!order) {
    throw new Error('Order not found');
  }
  await order.destroy();
  return order;
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
