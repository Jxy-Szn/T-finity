"use client"; // This component will be a client component due to interactivity

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

// Helper component for animating a single number
const AnimatedCounter = ({ from, to, duration = 2000, suffix = "" }) => {
  const [currentNumber, setCurrentNumber] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 }); // Trigger once when 50% in view
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      // Start the animation when the component is in view
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      });

      let startTimestamp = null;
      const animateCount = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = timestamp - startTimestamp;
        const percentage = Math.min(progress / duration, 1);
        const easedPercentage = easeOutQuad(percentage); // Apply easing function
        const newValue = Math.floor(from + (to - from) * easedPercentage);

        setCurrentNumber(newValue);

        if (percentage < 1) {
          requestAnimationFrame(animateCount);
        } else {
          setCurrentNumber(to); // Ensure it ends exactly at 'to'
        }
      };

      requestAnimationFrame(animateCount);
    }
  }, [isInView, from, to, duration, controls]);

  // Simple quadratic easing function
  const easeOutQuad = (t) => t * (2 - t);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }} // Initial state for animation
      animate={controls}
      className="text-5xl font-bold"
    >
      {currentNumber.toLocaleString()}
      {suffix}
    </motion.div>
  );
};

export default function StatsSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-4xl font-medium lg:text-5xl">
            T-finity in numbers
          </h2>
          <p>
            Gemini is evolving to be more than just the models. It supports an
            entire to the APIs and platforms helping developers and businesses
            innovate.
          </p>
        </div>

        <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
          <div className="space-y-4">
            {/* Animated Counter for Stars on Trust Pilot */}
            <AnimatedCounter from={0} to={1200} suffix="+" />
            <p>Stars on Trust Pilot</p>
          </div>
          <div className="space-y-4">
            {/* Animated Counter for Active Users */}
            <AnimatedCounter from={0} to={5000000} />
            <p>Active Users</p>
          </div>
          <div className="space-y-4">
            {/* Animated Counter for T-shirt Designs */}
            <AnimatedCounter from={0} to={500} suffix="+" />
            <p>T-shirt Designs</p>
          </div>
        </div>
      </div>
    </section>
  );
}
