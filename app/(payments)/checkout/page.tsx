"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the Stripe object on every render.
// This is your publishable key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([
    {
      id: 1,
      name: "Example Product",
      price: 20,
      quantity: 1,
      images: ["/placeholder.jpg"],
    },
    // Add more items here as needed, fetching from your cart or product source
  ]);

  const [shipping, setShipping] = useState({
    id: "standard",
    name: "Standard Shipping",
    price: 5,
  });

  const [customerInfo, setCustomerInfo] = useState({
    name: "Test Customer",
    email: "test@example.com",
    // Add other customer info fields as needed
  });

  // Replace with logic to generate a unique order ID
  const orderId = "ORDER_" + Date.now();

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;

      if (!stripe) {
        console.error("Stripe failed to load");
        return;
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, items, shipping, customerInfo }),
      });

      const session = await response.json();

      if (session.error) {
        console.error(session.error);
        // Handle error, maybe redirect to unsuccessful page or show a message
        window.location.href = "/payments/unsuccessful";
        return;
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        console.error(result.error.message);
        // Handle error, maybe redirect to unsuccessful page or show a message
        window.location.href = "/payments/unsuccessful";
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      window.location.href = "/payments/unsuccessful";
    }
  };

  // You would typically fetch cart items and customer info here
  useEffect(() => {
    // Fetch items, shipping, customerInfo from your state management or backend
  }, []);

  return (
    <div>
      <h1>Checkout</h1>
      {/* Display items, shipping details, etc. */}
      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
}
