import mongoose from "mongoose";

export const ConnectDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};
