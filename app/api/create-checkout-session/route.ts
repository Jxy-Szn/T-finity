import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const { orderId, items, shipping, customerInfo } = await req.json();

    // Validate input data (optional but recommended)
    if (
      !orderId ||
      !items ||
      items.length === 0 ||
      !shipping ||
      !customerInfo
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total amount on the server to prevent tampering
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const totalWithShipping = totalAmount + shipping.price;

    // Create line items for Stripe
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd", // Ensure currency is consistent
        product_data: {
          name: item.name,
          images: item.images || [], // Ensure images is an array
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/unsuccessful`,
      customer_email: customerInfo.email,
      metadata: {
        orderId: String(orderId),
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        items: JSON.stringify(items),
        shipping: JSON.stringify(shipping),
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: Math.round(shipping.price * 100),
              currency: "usd",
            },
            display_name: shipping.name,
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value:
                  shipping.id === "standard"
                    ? 3
                    : shipping.id === "express"
                      ? 1
                      : 1,
              },
              maximum: {
                unit: "business_day",
                value:
                  shipping.id === "standard"
                    ? 5
                    : shipping.id === "express"
                      ? 2
                      : 1,
              },
            },
          },
        },
      ],
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
