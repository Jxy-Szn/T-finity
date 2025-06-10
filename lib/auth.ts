import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface JWTPayload {
  userId: string | { buffer: { [key: string]: number } };
  email: string;
  role: string;
  [key: string]: any;
}

// Helper function to normalize user ID format
function normalizeUserId(
  userId: string | { buffer: { [key: string]: number } }
): string {
  if (typeof userId === "string") return userId;
  if (typeof userId === "object" && "buffer" in userId) {
    return Buffer.from(Object.values(userId.buffer)).toString("hex");
  }
  throw new Error("Invalid user ID format");
}

export async function verifyAuth(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const jwtPayload = payload as unknown as JWTPayload;

    // Normalize userId to string format
    try {
      jwtPayload.userId = normalizeUserId(jwtPayload.userId);
    } catch (error) {
      console.error("Failed to normalize user ID:", error);
      return null;
    }

    return jwtPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      console.log("No token found in cookies");
      return null;
    }

    const session = await verifyAuth(token.value);
    if (!session) {
      console.log("Token verification failed");
      return null;
    }

    console.log("Session verified successfully:", {
      userId: session.userId,
      email: session.email,
      role: session.role,
    });

    return session;
  } catch (error) {
    console.error("Session check failed:", error);
    return null;
  }
}
