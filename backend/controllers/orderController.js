const { Order, OrderItem, MenuItem, Table } = require('../models');
const queueManager = require('../services/queueManager');

exports.calculateOrder = async (req, res) => {
  const { items } = req.body; // Array of { menu_item_id, quantity }
  try {
    let total = 0;
    const calculatedItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menu_item_id);
      if (menuItem) {
        const itemTotal = parseFloat(menuItem.price) * item.quantity;
        total += itemTotal;
        calculatedItems.push({
          ...menuItem.toJSON(),
          quantity: item.quantity,
          itemTotal
        });
      }
    }

    // Add tax logic here if needed (e.g., +5% GST)
    const tax = total * 0.05;
    const finalTotal = total + tax;

    res.json({
      subtotal: total.toFixed(2),
      tax: tax.toFixed(2),
      total: finalTotal.toFixed(2),
      items: calculatedItems
    });
  } catch (err) {
    console.error('Error calculating order:', err);
    res.status(500).json({ error: 'Calculation failed' });
  }
};

exports.createOrder = async (req, res) => {
  const { table_id, items, payment_id, total_amount } = req.body;
  
  try {
    // 1. Create Order
    const order_id = `ORD-${Date.now()}`;
    const newOrder = await Order.create({
      order_id,
      table_id,
      total_amount,
      payment_id,
      payment_status: 'paid', // Assuming called after payment success
      order_status: 'pending'
    });

    // 2. Update Table Status
    const table = await Table.findByPk(table_id);
    if (table) {
        table.status = 'occupied';
        table.current_order_id = order_id;
        await table.save();
        
        req.app.get('io').to('manager').emit('table-status-changed', {
            table_id,
            status: 'occupied'
        });
    }

    // 3. Create Order Items and Add to Queue
    // 3. JIT PACING LOGIC
    // a. Fetch all menu items first to find the Max Prep Time (The "Anchor")
    const orderItemsData = [];
    let maxPrepTime = 0;

    for (const item of items) {
        const menuItem = await MenuItem.findByPk(item.menu_item_id);
        if (menuItem) {
            maxPrepTime = Math.max(maxPrepTime, menuItem.base_prep_time || 0);
            orderItemsData.push({ ...item, menuItem });
        }
    }

    // b. Create Items with Calculated Delays
    for (const data of orderItemsData) {
        const { menuItem, quantity } = data;
        const itemPrepTime = menuItem.base_prep_time || 0;
        
        // Delay = Anchor Time - Item Time
        // e.g., Pizza (20m) - Soup (5m) = 15m delay for Soup
        const delayMinutes = maxPrepTime - itemPrepTime;
        
        // If delay is significant (> 2 mins), hold it.
        const isHeld = delayMinutes > 2; 
        const status = isHeld ? 'held' : 'queued';
        
        const scheduledTime = new Date(Date.now() + delayMinutes * 60000);

        const orderItem = await OrderItem.create({
            order_id,
            menu_item_id: menuItem.item_id,
            quantity,
            status,
            scheduled_start_time: scheduledTime
        });

        // Only add to Active Queue if it's NOT held
        if (status === 'queued') {
            await queueManager.addItem(orderItem, newOrder, menuItem, table);
        } else {
            console.log(`[JIT Pacing] Holding item ${menuItem.name} for ${delayMinutes} mins.`);
        }
    }
    
    // Notify Manager
    req.app.get('io').to('manager').emit('new-order', { order_id, table_id, total_amount });

    res.status(201).json({ message: 'Order created successfully', order: newOrder });

  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Order creation failed' });
  }
};

exports.getOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  try {
    const order = await Order.findByPk(order_id, {
      include: [{ model: OrderItem, include: [MenuItem] }]
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error fetching order status:', err);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
};

exports.getActiveOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: {
                order_status: ['pending', 'preparing', 'ready']
            },
            include: [Table],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch active orders' });
    }
};
