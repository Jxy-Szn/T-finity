import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import { Order, IOrder } from "@/lib/db/schema";

interface SessionPayload {
  userId: string;
  email: string;
  role: string;
}

interface OrderDocument extends IOrder {
  _id: string;
  __v: number;
}

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = (await getSession()) as SessionPayload | null;
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const order = (await Order.findById(
      params.orderId
    ).lean()) as OrderDocument;
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if the order belongs to the user
    if (order.userId !== session.userId) {
      return NextResponse.json(
        { error: "Not authorized to view this order" },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = (await getSession()) as SessionPayload | null;
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user is admin
    if (session.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to update orders" },
        { status: 403 }
      );
    }

    await connectDB();

    const { status } = await request.json();

    const order = (await Order.findByIdAndUpdate(
      params.orderId,
      { status },
      { new: true }
    ).lean()) as OrderDocument;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
