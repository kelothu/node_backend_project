const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FavoriteProduct = sequelize.define('FavoriteProduct', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  }
}, {
  tableName: 'favorite_products',
  timestamps: true,
});

module.exports = FavoriteProduct;
