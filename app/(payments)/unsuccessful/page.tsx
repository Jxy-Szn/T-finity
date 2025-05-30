"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export default function UnsuccessfulPage() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-center">Payment Unsuccessful</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            We were unable to process your payment. This could be due to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Insufficient funds</li>
            <li>Payment was declined</li>
            <li>Transaction was cancelled</li>
            <li>Technical issues</li>
          </ul>
          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={() => router.push("/checkout")} className="w-full">
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
