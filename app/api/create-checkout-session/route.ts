import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: Request) {
  try {
    const { items, shipping, customerInfo } = await req.json();

    // Validate input data
    if (!items || items.length === 0 || !shipping || !customerInfo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const totalWithShipping = totalAmount + shipping.price;

    // Create line items for Stripe
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.images || [],
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/unsuccessful`,
      customer_email: customerInfo.email,
      client_reference_id: customerInfo.userId,
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        shippingMethod: shipping.id,
        shippingPrice: shipping.price.toString(),
        itemCount: items.length.toString(),
        totalAmount: totalWithShipping.toString(),
        items: JSON.stringify(items),
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
                value: shipping.id === "standard" ? 3 : 1,
              },
              maximum: {
                unit: "business_day",
                value: shipping.id === "standard" ? 5 : 2,
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
