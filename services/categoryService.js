const { Category, Product } = require('../models/index.js');

const getAllCategories = async () => {
  return await Category.findAll({
    include: [
      { model: Category, as: 'parent' },
      { model: Category, as: 'children' }
    ]
  });
};

const getCategoryById = async (id) => {
  const category = await Category.findByPk(id, {
    include: [
      { model: Category, as: 'parent' },
      { model: Category, as: 'children' },
      { model: Product, as: 'products' }
    ]
  });
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

const createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};

const updateCategory = async (id, updateData) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new Error('Category not found');
  }
  await category.update(updateData);
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new Error('Category not found');
  }
  await category.destroy();
  return category;
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
