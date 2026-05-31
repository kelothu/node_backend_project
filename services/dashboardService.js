const { User, Product, Order, Category, sequelize } = require('../models/index');
const { Op } = require('sequelize');

const getOverviewStats = async () => {
  const [
    totalUsers,
    totalProducts,
    activeProducts,
    totalOrders,
    orderStats,
    categoryStats,
    lowStockItems
  ] = await Promise.all([
    User.count({ where: { role: 'customer' } }),
    Product.count(),
    Product.count({ where: { is_active: true } }),
    Order.count(),
    Order.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue'],
        [sequelize.fn('AVG', sequelize.col('total_amount')), 'avgOrderValue']
      ],
      raw: true
    }),
    Category.findAll({
      attributes: [
        'name',
        [sequelize.fn('COUNT', sequelize.col('products.id')), 'productCount']
      ],
      include: [{
        model: Product,
        as: 'products',
        attributes: []
      }],
      group: ['Category.id', 'Category.name'],
      raw: true
    }),
    Product.findAll({
      where: {
        quantity: { [Op.lte]: sequelize.col('low_stock_threshold') }
      },
      attributes: ['id', 'name', 'sku', 'quantity', 'low_stock_threshold'],
      limit: 10
    })
  ]);

  return {
    users: { 
      totalCustomers: totalUsers 
    },
    products: { 
      total: totalProducts, 
      active: activeProducts,
      inactive: totalProducts - activeProducts
    },
    orders: { 
      total: totalOrders, 
      revenue: parseFloat(orderStats[0].totalRevenue || 0),
      averageValue: parseFloat(orderStats[0].avgOrderValue || 0)
    },
    categories: categoryStats,
    inventoryAlerts: {
      lowStockCount: lowStockItems.length,
      items: lowStockItems
    }
  };
};

module.exports = {
  getOverviewStats
};
