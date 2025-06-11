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

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = (await getSession()) as SessionPayload | null;
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Only admin can update payment status
    if (session.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to update payment status" },
        { status: 403 }
      );
    }

    await connectDB();
    const { paymentStatus } = await request.json();
    if (!paymentStatus) {
      return NextResponse.json(
        { error: "Missing paymentStatus" },
        { status: 400 }
      );
    }

    const order = (await Order.findByIdAndUpdate(
      params.orderId,
      { paymentStatus },
      { new: true }
    ).lean()) as OrderDocument;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}
