import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;

interface SessionPayload {
  userId: {
    buffer: {
      [key: string]: number;
    };
  };
  email: string;
  role: string;
}

export async function POST(request: Request) {
  let client: MongoClient | null = null;

  try {
    const session = (await getSession()) as SessionPayload | null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current password and new password are required" },
        { status: 400 }
      );
    }

    // Convert userId to ObjectId (support both string and legacy buffer)
    let userId: ObjectId;
    if (typeof session.userId === "string") {
      userId = new ObjectId(session.userId);
    } else if (
      session.userId &&
      typeof session.userId === "object" &&
      "buffer" in session.userId
    ) {
      userId = new ObjectId(Buffer.from(Object.values(session.userId.buffer)));
    } else {
      return NextResponse.json(
        { message: "Invalid user ID in session" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    // Get user from database
    const user = await db.collection("users").findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await db
      .collection("users")
      .updateOne({ _id: userId }, { $set: { password: hashedPassword } });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { message: "Error updating password" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
