import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

async function cleanupUsers() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const users = db.collection("users");

    // Remove unexpected fields
    const result = await users.updateMany(
      {},
      {
        $unset: {
          currentPassword: "",
          newPassword: "",
        },
      }
    );

    console.log(`Modified ${result.modifiedCount} documents`);

    // Verify the cleanup
    const allUsers = await users.find({}).toArray();
    console.log(
      "User documents after cleanup:",
      allUsers.map((user) => ({
        id: user._id,
        email: user.email,
        role: user.role,
        fields: Object.keys(user),
      }))
    );
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

cleanupUsers().catch(console.error);
