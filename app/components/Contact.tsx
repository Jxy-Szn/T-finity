import React, { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      details: formData.get("details"),
    };

    try {
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "byronjason902@gmail.com",
          subject: `Contact Form: ${data.firstName} ${data.lastName}`,
          content: `
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}

Message:
${data.details}
          `,
          category: "support",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success("Message sent successfully!");
      formRef.current?.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-4">Contact us</h2>
      <p className="text-center text-muted-foreground mb-12">
        We&apos;d love to talk about how we can help you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Card */}
        <Card className="bg-secondary text-secondary-foreground">
          <CardHeader>
            <CardTitle>Fill in the form</CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="sr-only">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="sr-only">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="sr-only">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  required
                />
              </div>

              <div>
                <Label htmlFor="details" className="sr-only">
                  Details
                </Label>
                <Textarea
                  id="details"
                  name="details"
                  placeholder="Details"
                  rows={4}
                  required
                />
              </div>

              <CardFooter className="flex flex-col items-center space-y-2 p-0">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send inquiry"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll get back to you in 1-2 business days.
                </p>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <MapPin className="mt-1" />
            <div>
              <h5 className="font-semibold">Our address</h5>
              <p className="text-sm text-muted-foreground">
                We're here to help with any questions you have about our
                products and services.
              </p>
              <address className="not-italic text-sm">
                2nd Avenue, Gwarimpa After IC World
                <br />
                Abuja, Nigeria
              </address>
            </div>
          </div>

          <div className="border-t border-border" />

          <div className="flex items-start space-x-4">
            <Mail className="mt-1" />
            <div>
              <h5 className="font-semibold">Email us</h5>
              <p className="text-sm text-muted-foreground">
                We&apos;ll get back to you as soon as possible.
              </p>
              <a
                href="mailto:byronjason902@gmail.com"
                className="text-sm underline"
              >
                byronjason902@gmail.com
              </a>
            </div>
          </div>

          <div className="border-t border-border" />

          <div className="flex items-start space-x-4">
            <Phone className="mt-1" />
            <div>
              <h5 className="font-semibold">Call us</h5>
              <p className="text-sm text-muted-foreground">
                Mon-Fri from 8am to 5pm.
              </p>
              <a href="tel:+2347052872857" className="text-sm underline">
                +234 705 287 2857
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
