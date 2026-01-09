const cron = require('node-cron');
const queueManager = require('./queueManager');
const { Order, OrderItem, MenuItem, Table } = require('../models');
const { Op } = require('sequelize');

const startCronJobs = () => {
    console.log('Starting background jobs...');

    // 1. Re-optimize queues every 3 minutes
    cron.schedule('*/3 * * * *', async () => {
        console.log('[Cron] Re-optimizing queues...');
        await queueManager.reoptimizeQueues();
    });

    // 2. JIT PACING: Release Held Items (Runs every minute)
    cron.schedule('* * * * *', async () => {
        // console.log('[Cron] Checking for held items to release...');
        try {
            const itemsToRelease = await OrderItem.findAll({
                where: {
                    status: 'held',
                    scheduled_start_time: { [Op.lte]: new Date() }
                },
                include: [
                    { model: MenuItem },
                    { model: Order, include: [Table] }
                ]
            });

            if (itemsToRelease.length > 0) {
                console.log(`[JIT Pacing] Releasing ${itemsToRelease.length} items to kitchen.`);
                
                for (const item of itemsToRelease) {
                    item.status = 'queued';
                    await item.save();
                    // Add to Queue Manager
                    await queueManager.addItem(item, item.Order, item.MenuItem, item.Order.Table);
                }
            }
        } catch (err) {
            console.error('[Cron] Error releasing held items:', err);
        }
    });

    // 3. Check for stale orders every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        console.log('[Cron] Checking for stale orders...');
        const staleTime = new Date(Date.now() - 30 * 60 * 1000); // 30 mins ago
        
        const staleOrders = await Order.findAll({
            where: {
                order_status: 'pending',
                createdAt: { [Op.lt]: staleTime }
            }
        });

        if (staleOrders.length > 0) {
            console.log(`[Cron] Found ${staleOrders.length} stale orders.`);
        }
    });
};

module.exports = { startCronJobs };
