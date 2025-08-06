const mongoose = require("mongoose");

const connectDB = (url) => {
  if (!url) {
    throw new Error(
      "Database connection string is undefined. Check your environment variables."
    );
  }

  mongoose.connect(url, {});
};

module.exports = connectDB;
