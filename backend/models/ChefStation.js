const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChefStation = sequelize.define('ChefStation', {
  station_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING, // e.g., 'south_indian', 'chinese', 'cocktails'
    allowNull: false
  }
}, {
  tableName: 'chef_stations',
  timestamps: true
});

module.exports = ChefStation;
