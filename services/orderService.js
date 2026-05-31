const { Order, User, OrderItem, Product, CartItem, sequelize } = require('../models/index.js');

const getAllOrders = async (userId, isAdmin = false) => {
  const where = isAdmin ? {} : { user_id: userId };
  return await Order.findAll({
    where,
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { 
        model: OrderItem, 
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'sku'] }]
      }
    ],
    order: [['created_at', 'DESC']]
  });
};

const getOrderById = async (id, userId, isAdmin = false) => {
  const where = { id };
  if (!isAdmin) where.user_id = userId;

  const order = await Order.findOne({
    where,
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { 
        model: OrderItem, 
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'images'] }]
      },
      {
        model: OrderStatusHistory,
        as: 'statusHistory',
        include: [{ model: User, as: 'actor', attributes: ['id', 'name'] }]
      }
    ],
    order: [[{ model: OrderStatusHistory, as: 'statusHistory' }, 'createdAt', 'DESC']]
  });

  if (!order) {
    throw new Error('Order not found');
  }
  return order;
};

const createOrder = async (orderData, userId) => {
  const { shipping_address, billing_address, notes } = orderData;

  // 1. Fetch Cart Items
  const cartItems = await CartItem.findAll({
    where: { user_id: userId },
    include: [{ model: Product, as: 'product' }]
  });

  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cannot checkout with an empty cart');
  }

  // 2. Calculate Total and Prepare Order Items
  let totalAmount = 0;
  const orderItemsData = cartItems.map(item => {
    const itemTotal = parseFloat(item.product.price) * item.quantity;
    totalAmount += itemTotal;
    return {
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price // Price snapshot
    };
  });

  // 3. Use a transaction for atomic order creation
  const t = await sequelize.transaction();

  try {
    // Generate a unique order number (simple format for now)
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create Order
    const order = await Order.create({
      user_id: userId,
      order_number: orderNumber,
      total_amount: totalAmount,
      shipping_address,
      billing_address: billing_address || shipping_address,
      notes,
      status: 'pending',
      payment_status: 'pending'
    }, { transaction: t });

    // Create Order Status History (Initial)
    await OrderStatusHistory.create({
      order_id: order.id,
      status: 'pending',
      changed_by: userId,
      notes: 'Order placed successfully'
    }, { transaction: t });

    // Create Order Items
    const itemsWithOrderId = orderItemsData.map(item => ({ ...item, order_id: order.id }));
    await OrderItem.bulkCreate(itemsWithOrderId, { transaction: t });

    // 4. Clear Cart
    await CartItem.destroy({ where: { user_id: userId }, transaction: t });

    await t.commit();
    return order;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const updateOrder = async (id, updateData, userId) => {
  const order = await Order.findByPk(id);
  if (!order) {
    throw new Error('Order not found');
  }

  const oldStatus = order.status;
  const newStatus = updateData.status;

  const t = await sequelize.transaction();
  try {
    await order.update(updateData, { transaction: t });

    // Record history if status changed
    if (newStatus && newStatus !== oldStatus) {
      await OrderStatusHistory.create({
        order_id: order.id,
        status: newStatus,
        changed_by: userId,
        notes: updateData.notes || `Status updated from ${oldStatus} to ${newStatus}`
      }, { transaction: t });
    }

    await t.commit();
    return order;
  } catch (error) {
    await t.rollback();
    throw error;
  }
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
