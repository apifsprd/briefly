"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  {
    label: "Latest",
    href: "/",
  },
  { label: "AI", href: "/ai" },
  { label: "Business", href: "/business" },
  { label: "Football", href: "/football" },
  { label: "Tech", href: "/tech" },
  { label: "World", href: "/world" },
];

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary Navigation">
      <ul className="flex items-center gap-2 sm:gap-4 md:gap-6 font-normal text-xs sm:text-sm md:text-base text-gray-400 font-poppins tracking-normal">
        {categories.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`transition-colors duration-300  ${
                  isActive ? "text-black font-medium" : "hover:text-black"
                } `}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
