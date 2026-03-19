const { Review, User, Product } = require('../models/index.js');

const getAllReviews = async () => {
  return await Review.findAll({
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Product, as: 'product' }
    ]
  });
};

const getReviewById = async (id) => {
  const review = await Review.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Product, as: 'product' }
    ]
  });
  if (!review) {
    throw new Error('Review not found');
  }
  return review;
};

const createReview = async (reviewData, userId) => {
  return await Review.create({
    ...reviewData,
    user_id: userId
  });
};

const updateReview = async (id, updateData) => {
  const review = await Review.findByPk(id);
  if (!review) {
    throw new Error('Review not found');
  }
  await review.update(updateData);
  return review;
};

const deleteReview = async (id) => {
  const review = await Review.findByPk(id);
  if (!review) {
    throw new Error('Review not found');
  }
  await review.destroy();
  return review;
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};
