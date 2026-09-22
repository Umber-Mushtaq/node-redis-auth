import mongoose from "mongoose";
import { ENV_VARIABLES } from "./constants.js";

export const connectDB = async () => {
  try {
    const connString =
      ENV_VARIABLES.MONGO_URL || "mongodb://localhost:27017/enterprise_app_db";

    await mongoose.connect(connString);
    console.log("MongoDB connected successfully via Mongoose");
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
