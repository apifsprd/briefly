import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { PrimaryNav } from "./components/PrimaryNav";
import { SecondaryNav } from "./components/SecondaryNav";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Briefly - Understand the news, not just read the news.",
  description:
    "Follow developing stories across trusted publishers, compare coverage, and read directly from the original source.",
  keywords: [
    "News",
    "Aggregator",
    "Berita Terkini",
    "Football",
    "World News",
    "Latest News",
    "RSS",
  ],
  authors: [{ name: "Your Name" }],
  metadataBase: new URL("https://briefly.apifsprd.web.id"),

  openGraph: {
    title: "Briefly - Your Daily Brief. Straight From the Sources.",
    description:
      "The official RSS-based global news aggregator. Curated sources, leading media outlets, and no distractions. World news is now more concise with Briefly.",
    url: "https://briefly.apifsprd.web.id",
    siteName: "Briefly",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Briefly - Your Daily Brief. Straight From the Sources.",
    description:
      "The official RSS-based global news aggregator. Curated sources, leading media outlets, and no distractions. World news is now more concise with Briefly.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${newsreader.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-editorial-cream text-editorial-charcoal font-sans selection:bg-neutral-900 selection:text-white">
        {/* BEGIN: SiteAnnouncementBar */}
        <aside
          className="bg-editorial-charcoal text-white text-[11px] font-medium tracking-wide py-1.5 px-4 sm:px-8"
          data-purpose="top-utility-strip"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                LIVE FEED
              </span>
              <span className="text-neutral-300 hidden sm:inline">
                Synthesizing 140+ global publications in real time
              </span>
              <span className="text-neutral-300 sm:hidden">
                Global News Digest
              </span>
            </div>
            <div className="flex items-center space-x-5 text-neutral-400">
              <span className="hidden md:inline">
                Global Editorial Edition
              </span>
              <a
                className="hover:text-white transition-colors duration-150"
                href="#quick-digest"
              >
                Jump to 5-Min Digest &darr;
              </a>
            </div>
          </div>
        </aside>
        {/* END: SiteAnnouncementBar */}

        {/* BEGIN: MainHeader */}
        <header
          className="bg-white/95 backdrop-blur-md sticky top-0 z-40 hairline-b transition-all"
          data-purpose="editorial-header"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            {/* Primary Brand & Utilities Row */}
            <div className="flex items-center justify-between h-20">
              {/* Left: Search & Quick Navigation */}
              <div className="flex items-center space-x-4 flex-1">
                <form
                  action="/search"
                  method="get"
                  className="relative w-full max-w-sm lg:max-w-md hidden sm:block"
                >
                  <input
                    name="q"
                    type="search"
                    placeholder="Cari topik, nama penerbit, isu terkini..."
                    className="w-full text-xs font-medium pl-9 pr-4 py-2.5 bg-editorial-surfaceMuted/80 border border-editorial-border/60 rounded-full focus:bg-white focus:border-editorial-charcoal focus:ring-1 focus:ring-editorial-charcoal transition-all placeholder:text-editorial-muted shadow-2xs"
                  />
                  <svg
                    className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-editorial-muted pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" x2="16.65" y1="21" y2="16.65" />
                  </svg>
                </form>
                <Link
                  href="/search"
                  aria-label="Search"
                  className="sm:hidden p-2 text-editorial-charcoal hover:bg-neutral-100 rounded-full"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </Link>
              </div>

              {/* Center: Editorial Wordmark */}
              <div className="text-center px-4">
                <Link className="inline-block group" href="/">
                  <span className="font-serif tracking-tight font-bold text-3xl sm:text-4xl text-editorial-charcoal block leading-none tracking-tighter">
                    BRIEFLY
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.28em] text-editorial-muted block mt-1 font-semibold group-hover:text-editorial-accent transition-colors">
                    The Curated Journal
                  </span>
                </Link>
              </div>

              {/* Right: Actions & Tools */}
              <div className="flex items-center justify-end space-x-2 sm:space-x-3 flex-1">
                <SecondaryNav />
              </div>
            </div>

            {/* Category Filter Pills Navigation */}
            <div className="border-t border-editorial-borderLight">
              <PrimaryNav />
            </div>
          </div>
        </header>
        {/* END: MainHeader */}

        {/* BEGIN: MainContent */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12">
          {children}
        </main>
        {/* END: MainContent */}

        {/* BEGIN: SiteFooter */}
        <footer
          className="bg-white hairline-b border-t border-editorial-border mt-20"
          data-purpose="editorial-footer"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
              {/* Left Brand & Mission */}
              <div className="md:col-span-5 space-y-4">
                <Link className="inline-block" href="/">
                  <span className="font-serif font-bold text-2xl text-editorial-charcoal tracking-tighter">
                    BRIEFLY
                  </span>
                </Link>
                <p className="text-xs text-editorial-muted leading-relaxed max-w-sm">
                  Briefly. Your daily brief from the source. Engineered for
                  maximum reading comfort, editorial integrity, and swift
                  contextual understanding.
                </p>
                <div className="text-xs font-medium text-editorial-charcoal">
                  Synthesized across vetted international publications.
                </div>
              </div>

              {/* Middle: Sections */}
              <div className="md:col-span-4 grid grid-cols-2 gap-6 text-xs">
                <div>
                  <h5 className="font-bold text-editorial-charcoal uppercase tracking-wider text-[11px] mb-3">
                    Coverage
                  </h5>
                  <ul className="space-y-2 text-editorial-muted">
                    <li>
                      <Link
                        className="hover:text-editorial-charcoal transition"
                        href="/ai"
                      >
                        Artificial Intelligence
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-editorial-charcoal transition"
                        href="/business"
                      >
                        Business &amp; Finance
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-editorial-charcoal transition"
                        href="/football"
                      >
                        Football
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-editorial-charcoal transition"
                        href="/market"
                      >
                        Global Markets
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-editorial-charcoal transition"
                        href="/tech"
                      >
                        Technology
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-editorial-charcoal transition"
                        href="/world"
                      >
                        World Affairs
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-editorial-charcoal uppercase tracking-wider text-[11px] mb-3">
                    Briefly
                  </h5>
                  <ul className="space-y-2 text-editorial-muted">
                    <li>
                      <Link
                        className="hover:text-editorial-charcoal transition"
                        href="/trending"
                      >
                        Trending Radar
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-editorial-charcoal transition"
                        href="/saved"
                      >
                        Saved Stories
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-editorial-charcoal transition"
                        href="/settings"
                      >
                        Settings &amp; Editions
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-editorial-charcoal transition"
                        href="/about"
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-editorial-charcoal transition"
                        href="/guestbook"
                      >
                        Guestbook
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right: Status & Feed */}
              <div className="md:col-span-3 text-xs text-editorial-muted space-y-3">
                <h5 className="font-bold text-editorial-charcoal uppercase tracking-wider text-[11px]">
                  System Status
                </h5>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-editorial-charcoal font-medium">
                    All Curated Feeds Operational
                  </span>
                </div>
                <p className="text-[11px] text-editorial-muted leading-relaxed">
                  Average consensus verification speed:{" "}
                  <strong>1.4 seconds</strong> per dispatch.
                </p>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-editorial-borderLight flex flex-col sm:flex-row items-center justify-between text-xs text-editorial-muted gap-4">
              <div>
                &copy; {new Date().getFullYear()} Briefly News Inc. Made with
                care for reliable coverage.
              </div>
              <div className="flex items-center space-x-6">
                <Link
                  className="hover:text-editorial-charcoal transition"
                  href="/about"
                >
                  Editorial Approach
                </Link>
                <Link
                  className="hover:text-editorial-charcoal transition"
                  href="/guestbook"
                >
                  Feedback
                </Link>
                <Link
                  className="hover:text-editorial-charcoal transition"
                  href="/settings"
                >
                  Preferences
                </Link>
              </div>
            </div>
          </div>
        </footer>
        {/* END: SiteFooter */}

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
