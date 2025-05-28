import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendOrderConfirmationEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

function getEstimatedDeliveryDate(shippingMethod: string): string {
  const today = new Date();
  const deliveryDays =
    shippingMethod === "standard" ? 5 : shippingMethod === "express" ? 2 : 1;
  const deliveryDate = new Date(today.setDate(today.getDate() + deliveryDays));
  return deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function POST(req: Request) {
  try {
    const { orderId, items, shipping, total, customerInfo } = await req.json();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.images,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      customer_email: customerInfo.email,
      metadata: {
        orderId,
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB"], // Add more countries as needed
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

    // Calculate order date and estimated delivery
    const orderDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const estimatedDelivery = getEstimatedDeliveryDate(shipping.id);

    // Send order confirmation email
    await sendOrderConfirmationEmail({
      email: customerInfo.email,
      name: customerInfo.name,
      orderId,
      items,
      total,
      shipping,
      orderDate,
      estimatedDelivery,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
