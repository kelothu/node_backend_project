const { Op } = require('sequelize');
const { Product, Category } = require('../models/index.js');

const getAllProducts = async (filters = {}) => {
  const { 
    search, 
    minPrice, 
    maxPrice, 
    category_id, 
    is_active, 
    sort = 'created_at', 
    order = 'DESC', 
    page = 1, 
    limit = 10 
  } = filters;

  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { sku: { [Op.like]: `%${search}%` } }
    ];
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
  }

  if (category_id) {
    where.category_id = category_id;
  }

  if (is_active !== undefined) {
    where.is_active = is_active === 'true' || is_active === true;
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Product.findAndCountAll({
    where,
    include: [{ model: Category, as: 'category' }],
    order: [[sort, order]],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  return {
    products: rows,
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    limit: parseInt(limit)
  };
};

const getProductById = async (id) => {
  const product = await Product.findByPk(id, {
    include: [{ model: Category, as: 'category' }]
  });
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

const createProduct = async (productData) => {
  return await Product.create(productData);
};

const updateProduct = async (id, updateData) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new Error('Product not found');
  }
  await product.update(updateData);
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new Error('Product not found');
  }
  await product.destroy();
  return product;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
