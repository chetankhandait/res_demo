const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  table_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  payment_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending'
  },
  order_status: {
    type: DataTypes.ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  estimated_completion_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  // indexes: [
  //   {
  //     fields: ['table_id', 'order_status', 'created_at']
  //   }
  // ]
});

module.exports = Order;
