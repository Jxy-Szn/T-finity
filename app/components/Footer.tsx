import { Separator } from "@/components/ui/separator";
import {
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  Github,
  Shirt,
  ShirtIcon,
} from "lucide-react";
import Link from "next/link";

const footerSections = [
  {
    title: "Product",
    links: [
      { title: "Overview", href: "#" },
      { title: "Features", href: "#" },
      { title: "Solutions", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About us", href: "/about" },
      { title: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Blog", href: "#" },
      { title: "Newsletter", href: "#" },
      { title: "Events", href: "#" },
    ],
  },
  {
    title: "Other Products",
    links: [
      { title: "Sports", href: "#" },
      { title: "Fancy", href: "#" },
      { title: "Spring", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Terms", href: "#" },
      { title: "Privacy", href: "#" },
      { title: "Cookies", href: "/dashboard" },
    ],
  },
];

const Footer = () => {
  return (
    <div className="pt-3 flex flex-col">
      <div className="grow bg-muted" />
      <footer>
        <div className="max-w-screen-xl mx-auto">
          <div className="py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6 xl:px-0">
            <div className="col-span-full xl:col-span-2 flex items-center">
              <ShirtIcon width="40" height="40" />
              <p className="text-4xl">Tfinity</p>
            </div>

            {footerSections.map(({ title, links }) => (
              <div key={title}>
                <h6 className="font-semibold">{title}</h6>
                <ul className="mt-6 space-y-4">
                  {links.map(({ title, href }) => (
                    <li key={title}>
                      <Link
                        href={href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              <Link href="/" target="_blank">
                T-finity
              </Link>
              . All rights reserved.
            </span>

            <div className="flex items-center gap-5 text-muted-foreground">
              <Link
                href="https://www.instagram.com/jxy_szn_offical"
                target="_blank"
              >
                <InstagramIcon className="h-5 w-5" />
              </Link>
              <Link href="https://x.com/synergy_jxyy" target="_blank">
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link href="https://github.com/Jxy-Szn/T-finity" target="_blank">
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
