"use client";

import * as React from "react";
import { OTPInput as BaseOTPInput, OTPInputContext } from "input-otp";
import { cn } from "@/lib/utils";

const OTPInput = React.forwardRef<
  React.ElementRef<typeof BaseOTPInput>,
  React.ComponentPropsWithoutRef<typeof BaseOTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <BaseOTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
OTPInput.displayName = "OTPInput";

const OTPInputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
OTPInputGroup.displayName = "OTPInputGroup";

const OTPInputSlot = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
    >
      <input
        ref={ref}
        className={cn(
          "absolute inset-0 h-full w-full text-center text-lg caret-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        {...props}
      />
      {char && <div className="text-lg">{char}</div>}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center animate-caret-blink">
          <div className="h-4 w-px bg-foreground duration-150" />
        </div>
      )}
    </div>
  );
});
OTPInputSlot.displayName = "OTPInputSlot";

export { OTPInput, OTPInputGroup, OTPInputSlot };
