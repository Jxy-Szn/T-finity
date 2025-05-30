import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import LogoSlider from "./logo-slider";
import Link from "next/link";

const Logo = () => {
  const companies = [
    "/img/logo-slider/image10.png",
    "/img/logo-slider/image11.png",
    "/img/logo-slider/image12.png",
    "/img/logo-slider/image13.png",
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
            Join thousands of individuals and brands that trust our t-shirt
            solutions to elevate their style and express their unique identity.
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
