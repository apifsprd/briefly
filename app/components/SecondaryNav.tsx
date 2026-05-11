"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { version } from "@/package.json";

export function SecondaryNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);

  return (
    <>
      <nav aria-label="Secondary Navigation">
        {/* Desktop Navigation */}
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
              v{version}
            </a>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="sm:hidden px-3 py-2 rounded-md text-gray-500 hover:text-black transition-colors duration-300"
          aria-label="Open menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 sm:hidden"
          onClick={closeModal}
          aria-hidden="true"
        />
      )}
      {isOpen && (
        <div className="absolute top-20 left-0 right-0 z-50 sm:hidden bg-white border border-gray-200 rounded-lg shadow-2xl">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-900">Menu</span>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-black transition-colors"
                aria-label="Close menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ul className="space-y-3 text-sm font-medium text-gray-500">
              <li>
                <Link
                  href="/about"
                  onClick={closeModal}
                  className={`block transition-colors duration-300 ${
                    pathname === "/about"
                      ? "text-black font-medium"
                      : "hover:text-black"
                  }`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/guestbook"
                  onClick={closeModal}
                  className={`block transition-colors duration-300 ${
                    pathname === "/guestbook"
                      ? "text-black font-medium"
                      : "hover:text-black"
                  }`}
                >
                  Guestbook
                </Link>
              </li>
              <li className="text-gray-400 hover:text-black transition-colors duration-300 lowercase">
                <a
                  href="https://github.com/apifsprd/briefly"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeModal}
                >
                  v0.6.1-beta
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
