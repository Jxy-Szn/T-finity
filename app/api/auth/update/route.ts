import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

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

export async function PUT(request: Request) {
  let client: MongoClient | null = null;

  try {
    const session = (await getSession()) as SessionPayload | null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

    const data = await request.json();

    // Connect to MongoDB
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    // Update user in database
    const result = await db
      .collection("users")
      .updateOne({ _id: userId }, { $set: data });

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get updated user data
    const updatedUser = await db.collection("users").findOne({ _id: userId });

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
