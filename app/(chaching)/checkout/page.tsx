"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/providers/cart-provider";
import { useAuthStore } from "@/lib/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import Lottie from "lottie-react";
import successAnimation from "@/public/animations/success.json";
import errorAnimation from "@/public/animations/error.json";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    items,
    subtotal,
    shipping,
    total,
    discount,
    selectedShippingMethod,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState({
    email: user?.email || "",
    name: user?.name || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order in your backend
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shipping: selectedShippingMethod,
          total,
          customerInfo: formData,
          userId: user?.id,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const { orderId } = await orderResponse.json();

      // Create Stripe checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          items,
          shipping: selectedShippingMethod,
          total,
          customerInfo: formData,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setPaymentStatus("error");
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (paymentStatus === "success") {
    return (
      <div className="container max-w-2xl py-12 text-center">
        <Lottie
          animationData={successAnimation}
          loop={false}
          className="w-64 h-64 mx-auto"
        />
        <h1 className="text-3xl font-bold mt-4">Payment Successful!</h1>
        <p className="text-muted-foreground mt-2">
          Thank you for your purchase. We'll send you an email with your order
          details.
        </p>
        <Button
          className="mt-6"
          onClick={() => {
            clearCart();
            router.push("/orders");
          }}
        >
          View Orders
        </Button>
      </div>
    );
  }

  if (paymentStatus === "error") {
    return (
      <div className="container max-w-2xl py-12 text-center">
        <Lottie
          animationData={errorAnimation}
          loop={false}
          className="w-64 h-64 mx-auto"
        />
        <h1 className="text-3xl font-bold mt-4">Payment Failed</h1>
        <p className="text-muted-foreground mt-2">
          There was an error processing your payment. Please try again.
        </p>
        <Button className="mt-6" onClick={() => setPaymentStatus("idle")}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Checkout Form */}
        <div>
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={loading || items.length === 0}
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
