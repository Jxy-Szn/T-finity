import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/db/schema";
import mongoose from "mongoose";

interface SessionPayload {
  userId: string | { buffer: { [key: string]: number } };
  email: string;
  role: string;
}

export async function GET() {
  try {
    const session = (await getSession()) as SessionPayload | null;

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectDB();

    // Convert userId to string if it's a buffer object
    const userIdString =
      typeof session.userId === "object" && "buffer" in session.userId
        ? Buffer.from(Object.values(session.userId.buffer)).toString("hex")
        : session.userId;
    // Convert hex string to ObjectId
    const userId = new mongoose.Types.ObjectId(userIdString);

    // Get complete user data from database
    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found for ID:", userIdString);
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
  }
}
