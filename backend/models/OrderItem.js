const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  menu_item_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  chef_station_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('held', 'queued', 'preparing', 'ready', 'served'),
    defaultValue: 'queued'
  },
  scheduled_start_time: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  priority_score: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'order_items',
  timestamps: true,
  // indexes: [
  //   {
  //     fields: ['chef_station_id', 'status', 'priority_score']
  //   }
  // ]
});

module.exports = OrderItem;
