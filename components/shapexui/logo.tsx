import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import LogoSlider from "./logo-slider";
import Link from "next/link";

const Logo = () => {
  const companies = [
    "/img/logo-slider/image1.png",
    "/img/logo-slider/image2.png",
    "/img/logo-slider/image3.png",
    "/img/logo-slider/image4.png",
    "/img/logo-slider/image5.png",
    "/img/logo-slider/image6.png",
    "/img/logo-slider/image7.png",
    "/img/logo-slider/image8.png",
    "/img/logo-slider/image9.png",
  ];

  return (
    <section className="py-16 container mx-auto rounded-xl ">
      <div className="grid lg:grid-cols-3 ">
        <div className="lg:col-span-1 text-center lg:text-left">
          <h2 className="text-4xl font-semibold leading-tight">
            Trusted by companies <br />
            <span className="p-2 italic text-4xl font-sans font-bold bg-gradient-to-r from-purple-600  via-purple-500 to-purple-300 bg-clip-text text-transparent">
              all over the world
            </span>
          </h2>
          <p className="mt-4 text-lg">
            Join thousands of organizations that rely on our solutions to
            elevate their business. From startups to enterprises, we help
            everyone achieve their goals with cutting-edge technology.
          </p>
          <Link href="/about">
            <Button className="mt-8 flex items-center space-x-2 hover:cursor-pointer">
              <span>Learn More</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="lg:col-span-2">
          <LogoSlider companies={companies} />
        </div>
      </div>
    </section>
  );
};

export default Logo;
