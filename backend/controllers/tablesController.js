const { Table } = require('../models');

exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.findAll({
      order: [['table_id', 'ASC']]
    });
    res.json(tables);
  } catch (err) {
    console.error('Error fetching tables:', err);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
};

exports.getTableById = async (req, res) => {
  const { id } = req.params;
  try {
    const table = await Table.findByPk(id);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json(table);
  } catch (err) {
    console.error('Error fetching table:', err);
    res.status(500).json({ error: 'Failed to fetch table' });
  }
};

exports.updateTableStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const table = await Table.findByPk(id);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    table.status = status;
    await table.save();

    // Emit event to manager
    const io = req.app.get('io');
    io.to('manager').emit('table-status-changed', {
      table_id: table.table_id,
      status: table.status
    });

    res.json(table);
  } catch (err) {
    console.error('Error updating table status:', err);
    res.status(500).json({ error: 'Failed to update table status' });
  }
};

exports.freeTable = async (req, res) => {
  const { id } = req.params;
  try {
    const table = await Table.findByPk(id);
    if (!table) return res.status(404).json({ error: 'Table not found' });

    table.status = 'vacant';
    await table.save();

    // Emit event
    const io = req.app.get('io');
    io.to('manager').emit('table-status-changed', {
      table_id: table.table_id,
      status: 'vacant'
    });
    
    // Also notify the table itself to reset if needed
    io.to(`table-${table.table_id}`).emit('session-ended');

    res.json({ message: 'Table freed successfully', table });
  } catch (err) {
    console.error('Error freeing table:', err);
    res.status(500).json({ error: 'Failed to free table' });
  }
};
