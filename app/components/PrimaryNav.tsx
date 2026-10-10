"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp } from "lucide-react";

const categories = [
  { label: "Overview", href: "/" },
  { label: "Artificial Intelligence", href: "/ai" },
  { label: "Business & Finance", href: "/business" },
  { label: "Football", href: "/football" },
  { label: "Markets", href: "/market" },
  { label: "Technology", href: "/tech" },
  { label: "World Affairs", href: "/world" },
];

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Editorial categories"
      className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar text-xs"
    >
      {categories.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition ${
              isActive
                ? "font-semibold bg-editorial-charcoal text-white"
                : "font-medium text-editorial-body hover:text-editorial-charcoal hover:bg-neutral-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <span className="text-neutral-300 px-1" aria-hidden="true">
        |
      </span>
      <Link
        href="/trending"
        className={`px-3 py-1 rounded-full font-medium whitespace-nowrap flex items-center space-x-1 transition ${
          pathname === "/trending"
            ? "bg-amber-600 text-white font-semibold"
            : "text-amber-800 bg-amber-50 hover:bg-amber-100"
        }`}
      >
        <TrendingUp
          size={12}
          className={pathname === "/trending" ? "text-white" : "text-amber-600"}
          aria-hidden="true"
        />
        <span>Trending Radar</span>
      </Link>
    </nav>
  );
}
