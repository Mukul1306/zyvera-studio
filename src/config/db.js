const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Database connection failed: ${error.message}`);
    console.warn('[MongoDB Warning] Operating in graceful fallback mode where possible.');
  }
};

module.exports = connectDB;
