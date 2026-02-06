import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB error", error.message);
  }
};

export default connectDB;
