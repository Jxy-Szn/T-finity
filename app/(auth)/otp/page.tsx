"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
});

export default function OTPPage() {
  const { verifyOTP } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (isVerifying) return;

    try {
      setIsVerifying(true);
      await verifyOTP(email, values.otp);
      toast.success("Email verified successfully!");
      router.push("/signin");
    } catch (error: any) {
      toast.error(error.message || "Failed to verify email");
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                          className="gap-2"
                        >
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot
                              index={0}
                              className="rounded-md border-l h-12 w-12 text-lg"
                            />
                            <InputOTPSlot
                              index={1}
                              className="rounded-md border-l h-12 w-12 text-lg"
                            />
                            <InputOTPSlot
                              index={2}
                              className="rounded-md border-l h-12 w-12 text-lg"
                            />
                          </InputOTPGroup>
                          <InputOTPSeparator className="mx-2" />
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot
                              index={3}
                              className="rounded-md border-l h-12 w-12 text-lg"
                            />
                            <InputOTPSlot
                              index={4}
                              className="rounded-md border-l h-12 w-12 text-lg"
                            />
                            <InputOTPSlot
                              index={5}
                              className="rounded-md border-l h-12 w-12 text-lg"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
