const { Order, OrderItem, MenuItem, Table, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getTodayMetrics = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysOrders = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay]
        },
        order_status: ['completed', 'preparing', 'ready'] // Valid orders
      }
    });

    const totalRevenue = todaysOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    const totalOrders = todaysOrders.length;

    // Occupancy
    const totalTables = await Table.count();
    const occupiedTables = await Table.count({ where: { status: 'occupied' } });

    res.json({
      revenue: totalRevenue.toFixed(2),
      ordersPerDay: totalOrders,
      occupancyRate: ((occupiedTables / totalTables) * 100).toFixed(1)
    });

  } catch (err) {
    console.error('Analytics Error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

exports.getHourlySales = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        const orders = await Order.findAll({
            where: {
                createdAt: { [Op.gte]: startOfDay }
            }
        });

        // Initialize 24h map
        const hoursMap = {};
        for (let i = 10; i <= 22; i++) { // Filter for business hours 10AM-10PM
            const hour = i > 12 ? `${i-12} PM` : `${i} AM`;
            hoursMap[i] = { name: hour, sales: 0 };
        }

        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const hour = date.getHours();
            if (hoursMap[hour]) {
                hoursMap[hour].sales += parseFloat(order.total_amount);
            }
        });

        res.json(Object.values(hoursMap));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch hourly sales' });
    }
};

exports.getPopularCategories = async (req, res) => {
    try {
        const items = await OrderItem.findAll({
            include: [{ model: MenuItem, attributes: ['category'] }]
        });

        const categoryCounts = {};
        items.forEach(item => {
            const cat = item.MenuItem?.category || 'Other';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + item.quantity;
        });

        // Format for Recharts
        const data = Object.entries(categoryCounts).map(([name, value]) => ({
            name: name.replace('_', ' ').toUpperCase(),
            value
        }));

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch popular categories' });
    }
};
