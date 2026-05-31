const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderStatusHistory = sequelize.define('OrderStatusHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
    allowNull: false
  },
  changed_by: {
    type: DataTypes.INTEGER,
    allowNull: true // Can be null if automated
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'order_status_history',
  timestamps: true,
  updatedAt: false, // History is immutable
  underscored: true
});

module.exports = OrderStatusHistory;
