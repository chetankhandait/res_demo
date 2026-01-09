const sequelize = require('./config/database');

const debugDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');

    // 1. Check existing columns
    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'order_items';
    `);

    console.log('\n--- Current Columns in [order_items] ---');
    console.table(results);

    const hasColumn = results.some(r => r.column_name === 'scheduled_start_time');

    if (!hasColumn) {
        console.log("\n❌ 'scheduled_start_time' is MISSING. Attempting to force add...");
        try {
            await sequelize.query(`ALTER TABLE "order_items" ADD COLUMN "scheduled_start_time" TIMESTAMP WITH TIME ZONE;`);
            console.log("✅ Column added successfully.");
        } catch (err) {
            console.error("❌ Failed to add column:", err.original || err.message);
        }
    } else {
        console.log("\n✅ 'scheduled_start_time' already exists.");
    }

    // 2. Check Enum
    // This is harder to query directly in generic SQL, but we'll try to just add value again strictly
    try {
        await sequelize.query(`ALTER TYPE "enum_order_items_status" ADD VALUE IF NOT EXISTS 'held';`);
        console.log("✅ Enum 'held' ensured.");
    } catch (e) {
        // Ignore if it fails (likely exists)
    }

  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    process.exit();
  }
};

debugDatabase();
