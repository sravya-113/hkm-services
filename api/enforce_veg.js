const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const MenuItem = require('./src/models/MenuItem');

async function enforceVeg() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGO_URI or MONGODB_URI not found in env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    const result = await MenuItem.updateMany({}, { $set: { isVeg: true } });
    console.log(`Updated ${result.modifiedCount} items to be Vegetarian.`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error enforcing veg policy:', err);
    process.exit(1);
  }
}

enforceVeg();
