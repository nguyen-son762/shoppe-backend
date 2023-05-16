import { getEnv } from "../utils/env";
import mongoose, { connect, set } from "mongoose";

export const connectDB = async () => {
  // 4. Connect to MongoDB
  try {
    set("strictQuery", false);
    await connect(getEnv("MONGO_DB_URI"), {
      autoIndex: false
    });
    console.log("Connect to database succeed");
  } catch {
    console.log("Connect to database failed");
  }
};
