import mongoose from "mongoose";
import dotenv from "dotenv";
import color from "colors";
import { exit } from "process";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/myapp";


export const connectDB = async () => {

  try {
    const connection = await mongoose.connect(MONGO_URI)
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(color.bgGreen.black(`MongoDB connected on ${url}`));
  } catch (error) {
    console.log(color.bgRed.black(`Error connecting to MongoDB: ${(error as Error).message}`));
    exit(1);
  }

}