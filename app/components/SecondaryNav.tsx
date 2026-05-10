"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SecondaryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Secondary Navigation">
      <ul className="hidden sm:flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-gray-500">
        <li>
          <Link
            href="/about"
            className={`transition-colors duration-300  ${
              pathname === "/about"
                ? "text-black font-medium"
                : "hover:text-black"
            } `}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/guestbook"
            className={`transition-colors duration-300  ${
              pathname === "/guestbook"
                ? "text-black font-medium"
                : "hover:text-black"
            } `}
          >
            Guestbook
          </Link>
        </li>
        <li className="hidden sm:flex flex-row gap-2 text-gray-400 hover:text-black transition-colors duration-300 lowercase">
          <a
            href="https://github.com/apifsprd/briefly"
            target="_blank"
            rel="noopener noreferrer"
          >
            v0.5.0-beta
          </a>
        </li>
      </ul>
    </nav>
  );
}
