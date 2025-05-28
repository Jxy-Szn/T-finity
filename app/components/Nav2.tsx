"use client";
import React from "react";
import Link from "next/link";

const menuItems = [
  { name: "Men", href: "/men" },
  { name: "Women", href: "/women" },
  { name: "Children", href: "/children" },
  { name: "Summer", href: "/summer" },
  { name: "Sales", href: "/sales" },
];

const BreadcrumbNav: React.FC = () => {
  return (
    <nav className="w-full bg-background shadow px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.name}>
            <Link
              href={item.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap px-2"
              prefetch={false}
            >
              <span className="cursor-pointer">{item.name}</span>
            </Link>
            {index < menuItems.length - 1 && (
              <div className="h-4 w-[1px] bg-border flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default BreadcrumbNav;
