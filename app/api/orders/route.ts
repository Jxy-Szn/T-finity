import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import { Order } from "@/lib/db/schema";

interface SessionPayload {
  userId: string;
  email: string;
  role: string;
}

export async function POST(req: Request) {
  try {
    const session = (await getSession()) as SessionPayload | null;
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const data = await req.json();
    console.log("Received order data:", data);

    const { items, shippingMethod, total, customer, paymentMethod } = data;

    // Validate required fields
    if (!items || !shippingMethod || !total || !customer || !paymentMethod) {
      console.error("Missing required fields:", {
        items,
        shippingMethod,
        total,
        customer,
        paymentMethod,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create order
    const order = await Order.create({
      items,
      shipping: {
        id: shippingMethod,
        name:
          shippingMethod === "standard"
            ? "Standard Shipping"
            : "Express Shipping",
        price:
          total -
          items.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
          ),
      },
      total,
      customerInfo: {
        email: customer.email,
        name: customer.name,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
        phone: customer.phone,
      },
      userId: session.userId,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod, // <-- add this line
    });

    console.log("Created order:", order);

    return NextResponse.json({ orderId: order._id.toString() });
  } catch (error) {
    console.error("Order creation error:", error);
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
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in to view orders" },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    let orders;
    if (session.role === "admin") {
      // Admin: fetch all orders
      orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    } else {
      // Customer: fetch only their orders
      orders = await Order.find({ userId: session.userId })
        .sort({ createdAt: -1 })
        .lean();
    }

    return NextResponse.json({
      orders,
      message: "Orders retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch orders",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
