import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SuccessPageProps {
  searchParams: {
    session_id?: string;
  };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = searchParams;

  if (!session_id) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You for Your Order!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Your order has been successfully placed. We've sent a confirmation
            email with all the details.
          </p>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">Order ID: {session_id}</p>

            <div className="flex justify-center space-x-4">
              <Button asChild variant="outline">
                <Link href="/orders">View Order Status</Link>
              </Button>

              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
