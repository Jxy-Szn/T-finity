import { Shirt } from "lucide-react";

import { SignUpForm } from "@/app/components/SignupForm";
import Link from "next/link";

export default function Page() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Shirt className="size-4" />
            </div>
            T-finity
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          {/* Changed max-w-xs to max-w-md to make the card wider */}
          <div className="w-full max-w-md">
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <video
          src="/videos/signUp.mp4"
          poster="/placeholder.svg"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
