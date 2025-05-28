"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: { quote: string; name: string; title: string }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    // Duplicate items for seamless looping
    if (scrollerRef.current) {
      Array.from(scrollerRef.current.children).forEach((item) => {
        scrollerRef.current?.appendChild(item.cloneNode(true));
      });
    }
    // Set CSS vars
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
      const duration =
        speed === "fast" ? "20s" :
        speed === "slow" ? "80s" : "40s";
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
    setStart(true);
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item) => (
          <li
            key={item.name}
            className="w-[350px] shrink-0 rounded-2xl border border-b-0 border-zinc-200 bg-gradient-to-b from-white to-zinc-50 px-8 py-6 dark:border-zinc-700 dark:bg-gradient-to-b from-zinc-800 to-zinc-900"
          >
            <blockquote>
              <p className="text-sm text-neutral-800 dark:text-gray-100">
                {item.quote}
              </p>
              <footer className="mt-4 text-sm text-neutral-500 dark:text-gray-400">
                — {item.name}, {item.title}
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
