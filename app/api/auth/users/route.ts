import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/db/schema";

export async function GET() {
  try {
    await connectDB();
    // Find all users and exclude sensitive fields
    const users = await User.find(
      {},
      {
        password: 0, // Exclude password
        otp: 0, // Exclude OTP
      }
    );

    return NextResponse.json(
      {
        count: users.length,
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
