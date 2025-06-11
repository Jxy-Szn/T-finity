import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db/mongodb";
import { Order } from "@/lib/db/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerDetails = session.customer_details;
      // Debug log all session and metadata
      console.log(
        "[Stripe Webhook] session:",
        JSON.stringify(session, null, 2)
      );
      console.log("[Stripe Webhook] session.metadata:", session.metadata);
      // Create order in database
      // Fix: Only create order if client_reference_id (userId) is present
      if (session.client_reference_id) {
        try {
          const createdOrder = await Order.create({
            userId: session.client_reference_id,
            items: session.metadata?.items
              ? JSON.parse(session.metadata.items)
              : [],
            shipping: {
              id: session.metadata?.shippingMethod,
              name: session.metadata?.shippingMethod, // Use shipping method name from metadata
              price: Number(session.metadata?.shippingPrice) || 0,
            },
            total: Number(session.metadata?.totalAmount) || 0,
            customerInfo: {
              email: session.customer_email || customerDetails?.email || "",
              name:
                session.metadata?.customerName || customerDetails?.name || "",
              address: customerDetails?.address?.line1 || "",
              city: customerDetails?.address?.city || "",
              state: customerDetails?.address?.state || "",
              zipCode: customerDetails?.address?.postal_code || "",
              phone: customerDetails?.phone || "",
            },
            status: "pending",
            paymentStatus: "paid",
            paymentMethod: "card",
            stripeSessionId: session.id, // Add this line
          });
          console.log("[Stripe Webhook] Order created:", createdOrder);
        } catch (orderError) {
          console.error("[Stripe Webhook] Error creating order:", orderError);
        }
      } else {
        console.error(
          "Stripe session missing client_reference_id (userId). Order not created."
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
