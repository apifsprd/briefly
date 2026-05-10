"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { label: "World", href: "/world" },
  { label: "Football", href: "/football" },
];

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary Navigation">
      <ul className="flex items-center gap-4 sm:gap-6 md:gap-8 font-normal text-xs sm:text-sm md:text-base text-gray-400 font-poppins tracking-normal">
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
