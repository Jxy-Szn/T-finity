import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import { Order } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectDB();

    // Get request body
    const { items, shipping, total, customerInfo, userId } = await req.json();

    // Validate input
    if (!items || !shipping || !total || !customerInfo || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create order
    const order = await Order.create({
      userId,
      items,
      shipping,
      total,
      customerInfo,
      status: "pending",
      paymentStatus: "pending",
    });

    return NextResponse.json({ orderId: order._id }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectDB();

    // Get user's orders
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
