const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("⚠️  MONGO_URI is not set. Running without a database connection.");
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("📈 MongoDB Connected");
    return true;
  } catch (err) {
    console.error(`MongoDB Connection Failed: ${err.message}`);
    return false;
  }
};

module.exports = connectDB;