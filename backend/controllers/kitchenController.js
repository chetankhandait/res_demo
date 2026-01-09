const { OrderItem, MenuItem, Order, Table } = require('../models');
const queueManager = require('../services/queueManager');

exports.getQueue = async (req, res) => {
  const { station_id } = req.params;
  
  // Map station ID to category (or store this in QueueManager)
  const stationCategoryMap = {
    'S-001': 'south_indian',
    'S-002': 'chinese',
    'S-003': 'cocktails'
  };
  
  const category = stationCategoryMap[station_id];
  if (!category) {
    return res.status(400).json({ error: 'Invalid station ID' });
  }

  // Return in-memory queue from manager
  const queue = queueManager.queues[category] || [];
  res.json(queue);
};

exports.startItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await OrderItem.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.status = 'preparing';
    item.started_at = new Date();
    await item.save();

    // Trigger queue re-optimization or updates
    // For simplicity, just notifying updates
    const category = (await item.getMenuItem()).category;
    // queueManager.emitQueueUpdate(category); // Might need to trigger update

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to start item' });
  }
};

exports.completeItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await OrderItem.findByPk(id, { include: [Order] });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.status = 'ready'; // or 'served'
    item.completed_at = new Date();
    await item.save();

    // Remove from active queue
    const menuItem = await item.getMenuItem();
    queueManager.removeItem(item.id, menuItem.category);

    // Check if whole order is ready
    const order = item.Order;
    const remainingItems = await OrderItem.count({
      where: {
        order_id: order.order_id,
        status: ['queued', 'preparing']
      }
    });

    if (remainingItems === 0) {
      order.order_status = 'ready';
      await order.save();
      
      const io = req.app.get('io');
      io.to(`table-${order.table_id}`).emit('order-ready', {
         order_id: order.order_id,
         message: 'Your order is ready!'
      });
      io.to('manager').emit('order-completed', {
          order_id: order.order_id,
          table_id: order.table_id
      });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to complete item' });
  }
};

exports.getStats = async (req, res) => {
    try {
        const stats = [];
        const map = {
            'south_indian': { id: 'S-001', name: 'South Indian Station' },
            'chinese': { id: 'S-002', name: 'Chinese Station' },
            'cocktails': { id: 'S-003', name: 'Beverage Bar' }
        };

        for (const [category, queue] of Object.entries(queueManager.queues)) {
             const stationInfo = map[category] || { id: 'UNKNOWN', name: 'Unknown Station' };
             
             // Calculate metrics
             const load = queue.length;
             let avgTime = 10; // Default fallback
             
             if (load > 0) {
                 const totalPrep = queue.reduce((sum, item) => sum + (item.MenuItem?.base_prep_time || 10), 0);
                 avgTime = Math.round(totalPrep / load);
             }

             // Determine Status
             let status = 'Normal';
             if (load > 10) status = 'Overloaded';
             else if (load > 5) status = 'Busy';

             stats.push({
                 id: stationInfo.id,
                 name: stationInfo.name,
                 category,
                 load,
                 avgTime,
                 status
             });
        }
        
        res.json(stats);
    } catch (err) {
        console.error('Stats Error:', err);
        res.status(500).json({ error: 'Failed to fetch kitchen stats' });
    }
};
