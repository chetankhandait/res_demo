const { sequelize, Table, ChefStation, MenuItem } = require('./models');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // WARNING: This drops tables!
    console.log('Database synced.');

    // 1. Seed Chef Stations
    const stations = await ChefStation.bulkCreate([
      { station_id: 'S-001', name: 'South Indian Chef', category: 'south_indian' },
      { station_id: 'S-002', name: 'Chinese Chef', category: 'chinese' },
      { station_id: 'S-003', name: 'Bar Manager', category: 'cocktails' }
    ]);
    console.log('Chef Stations seeded.');

    // 2. Seed Tables (20 tables)
    const tables = [];
    for (let i = 1; i <= 20; i++) {
      tables.push({
        table_id: `T-${String(i).padStart(3, '0')}`,
        capacity: i % 2 === 0 ? 4 : 2,
        location_x: (i * 20) % 100,
        location_y: Math.floor(i / 5) * 20
      });
    }
    await Table.bulkCreate(tables);
    console.log('Tables seeded.');

    // 3. Seed Menu Items
    const menuItems = [
      // South Indian
      { item_id: 'M-001', name: 'Masala Dosa', category: 'south_indian', price: 120, chef_station_id: 'S-001', base_prep_time: 15, is_available: true, description: 'Crispy rice crepe filled with potato masala', image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80' },
      { item_id: 'M-002', name: 'Idli Sambar', category: 'south_indian', price: 80, chef_station_id: 'S-001', base_prep_time: 10, is_available: true, description: 'Steamed rice cakes with lentil stew', image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80' },
      { item_id: 'M-003', name: 'Medu Vada', category: 'south_indian', price: 90, chef_station_id: 'S-001', base_prep_time: 12, is_available: true, description: 'Fried lentil donuts', image_url: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80' },
      
      // Chinese
      { item_id: 'M-011', name: 'Hakka Noodles', category: 'chinese', price: 180, chef_station_id: 'S-002', base_prep_time: 12, is_available: true, description: 'Stir fried noodles with veggies', image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80' },
      { item_id: 'M-012', name: 'Gobi Manchurian', category: 'chinese', price: 160, chef_station_id: 'S-002', base_prep_time: 15, is_available: true, description: 'Cauliflower fritters in spicy sauce', image_url: 'https://images.unsplash.com/photo-1625660458150-112f872d9371?w=800&q=80' }, // General asian food
      { item_id: 'M-013', name: 'Schezwan Fried Rice', category: 'chinese', price: 200, chef_station_id: 'S-002', base_prep_time: 15, is_available: true, description: 'Spicy fried rice', image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?w=800&q=80' },

      // Cocktails
      { item_id: 'M-021', name: 'Mojito', category: 'cocktails', price: 350, chef_station_id: 'S-003', base_prep_time: 5, is_available: true, description: 'Refreshing mint and lime cocktail', image_url: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80' },
      { item_id: 'M-022', name: 'Cosmopolitan', category: 'cocktails', price: 400, chef_station_id: 'S-003', base_prep_time: 8, is_available: true, description: 'Vodka cranberry cocktail', image_url: 'https://images.unsplash.com/photo-1596131495914-7389a933f25c?w=800&q=80' }
    ];
    await MenuItem.bulkCreate(menuItems);
    console.log('Menu Items seeded.');

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', JSON.stringify(err, null, 2));
    process.exit(1);
  }
};

seedDatabase();
