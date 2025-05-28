import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/db/schema";
import { SignJWT } from "jose";

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET!;

// Convert JWT_SECRET to Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET);

if (!JWT_SECRET) {
  throw new Error("Please define the JWT_SECRET environment variable");
}

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get request body
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Debug log: print the entire raw user document
    console.log("Raw user from DB:", user);

    console.log("Found user:", {
      id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    }); // Debug log

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email first" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token using jose
    const token = await new SignJWT({
      userId: user._id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // Prepare user response
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    console.log("Sending user response:", userResponse);
    console.log("Raw user document properties:", Object.keys(user));
    console.log("User document role value:", user.role);
    console.log("User document role type:", typeof user.role);

    // Set cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userResponse,
      },
      { status: 200 }
    );

    // Log the exact response being sent
    console.log("Full API response:", {
      message: "Login successful",
      user: userResponse,
    });

    // Set cookie with more permissive settings for development
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from 'strict' to 'lax' for development
      path: "/", // Explicitly set path to root
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Log cookie details
    console.log("Setting auth cookie:", {
      name: "token",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    // Log response headers
    console.log("Response headers:", {
      cookies: response.cookies.getAll(),
      headers: Object.fromEntries(response.headers.entries()),
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
