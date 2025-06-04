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
    const signature = headers().get("stripe-signature")!;

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

      // Create order in database
      await Order.create({
        userId: session.client_reference_id,
        items: session.metadata?.items
          ? JSON.parse(session.metadata.items)
          : [],
        shipping: {
          id: session.metadata?.shippingMethod,
          name: session.shipping_options?.[0]?.shipping_rate_data?.display_name,
          price: Number(session.metadata?.shippingPrice) || 0,
        },
        total: Number(session.metadata?.totalAmount) || 0,
        customerInfo: {
          email: session.customer_email,
          name: session.metadata?.customerName,
          address: session.shipping?.address?.line1,
          city: session.shipping?.address?.city,
          state: session.shipping?.address?.state,
          zipCode: session.shipping?.address?.postal_code,
          phone: session.customer_phone,
        },
        status: "pending",
        paymentStatus: "paid",
      });
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
