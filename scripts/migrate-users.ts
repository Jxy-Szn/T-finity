import connectDB from "../lib/db/mongodb";
import { User } from "../lib/db/schema";

async function migrateUsers() {
  try {
    await connectDB();
    console.log("Connected to database");

    // Debug log: print out current users (with _id, email, role, and isAdmin if it exists)
    const users = await User.find(
      {},
      { _id: 1, email: 1, role: 1, isAdmin: 1 }
    );
    console.log("Current users (debug):", JSON.stringify(users, null, 2));

    // Update all users
    const result = await User.updateMany({ isAdmin: { $exists: true } }, [
      {
        $set: {
          role: {
            $cond: {
              if: { $eq: ["$isAdmin", true] },
              then: "admin",
              else: "customer",
            },
          },
        },
      },
      {
        $unset: "isAdmin",
      },
    ]);

    console.log(`Updated ${result.modifiedCount} users`);
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

migrateUsers();
