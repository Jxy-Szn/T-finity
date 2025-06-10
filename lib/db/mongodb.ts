import mongoose from "mongoose";

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      retryReads: true,
    });

    isConnected = true;
    console.log(
      `MongoDB connected successfully to database: ${conn.connection.db.databaseName}`
    );

    // Log connection state
    console.log("Connection state:", mongoose.connection.readyState);
    console.log(
      "Connected collections:",
      (await mongoose.connection.db.collections())
        .map((c) => c.collectionName)
        .join(", ")
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    isConnected = false;
    throw error;
  }

  // Add connection event listeners
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
    isConnected = false;
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
    isConnected = false;
  });
}

export default connectDB;
