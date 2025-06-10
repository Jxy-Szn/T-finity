"use client"; // Added directive to make this a Client Component

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link"; // Added Link for the "Sign up" link
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, Mail, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Schema for login validation
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { login } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLoggingIn) return;

    try {
      setIsLoggingIn(true);
      console.log("[LoginForm] Starting login attempt...");
      const user = await login(values.email, values.password);
      console.log(
        "[LoginForm] Login successful, user data:",
        JSON.stringify(user, null, 2)
      );
      toast.success("Login successful!");

      // Debug log for role check
      console.log("[LoginForm] Role check:", {
        role: user.role,
        roleType: typeof user.role,
        isAdmin: user.role === "admin",
        currentPath: window.location.pathname,
      });

      // Redirect based on user role
      if (user.role === "admin") {
        console.log("[LoginForm] Attempting to redirect to dashboard...");
        try {
          // Force a hard navigation to dashboard
          window.location.href = "/dashboard";
          console.log("[LoginForm] Hard navigation to dashboard initiated");
        } catch (redirectError) {
          console.error("[LoginForm] Redirect error:", redirectError);
        }
      } else {
        console.log("[LoginForm] Attempting to redirect to home...");
        try {
          // Force a hard navigation to home
          window.location.href = "/";
          console.log("[LoginForm] Hard navigation to home initiated");
        } catch (redirectError) {
          console.error("[LoginForm] Redirect error:", redirectError);
        }
      }
    } catch (error: any) {
      console.error("[LoginForm] Login error:", {
        message: error.message,
        type: typeof error,
        stack: error.stack,
      });
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="m@example.com"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="*******"
                      autoComplete="current-password"
                      {...field}
                    />
                    <Button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 stroke-2" />
                      ) : (
                        <Eye className="h-5 w-5 stroke-2" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <div className="flex justify-end mt-1">
                  <Link
                    href="/auth/forgot"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "Login"}
          </Button>

          {/* OAuth Providers Section */}
          <div className="relative text-center text-sm">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              type="button"
              className="flex-1 bg-white hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => toast("Google login coming soon")}
            >
              <Mail className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              type="button"
              className="flex-1 bg-white hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => toast("X login coming soon")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </Button>
            <Button
              variant="outline"
              type="button"
              className="flex-1 bg-white hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => toast("GitHub login coming soon")}
            >
              <Github className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
