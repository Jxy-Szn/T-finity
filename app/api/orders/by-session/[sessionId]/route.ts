import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { Order } from "@/lib/db/schema";

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    await connectDB();
    if (!sessionId) {
      console.error("[orders/by-session] Missing sessionId param");
      return NextResponse.json(
        { error: "Missing sessionId param" },
        { status: 400 }
      );
    }
    console.log("[orders/by-session] params.sessionId:", params.sessionId);
    const order = await Order.findOne({
      stripeSessionId: sessionId,
    }).lean();
    console.log("[orders/by-session] order found:", order);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error: any) {
    console.error(
      "Error fetching order by sessionId:",
      error && (error.stack || error.message || error)
    );
    return NextResponse.json(
      {
        error: "Failed to fetch order",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
