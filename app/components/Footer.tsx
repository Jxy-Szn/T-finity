import { Separator } from "@/components/ui/separator";
import {
  InstagramIcon,
  TwitterIcon,
  Github,
  ArrowRight, // Import ArrowRight icon
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="pt-3 flex flex-col">
      <div className="grow bg-muted" />
      <footer>
        <div className="max-w-screen-xl mx-auto">
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              {/* The Link component is wrapped with a div to apply group hover */}
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center group text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                T-finity
                {/* ArrowRight icon that appears and moves on hover */}
                <ArrowRight className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
              </Link>
              . All rights reserved.
            </span>

            <div className="flex items-center gap-5 text-muted-foreground">
              <Link
                href="https://www.instagram.com/jxy_szn_offical"
                target="_blank"
                className="hover:text-foreground transition-colors duration-200"
              >
                <InstagramIcon className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/synergy_jxyy"
                target="_blank"
                className="hover:text-foreground transition-colors duration-200"
              >
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com/Jxy-Szn/T-finity"
                target="_blank"
                className="hover:text-foreground transition-colors duration-200"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
