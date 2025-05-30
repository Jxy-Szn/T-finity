import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/db/schema";

interface SessionPayload {
  userId: {
    buffer: {
      [key: string]: number;
    };
  };
  email: string;
  role: string;
}

export async function POST(req: Request) {
  try {
    const session = (await getSession()) as SessionPayload | null;

    // Check if user is authenticated and is an admin
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    // Connect to database
    await connectDB();

    // Get request body
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get current user status
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't allow toggling the last admin
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot remove the last admin user" },
          { status: 400 }
        );
      }
    }

    // Toggle role between admin and customer
    user.role = user.role === "admin" ? "customer" : "admin";
    await user.save();

    return NextResponse.json({
      message: `User ${user.role === "admin" ? "promoted to admin" : "demoted to customer"} successfully`,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Error toggling user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
