const { FavoriteProduct, Product } = require('../models');
const { Op } = require('sequelize');

const addToFavorites = async (userId, productId) => {
  const [favorite, created] = await FavoriteProduct.findOrCreate({
    where: { userId, productId },
    defaults: { userId, productId }
  });
  return { favorite, created };
};

const getAllFavorites = async (userId, page = 1, limit = 10, search = '') => {
  const offset = (page - 1) * limit;

  // We want to fetch FavoriteProducts where userId matches, 
  // AND we include the Product data. If 'search' is provided, we filter the Product title!
  const whereClause = { userId };
  const productWhereClause = search ? { name: { [Op.like]: `%${search}%` } } : {};

  const { count, rows } = await FavoriteProduct.findAndCountAll({
    where: whereClause,
    include: [{
      model: Product,
      as: 'product',
      where: productWhereClause
    }],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['createdAt', 'DESC']]
  });

  return {
    totalFavorites: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page, 10),
    favorites: rows
  };
};

const removeFromFavorites = async (userId, productId) => {
  const deletedCount = await FavoriteProduct.destroy({
    where: { userId, productId }
  });
  if (deletedCount === 0) throw new Error('Product is not in your favorites');
  return true;
};

const checkIsFavorite = async (userId, productId) => {
  const favorite = await FavoriteProduct.findOne({
    where: { userId, productId }
  });
  return !!favorite; // returns boolean true/false
};

const getFavoriteCount = async (userId) => {
  const count = await FavoriteProduct.count({
    where: { userId }
  });
  return count;
};

const bulkRemoveFromFavorites = async (userId, productIds) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    throw new Error('Product IDs array cannot be empty');
  }

  const deletedCount = await FavoriteProduct.destroy({
    where: {
      userId,
      productId: { [Op.in]: productIds }
    }
  });
  return deletedCount;
};

module.exports = {
  addToFavorites,
  getAllFavorites,
  removeFromFavorites,
  checkIsFavorite,
  getFavoriteCount,
  bulkRemoveFromFavorites
};
