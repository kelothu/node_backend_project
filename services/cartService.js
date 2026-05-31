const { CartItem, Product } = require('../models/index');

const getCart = async (userId) => {
  return await CartItem.findAll({
    where: { user_id: userId },
    include: [{ 
      model: Product, 
      as: 'product',
      attributes: ['id', 'name', 'price', 'images', 'sku'] 
    }]
  });
};

const addToCart = async (userId, productId, quantity = 1) => {
  // Check if item already exists in cart
  let cartItem = await CartItem.findOne({
    where: { user_id: userId, product_id: productId }
  });

  if (cartItem) {
    cartItem.quantity += parseInt(quantity);
    await cartItem.save();
  } else {
    cartItem = await CartItem.create({
      user_id: userId,
      product_id: productId,
      quantity
    });
  }
  return cartItem;
};

const updateCartItemQuantity = async (userId, productId, quantity) => {
  const cartItem = await CartItem.findOne({
    where: { user_id: userId, product_id: productId }
  });

  if (!cartItem) {
    throw new Error('Item not found in cart');
  }

  cartItem.quantity = quantity;
  await cartItem.save();
  return cartItem;
};

const removeFromCart = async (userId, productId) => {
  const result = await CartItem.destroy({
    where: { user_id: userId, product_id: productId }
  });

  if (!result) {
    throw new Error('Item not found in cart');
  }
  return result;
};

const clearCart = async (userId) => {
  return await CartItem.destroy({
    where: { user_id: userId }
  });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
};
