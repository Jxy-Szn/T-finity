import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;

interface SessionPayload {
  userId: string;
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

    // Connect to MongoDB
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    // Convert hex string to ObjectId
    const userId = new ObjectId(session.userId);

    // Get complete user data from database
    const user = await db.collection("users").findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data without sensitive fields
    const userResponse = {
      id: user._id.toString(),
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
