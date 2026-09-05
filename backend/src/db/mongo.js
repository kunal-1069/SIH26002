const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://root:root_password@localhost:27017/sih_db?authSource=admin';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectMongo;
