"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2 } from "lucide-react";

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderDetails {
  _id: string;
  items: OrderItem[];
  shipping: {
    price: number;
  };
  total: number;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const hasFetchedOrder = useRef(false);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const paymentMethod = searchParams.get("paymentMethod");
    const sessionId = searchParams.get("session_id");

    // Only run once
    if (!hasFetchedOrder.current) {
      hasFetchedOrder.current = true;
      const fetchOrderDetails = async () => {
        try {
          let order = null;
          if (orderId) {
            const response = await fetch(`/api/orders/${orderId}`);
            if (response.ok) {
              const data = await response.json();
              order = data.order;
            } else {
              toast.error("Invalid order");
              return;
            }
          } else if (sessionId) {
            const response = await fetch(`/api/orders/by-session/${sessionId}`);
            if (response.ok) {
              const data = await response.json();
              order = data.order;
            } else {
              toast.error("Invalid Stripe session");
              return;
            }
          } else {
            toast.error("Invalid order");
            return;
          }
          setOrderDetails(order);
          clearCart();
          toast.success("Order placed successfully!");
        } catch (error) {
          console.error("Error fetching order details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetails();
    }
  }, [searchParams, clearCart]);

  if (loading) {
    return (
      <div className="container max-w-2xl py-8 mx-auto flex items-center justify-center min-h-[80vh]">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const paymentMethod = searchParams.get("paymentMethod");

  return (
    <div className="container max-w-2xl py-8 mx-auto flex items-center justify-center min-h-[80vh]">
      <Card className="w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600">
            Order Placed Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-lg text-muted-foreground">
              Thank you for your order. We will process it shortly.
            </p>
            {orderDetails && (
              <p className="text-sm text-muted-foreground">
                Order ID: {orderDetails._id}
              </p>
            )}
          </div>

          {paymentMethod === "cod" && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                Since you chose cash on delivery, please have the exact amount
                ready when the delivery arrives. Payment will be collected upon
                delivery.
              </p>
            </div>
          )}

          {orderDetails && (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="space-y-2">
                  {orderDetails.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${orderDetails.shipping.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>${orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => router.push("/user/orders")}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              View Your Orders
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
