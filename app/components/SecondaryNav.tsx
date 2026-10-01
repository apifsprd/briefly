"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bookmark, Menu, Search, Settings2, TrendingUp, X } from "lucide-react";

const navItems = [
  { href: "/search", label: "Search", icon: Search },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export function SecondaryNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);

  return (
    <>
      <nav aria-label="Secondary navigation" className="hidden sm:block">
        <ul className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 md:gap-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 transition-colors duration-200 ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  <Icon size={14} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 hover:border-slate-300 hover:text-slate-900 sm:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/20 sm:hidden"
          onClick={closeModal}
          aria-hidden="true"
        >
          <div
            className="absolute inset-x-3 top-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Menu
              </span>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center justify-center rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close menu"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <ul className="space-y-2 text-sm font-medium text-slate-600">
              {navItems.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeModal}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
                      pathname === href || pathname.startsWith(href + "/")
                        ? "bg-slate-900 text-white"
                        : "hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
