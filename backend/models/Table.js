const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Table = sequelize.define('Table', {
  table_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 4
  },
  location_x: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  location_y: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('vacant', 'ordering', 'occupied', 'cleaning'),
    defaultValue: 'vacant'
  },
  current_order_id: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'tables',
  timestamps: true
});

module.exports = Table;
