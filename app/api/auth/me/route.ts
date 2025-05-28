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

export async function GET() {
  let client: MongoClient | null = null;

  try {
    const session = (await getSession()) as SessionPayload | null;

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Convert Buffer to ObjectId
    const userIdBuffer = Buffer.from(Object.values(session.userId.buffer));
    const userId = new ObjectId(userIdBuffer);

    // Connect to MongoDB
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    // Get complete user data from database
    const user = await db.collection("users").findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data without sensitive fields
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
    };

    return NextResponse.json({ user: userResponse });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
