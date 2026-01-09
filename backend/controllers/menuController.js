const { MenuItem, ChefStation } = require('../models');

exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.findAll({
      where: { is_available: true },
      include: [{ model: ChefStation, attributes: ['name', 'category'] }]
    });
    res.json(items);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
};

exports.getMenuItemsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const items = await MenuItem.findAll({
      where: { 
        category,
        is_available: true
      }
    });
    res.json(items);
  } catch (err) {
    console.error('Error fetching category items:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};
