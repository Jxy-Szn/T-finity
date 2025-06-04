import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface JWTPayload {
  userId: string | { buffer: { [key: string]: number } };
  email: string;
  role: string;
  [key: string]: any;
}

export async function verifyAuth(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const jwtPayload = payload as unknown as JWTPayload;

    // Ensure userId is a string
    if (
      jwtPayload.userId &&
      typeof jwtPayload.userId === "object" &&
      "buffer" in jwtPayload.userId
    ) {
      const buffer = Buffer.from(Object.values(jwtPayload.userId.buffer));
      jwtPayload.userId = buffer.toString("hex");
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
      return null;
    }

    return await verifyAuth(token.value);
  } catch (error) {
    console.error("Session check failed:", error);
    return null;
  }
}
