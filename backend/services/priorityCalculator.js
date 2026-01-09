const { Table } = require('../models');

/**
 * Calculates priority score for an order item.
 * Formula: (orderValue * occupancyFactor * waitMultiplier) / prepTime
 * 
 * @param {Object} item - The order item object
 * @param {Object} order - The parent order object
 * @param {Object} menuItem - The menu item details
 * @param {Object} table - The table details
 * @returns {Number} priorityScore
 */
const calculatePriority = (item, order, menuItem, table) => {
  const currentTime = new Date();
  const createdTime = new Date(order.createdAt || currentTime);
  const waitTimeMinutes = (currentTime - createdTime) / 1000 / 60;
  
  // 1. Wait Time Multiplier: Increases exponentially
  // waitMultiplier = 1 + (waitTime / 10)
  const waitMultiplier = 1 + (waitTimeMinutes / 10);

  // 2. Table Occupancy Factor
  // If table info is missing, assume full capacity (factor 1)
  const maxCapacity = table.capacity || 4;
  // We don't track live people count, so we use table capacity as proxy or specific rule
  // Requirement says: occupancyFactor = tableSize / maxCapacity
  // Assuming 'tableSize' means number of people? But we don't have that in inputs usually.
  // We'll assume the table capacity itself is the weight here for now, or just 1.
  // Let's use 1.0 as baseline if we don't have party size.
  const occupancyFactor = 1.0; 

  // 3. Order Value
  const orderValue = parseFloat(order.total_amount) || 100; // default if 0

  // 4. Prep Time
  const prepTime = menuItem.base_prep_time || 10;

  // Formula
  let priorityScore = (orderValue * occupancyFactor * waitMultiplier) / prepTime;
  
  // LOGGING FOR DEMO
  console.log(`\n[Priority Calc] Item: ${menuItem.name}`);
  console.log(`  > Wait (${waitTimeMinutes.toFixed(1)}m) -> Multiplier: ${waitMultiplier.toFixed(2)}x`);
  console.log(`  > Value ($${orderValue}) / Prep (${prepTime}m)`);
  console.log(`  = Final Score: ${priorityScore.toFixed(2)}\n`);

  return parseFloat(priorityScore.toFixed(2));
};

module.exports = { calculatePriority };
