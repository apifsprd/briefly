"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bookmark, Menu, Settings2, X } from "lucide-react";

export function SecondaryNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);

  return (
    <>
      <div className="hidden sm:flex items-center space-x-2 sm:space-x-3">
        <Link
          href="/saved"
          className={`p-2 rounded-full transition-colors relative ${
            pathname === "/saved"
              ? "text-editorial-accent bg-orange-50"
              : "text-editorial-charcoal hover:text-editorial-accent hover:bg-neutral-100"
          }`}
          title="Saved Articles"
          aria-label="Saved Articles"
        >
          <Bookmark size={16} aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-editorial-accent rounded-full ring-2 ring-white" />
        </Link>

        <Link
          href="/settings"
          className={`p-2 rounded-full transition-colors ${
            pathname === "/settings"
              ? "text-editorial-accent bg-orange-50"
              : "text-editorial-charcoal hover:text-editorial-accent hover:bg-neutral-100"
          }`}
          title="Settings & Preferences"
          aria-label="Settings & Preferences"
        >
          <Settings2 size={16} aria-hidden="true" />
        </Link>

        <Link
          href="/settings"
          className="inline-flex items-center text-xs font-semibold px-3.5 py-1.5 rounded-full bg-editorial-charcoal text-white hover:bg-black transition shadow-sm"
        >
          Editions
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-full border border-editorial-border bg-white p-2 text-editorial-charcoal hover:bg-neutral-100 sm:hidden"
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
            className="absolute inset-x-3 top-20 rounded-2xl border border-editorial-border bg-white p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-editorial-borderLight pb-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-editorial-muted">
                Briefly Menu
              </span>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center justify-center rounded-full p-2 text-editorial-muted hover:bg-neutral-100 hover:text-editorial-charcoal"
                aria-label="Close menu"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <ul className="space-y-1.5 text-sm font-medium text-editorial-body">
              <li>
                <Link
                  href="/search"
                  onClick={closeModal}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-neutral-100"
                >
                  <span>Search News</span>
                  <span className="text-neutral-400">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/trending"
                  onClick={closeModal}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-neutral-100"
                >
                  <span>Trending Radar</span>
                  <span className="text-neutral-400">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/saved"
                  onClick={closeModal}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-neutral-100"
                >
                  <span>Saved Stories</span>
                  <span className="text-neutral-400">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  onClick={closeModal}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-neutral-100"
                >
                  <span>Editions &amp; Preferences</span>
                  <span className="text-neutral-400">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={closeModal}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-neutral-100"
                >
                  <span>About Briefly</span>
                  <span className="text-neutral-400">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/guestbook"
                  onClick={closeModal}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-neutral-100"
                >
                  <span>Guestbook</span>
                  <span className="text-neutral-400">&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
