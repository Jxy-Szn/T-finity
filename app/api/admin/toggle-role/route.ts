import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/db/schema";

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET!;

// Convert JWT_SECRET to Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET);

// Middleware to check if user is admin
async function isAdmin(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as {
      userId: string;
      email: string;
      role: "admin" | "customer";
    };
    return decoded.role === "admin";
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    // Check if user is admin
    if (!(await isAdmin(req))) {
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
