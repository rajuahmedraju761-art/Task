const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/taskdb";
  await mongoose.connect(uri);
  console.log("MongoDB connected:", uri);
};

module.exports = connectDB;
