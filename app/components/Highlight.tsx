import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Highlight() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            {/* Updated title to reflect custom t-shirt design */}
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Design it. Buyit.
            </h2>
            {/* Updated description for t-shirt design platform */}
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Design your unique vision on premium t-shirts with our easy-to-use
              tool and high-quality printing.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              <li>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    {/* Feature 1: Easy Design Tool */}
                    <h3 className="text-xl font-bold">Intuitive Design Tool</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Our user-friendly interface makes it simple to upload
                    images, add text, and choose colors to create your perfect
                    design.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    {/* Feature 2: High-Quality Printing */}
                    <h3 className="text-xl font-bold">
                      Vibrant, Durable Prints
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    We use advanced printing technology to ensure your designs
                    are sharp, vibrant, and long-lasting, wash after wash.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    {/* Feature 3: Premium T-Shirt Quality */}
                    <h3 className="text-xl font-bold">
                      Comfortable & Premium T-Shirts
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Choose from a wide selection of high-quality, soft, and
                    comfortable t-shirts that serve as the perfect canvas for
                    your creativity.
                  </p>
                </div>
              </li>
            </ul>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {/* Button text updated */}
              <Link href="/design">
                <Button className="hover:cursor-pointer" size="lg">
                  Start Designing
                </Button>
              </Link>
              <Link href="/all">
                <Button
                  className="hover:cursor-pointer"
                  size="lg"
                  variant="outline"
                >
                  Explore Gallery
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-background/50"></div>
            {/* Placeholder image for t-shirt design */}
            <img
              src="/img1.jpg"
              alt="T-shirt design"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
