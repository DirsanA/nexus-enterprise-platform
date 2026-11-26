import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/usermanagement");
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Notice: We don't exit the process immediately so you can test mock/memory if MongoDB is not running locally yet
    console.warn(" Warning: Running without active MongoDB. Ensure MongoDB service is running to persist data.");
  }
};
