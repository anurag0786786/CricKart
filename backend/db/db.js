const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);

    console.log("database connected");
  } catch (err) {
    console.log("database error", err);
    process.exit(1);
  }
};

module.exports = connectDB;
