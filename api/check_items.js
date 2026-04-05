const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const MenuItem = require('./src/models/MenuItem');

async function check() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    const items = await MenuItem.find({}).limit(5);
    items.forEach(i => console.log(`${i.name}: isVeg=${i.isVeg}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
