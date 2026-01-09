const { OrderItem, MenuItem, Order, Table } = require('../models');
const { calculatePriority } = require('./priorityCalculator');

class QueueManager {
  constructor() {
    this.queues = {
      'south_indian': [],
      'chinese': [],
      'cocktails': []
    };
    this.io = null;
  }

  setSocketIo(io) {
    this.io = io;
  }

  // Load active queues from DB on startup
  async loadActiveQueues() {
    try {
      const activeItems = await OrderItem.findAll({
        where: {
          status: ['queued', 'preparing']
        },
        include: [
          { model: MenuItem, attributes: ['name', 'base_prep_time', 'category'] },
          { model: Order, include: [Table] }
        ]
      });

      // Clear queues
      this.queues = { 'south_indian': [], 'chinese': [], 'cocktails': [] };

      // Populate
      activeItems.forEach(item => {
        const category = item.MenuItem?.category;
        if (this.queues[category]) {
          this.queues[category].push(item);
        }
      });

      console.log('Queues loaded from DB');
    } catch (err) {
      console.error('Failed to load queues:', err);
    }
  }

  async addItem(orderItem, order, menuItem, table) {
    const category = menuItem.category;
    if (!this.queues[category]) return;

    // Calculate initial priority
    const priority = calculatePriority(orderItem, order, menuItem, table);
    
    // Update DB
    orderItem.priority_score = priority;
    orderItem.chef_station_id = this.getStationIdForCategory(category);
    await orderItem.save();

    // Add to memory
    // Fetch fresh instance with associations to be safe
    const freshItem = await OrderItem.findByPk(orderItem.id, {
        include: [{ model: MenuItem }, { model: Order, include: [Table] }]
    });
    
    this.queues[category].push(freshItem);
    
    // Sort
    this.sortQueue(category);

    // Emit result
    this.emitQueueUpdate(category);
  }

  removeItem(itemId, category) {
    if (!this.queues[category]) return;
    
    this.queues[category] = this.queues[category].filter(i => i.id !== itemId);
    this.emitQueueUpdate(category);
  }

  getStationIdForCategory(category) {
    const map = {
      'south_indian': 'S-001',
      'chinese': 'S-002',
      'cocktails': 'S-003'
    };
    return map[category];
  }

  sortQueue(category) {
    if (!this.queues[category]) return;
    // Sort by priority DESC
    this.queues[category].sort((a, b) => b.priority_score - a.priority_score);
  }

  emitQueueUpdate(category) {
    if (!this.io) return;
    const stationId = this.getStationIdForCategory(category);
    this.io.to(`station-${stationId}`).emit('queue-updated', {
      queue: this.queues[category]
    });
  }

  // Periodic re-optimization
  async reoptimizeQueues() {
    console.log('Re-optimizing queues...');
    for (const category of Object.keys(this.queues)) {
      const queue = this.queues[category];
      if (queue.length === 0) continue;

      for (const item of queue) {
         // Re-calculate
         // We need order, menuItem, table associated
         // Only recalculate for queued items, not preparing ones maybe?
         // Requirement implies dynamic priority based on wait time.
         if(item.status === 'queued') {
             const priority = calculatePriority(item, item.Order, item.MenuItem, item.Order.Table);
             item.priority_score = priority;
             // We generally batch update DB later or update now
         }
      }
      
      this.sortQueue(category);
      this.emitQueueUpdate(category);
      
      // Bulk update DB logic could go here to sync priority scores
    }
  }
}

const queueManager = new QueueManager();
module.exports = queueManager;
