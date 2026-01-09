const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MenuItem = sequelize.define('MenuItem', {
  item_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.ENUM('south_indian', 'chinese', 'cocktails'),
    allowNull: false
  },
  base_prep_time: {
    type: DataTypes.INTEGER, // in minutes
    defaultValue: 10
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  chef_station_id: {
    type: DataTypes.STRING,
    allowNull: true // Can be null if generic
  }
}, {
  tableName: 'menu_items',
  timestamps: true,
  indexes: [
    {
      fields: ['category', 'is_available']
    }
  ]
});

module.exports = MenuItem;
