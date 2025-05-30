"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Thank you for your purchase. Your order has been confirmed and will
            be processed shortly.
          </p>
          <div className="space-y-2 text-muted-foreground">
            <p className="text-center">What happens next?</p>
            <ul className="list-disc list-inside space-y-2">
              <li>You will receive an order confirmation email</li>
              <li>Your order will be processed within 24 hours</li>
              <li>You can track your order status in your account</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2 pt-4">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full"
            >
              View Order Status
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
