const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  compare_price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING,
    unique: 'unique_product_sku' // Explicitly name the index
  },
  barcode: {
    type: DataTypes.STRING
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  low_stock_threshold: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  images: {
    type: DataTypes.JSON
  },
  specifications: {
    type: DataTypes.JSON
  },
  is_low_stock: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.quantity <= this.low_stock_threshold;
    }
  }
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true
});

module.exports = Product;
