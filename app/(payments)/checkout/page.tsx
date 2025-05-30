"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useCart } from "@/providers/cart-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";

// Initialize Stripe
let stripePromise: Promise<any> | null = null;
const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error("Stripe publishable key is not defined");
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

function CheckoutSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { user, loading, checkAuth } = useAuth();
  const router = useRouter();
  const { items, clearCart, selectedShippingMethod, total } = useCart();
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const authResult = await checkAuth();
        if (!authResult) {
          toast.error("Please create an account first", {
            description: "You need to be logged in to proceed with checkout",
            action: {
              label: "Sign In",
              onClick: () => router.push("/signin"),
            },
            duration: 5000,
            style: {
              background: "#ef4444",
              color: "white",
              border: "none",
            },
          });
          setTimeout(() => {
            router.push("/signin");
          }, 1000);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("Authentication failed", {
          description: "Please try again or contact support",
          duration: 5000,
          style: {
            background: "#ef4444",
            color: "white",
            border: "none",
          },
        });
      } finally {
        setIsChecking(false);
      }
    };
    checkAuthentication();
  }, [checkAuth, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please create an account first", {
        description: "You need to be logged in to proceed with checkout",
        action: {
          label: "Sign In",
          onClick: () => router.push("/signin"),
        },
        duration: 5000,
        style: {
          background: "#ef4444",
          color: "white",
          border: "none",
        },
      });
      setTimeout(() => {
        router.push("/signin");
      }, 1000);
      return;
    }

    try {
      const stripe = await getStripe();
      if (!stripe) throw new Error("Stripe failed to initialize");

      // Create a checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shipping: selectedShippingMethod,
          customerInfo: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
          },
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Failed to process checkout. Please try again.", {
        duration: 5000,
        style: {
          background: "#ef4444",
          color: "white",
          border: "none",
        },
      });
    }
  };

  // Show loading state while checking authentication
  if (loading || isChecking) {
    return <CheckoutSkeleton />;
  }

  // Don't render the checkout form if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(total - selectedShippingMethod.price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(selectedShippingMethod.price)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              {/* Stripe Checkout Button */}
              <Button
                className="w-full mt-6"
                onClick={handleCheckout}
                disabled={!items.length}
              >
                Proceed to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
