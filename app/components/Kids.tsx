"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Kids() {
  return (
    <div className="bg-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            New Arrivals
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Dress Your Little Ones in Style
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover our adorable and comfortable collection of children's
            clothing, perfect for every adventure.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          <Link
            href="#"
            className="group relative block overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md"
          >
            <Image
              src="/img/kids/kids1.png"
              alt="Colorful Kids T-Shirt"
              width={400}
              height={500}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-sm font-medium text-white">
                Colorful Kids T-Shirt
              </p>
              <p className="text-xs text-white/80">From $12</p>
            </div>
          </Link>

          <Link
            href="#"
            className="group relative block overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md"
          >
            <Image
              src="/img/kids/kids2.png"
              alt="Durable Kids Jeans"
              width={400}
              height={500}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-sm font-medium text-white">
                Durable Kids Pyjamas
              </p>
              <p className="text-xs text-white/80">From $25</p>
            </div>
          </Link>

          <Link
            href="#"
            className="group relative hidden overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md sm:block"
          >
            <Image
              src="/img/kids/kids3.png"
              alt="Cozy Kids Hoodie"
              width={400}
              height={500}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-sm font-medium text-white">Cozy Gym wears</p>
              <p className="text-xs text-white/80">$30</p>
            </div>
          </Link>

          <Link
            href="#"
            className="group relative hidden overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md lg:block"
          >
            <Image
              src="/img/kids/kids4.png"
              alt="Adorable Kids Dress"
              width={400}
              height={500}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-sm font-medium text-white">
                Adorable Kids sports
              </p>
              <p className="text-xs text-white/80">$28</p>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="#">Shop All Kids Clothing</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
