"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { label: "Overview", href: "/" },
  { label: "Artificial Intelligence", href: "/ai" },
  { label: "Business & Finance", href: "/business" },
  { label: "Football", href: "/football" },
  { label: "Markets", href: "/market" },
  { label: "Technology", href: "/tech" },
  { label: "World Affairs", href: "/world" },
  { label: "Trending Radar", href: "/trending" },
];

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation">
      <ul className="flex w-full items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs font-medium text-slate-600 sm:gap-2">
        {categories.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`inline-flex rounded-full px-3 py-1.5 transition-colors duration-200 ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "hover:bg-slate-100 hover:text-slate-900"
                }`}
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
