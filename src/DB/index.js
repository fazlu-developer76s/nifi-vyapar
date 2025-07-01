import mongoose from "mongoose";
const mongodbConnection = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export { mongodbConnection };
