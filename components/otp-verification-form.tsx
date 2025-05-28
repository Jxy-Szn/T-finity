"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function OTPVerificationForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { verifyOTP, resendOTP, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/signup");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const otp = formData.get("otp") as string;

    try {
      await verifyOTP(email!, otp);
      toast.success("Email verified successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      await resendOTP(email!);
      setTimeLeft(60);
      setCanResend(false);
      toast.success("New OTP sent successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter the verification code sent to {email}
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            name="otp"
            type="text"
            placeholder="Enter 6-digit code"
            required
            maxLength={6}
            pattern="[0-9]{6}"
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={!canResend}
            className={cn(
              "text-purple-600 hover:text-purple-700",
              !canResend && "text-gray-400 cursor-not-allowed"
            )}
          >
            Resend code
          </button>
          {!canResend && (
            <span className="text-gray-500">Wait {timeLeft} seconds</span>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify Email"}
        </Button>
      </div>
    </form>
  );
}
