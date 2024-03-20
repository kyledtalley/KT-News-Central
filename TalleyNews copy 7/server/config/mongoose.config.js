import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

async function dbConnect() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("MONGODB_URI is not defined.");
        process.exit(1);
    }
    try {
        await mongoose.connect(uri);
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection error", err);
    }
}

export default dbConnect;
