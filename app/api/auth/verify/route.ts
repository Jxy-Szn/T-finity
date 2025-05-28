import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { User, UnverifiedUser } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get request body
    const { email, otp } = await req.json();

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get unverified user data from database
    const unverifiedUser = await UnverifiedUser.findOne({ email });
    if (!unverifiedUser) {
      return NextResponse.json(
        { error: "No verification request found. Please sign up again." },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (new Date() > unverifiedUser.otp.expiresAt) {
      await UnverifiedUser.deleteOne({ email });
      return NextResponse.json(
        { error: "Verification code has expired. Please sign up again." },
        { status: 400 }
      );
    }

    // Verify OTP
    if (unverifiedUser.otp.code !== otp) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Create the user in the database
    const user = await User.create({
      email: unverifiedUser.email,
      name: unverifiedUser.name,
      password: unverifiedUser.password,
      isVerified: true,
    });

    // Remove the unverified user data
    await UnverifiedUser.deleteOne({ email });

    return NextResponse.json(
      { message: "Email verified successfully. You can now log in." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email. Please try again." },
      { status: 500 }
    );
  }
}
