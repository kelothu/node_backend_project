const { Product, Category } = require('../models/index.js');

const getAllProducts = async () => {
  return await Product.findAll({
    include: [{ model: Category, as: 'category' }]
  });
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
