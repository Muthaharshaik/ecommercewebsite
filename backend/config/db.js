const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
   try {
    await mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ecom-database");
    console.log("Database is connected successfully");
   } catch(error) {
    console.error("Failed to connect Databse", error)
    process.exit(1); //Exit process if the connection fails
   }
}

module.exports = connectDB