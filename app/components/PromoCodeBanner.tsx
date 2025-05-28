"use client";

import { useEffect, useState } from "react";

export function PromoCodeBanner() {
  const promoCode = "MAYHEM10";
  const [timeLeft, setTimeLeft] = useState(3 * 24 * 60 * 60); // 3 days in seconds
  const [copied, setCopied] = useState(false);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const formatTime = (sec: number) => {
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${d}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="w-full bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-center space-x-3 px-4 py-1">
        <span className="text-xs font-medium text-foreground">
          Ends in {formatTime(timeLeft)}
        </span>

        <span className="text-xs font-semibold text-foreground">
          {promoCode}
        </span>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-0.5 text-xs text-foreground transition hover:text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M9 9V6.2c0-1.12 0-1.68.218-2.108c.192-.377.497-.682.874-.874C10.52 3 11.08 3 12.2 3h5.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C21 4.52 21 5.08 21 6.2v5.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C19.48 15 18.92 15 17.803 15H15M9 9H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 10.52 3 11.08 3 12.2v5.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h5.607c1.117 0 1.676 0 2.104-.218a2 2 0 0 0 .874-.874c.218-.428.218-.987.218-2.105V15M9 9h2.8c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874c.218.427.218.987.218 2.105V15" />
          </svg>
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}
