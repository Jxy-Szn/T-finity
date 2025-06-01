"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "../../components/ui/images-slider";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  const images = [
    "/img/hero/slide1.webp",
    "/img/hero/slide2.jpg",
    "/img/hero/slide3.jpg",
    "/img/hero/slide4.png",
    "/img/hero/slide5.jpg",
    "/img/hero/slide6.jpg",
  ];
  return (
    <ImagesSlider className="h-[25rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Unleash Creativity On Your Shirts,
          <br />
          Make them truly yours
        </motion.p>
        <Link href="/design">
          <Button className=" text-lg hover:cursor-pointer">
            <span>Start Designing→</span>
          </Button>
        </Link>
      </motion.div>
    </ImagesSlider>
  );
}
