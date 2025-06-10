"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PromocodeFormSkeleton } from "@/components/skeletons/promocode-form-skeleton";

export default function NewPromocodePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage"
  );
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useState(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      code: formData.get("code") as string,
      discount: Number(formData.get("discount")),
      type: formData.get("type") as "percentage" | "fixed",
      maxUsage: Number(formData.get("maxUsage")),
      expiresAt: formData.get("expiresAt") as string,
    };

    try {
      const response = await fetch("/api/promocodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create promocode");
      }

      toast.success("Promocode created successfully");
      router.push("/dashboard/promocodes");
    } catch (error: any) {
      toast.error(error.message || "Failed to create promocode");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <PromocodeFormSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Create New Promocode</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="code">Promocode</Label>
            <Input
              id="code"
              name="code"
              placeholder="Enter promocode"
              required
              pattern="[A-Z0-9]+"
              title="Only uppercase letters and numbers allowed"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Discount Type</Label>
            <Select
              name="type"
              required
              defaultValue="percentage"
              onValueChange={(value: "percentage" | "fixed") =>
                setDiscountType(value)
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount Value</Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              min="1"
              max={discountType === "percentage" ? "100" : "1000"}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxUsage">Maximum Usage</Label>
            <Input
              id="maxUsage"
              name="maxUsage"
              type="number"
              min="1"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiry Date</Label>
            <Input
              id="expiresAt"
              name="expiresAt"
              type="datetime-local"
              required
              min={new Date().toISOString().slice(0, 16)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Promocode"}
          </Button>
        </div>
      </form>
    </div>
  );
}
