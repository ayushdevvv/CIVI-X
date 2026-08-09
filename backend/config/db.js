import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/civix";
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log(`[Civi-X] MongoDB connected -> ${mongoose.connection.name}`);
  } catch (err) {
    console.error("[Civi-X] MongoDB connection failed:", err.message);
    console.error(
      "[Civi-X] Make sure MongoDB is running locally or set MONGO_URI to an Atlas connection string in backend/.env"
    );
    process.exit(1);
  }
}
