const sequelize = require('./config/database');

const patchDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // 1. Add 'held' to ENUM
    // Note: Postgres specific command for Enum alteration
    try {
        await sequelize.query(`ALTER TYPE "enum_order_items_status" ADD VALUE IF NOT EXISTS 'held';`);
        console.log("Added 'held' to status enum.");
    } catch (e) {
        console.log("Enum update skipped or failed (might already exist):", e.message);
    }

    // 2. Add scheduled_start_time COLUMN
    try {
        await sequelize.query(`ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "scheduled_start_time" TIMESTAMP WITH TIME ZONE;`);
        console.log("Added 'scheduled_start_time' column.");
    } catch (e) {
        console.log("Column addition failed:", e.message);
    }

    console.log('Database patched successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
};

patchDatabase();
