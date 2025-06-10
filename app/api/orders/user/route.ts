import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import { Order } from "@/lib/db/schema";

interface Session {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export async function GET() {
  try {
    // Check authentication
    const session = (await getSession()) as Session | null;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectDB();

    // Fetch user's orders
    const orders = await Order.find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
