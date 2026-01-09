const sequelize = require('../config/database');
const Table = require('./Table');
const MenuItem = require('./MenuItem');
const ChefStation = require('./ChefStation');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Associations

// Table <-> Order
Table.hasMany(Order, { foreignKey: 'table_id' });
Order.belongsTo(Table, { foreignKey: 'table_id' });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// OrderItem <-> MenuItem
MenuItem.hasMany(OrderItem, { foreignKey: 'menu_item_id' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'menu_item_id' });

// ChefStation <-> MenuItem
ChefStation.hasMany(MenuItem, { foreignKey: 'chef_station_id' });
MenuItem.belongsTo(ChefStation, { foreignKey: 'chef_station_id' });

// ChefStation <-> OrderItem (for tracking which station an item is assigned to)
ChefStation.hasMany(OrderItem, { foreignKey: 'chef_station_id' });
OrderItem.belongsTo(ChefStation, { foreignKey: 'chef_station_id' });

module.exports = {
  sequelize,
  Table,
  MenuItem,
  ChefStation,
  Order,
  OrderItem
};
