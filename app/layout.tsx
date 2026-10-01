import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { PrimaryNav } from "./components/PrimaryNav";
import { SecondaryNav } from "./components/SecondaryNav";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
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
      className={`${poppins.variable} ${lora.variable} h-full antialiased`}
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
      <body className="min-h-screen bg-background text-slate-900">
        <aside className="bg-slate-950 px-3 py-1.5 text-[11px] font-medium text-white sm:px-4 lg:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="shrink-0 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                NEWS FEED
              </span>
              <span className="truncate text-slate-300">
                Stories from trusted publications, in one clear view
              </span>
            </div>
            <Link
              href="#latest"
              className="shrink-0 text-slate-300 transition-colors hover:text-white"
            >
              Jump to latest <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </aside>

        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
            <div className="flex h-[4.5rem] items-center justify-between gap-4">
              <Link
                href="/"
                className="shrink-0 text-center"
                aria-label="Briefly home"
              >
                <span className="block font-serif text-2xl font-bold leading-none tracking-[-0.06em] text-slate-950 sm:text-3xl">
                  BRIEFLY
                </span>
                <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:block">
                  The curated journal
                </span>
              </Link>
              <SecondaryNav />
            </div>

            <div className="border-t border-slate-100 py-2.5">
              <PrimaryNav />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-4 sm:py-8 lg:px-6 lg:py-10">
          {children}
        </main>

        <footer className="mt-12 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-3 py-10 sm:px-4 sm:py-12 lg:px-6">
            <div className="grid gap-8 border-b border-slate-200 pb-8 md:grid-cols-12">
              <div className="space-y-3 md:col-span-5">
                <Link
                  href="/"
                  className="inline-block font-serif text-2xl font-bold tracking-[-0.06em] text-slate-950"
                >
                  BRIEFLY
                </Link>
                <p className="max-w-sm text-sm text-slate-600">
                  Your daily brief from the source. Follow developing stories,
                  compare coverage, and read from the original publishers.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm md:col-span-4">
                <div>
                  <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900">
                    Coverage
                  </h2>
                  <ul className="space-y-2 text-slate-600">
                    <li>
                      <Link className="hover:text-slate-950" href="/ai">
                        Artificial Intelligence
                      </Link>
                    </li>
                    <li>
                      <Link className="hover:text-slate-950" href="/business">
                        Business &amp; Finance
                      </Link>
                    </li>
                    <li>
                      <Link className="hover:text-slate-950" href="/football">
                        Football
                      </Link>
                    </li>
                    <li>
                      <Link className="hover:text-slate-950" href="/market">
                        Markets
                      </Link>
                    </li>
                    <li>
                      <Link className="hover:text-slate-950" href="/tech">
                        Technology
                      </Link>
                    </li>
                    <li>
                      <Link className="hover:text-slate-950" href="/world">
                        World Affairs
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900">
                    Briefly
                  </h2>
                  <ul className="space-y-2 text-slate-600">
                    <li>
                      <Link className="hover:text-slate-950" href="/trending">
                        Trending
                      </Link>
                    </li>
                    <li>
                      <Link className="hover:text-slate-950" href="/saved">
                        Saved stories
                      </Link>
                    </li>
                    <li>
                      <Link className="hover:text-slate-950" href="/about">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link className="hover:text-slate-950" href="/guestbook">
                        Guestbook
                      </Link>
                    </li>
                    <li>
                      <Link className="hover:text-slate-950" href="/settings">
                        Settings
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 md:col-span-3">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900">
                  Reading Briefly
                </h2>
                <p>
                  Explore multiple publishers covering the same story, then
                  continue to the original reporting.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:text-orange-700"
                >
                  About our approach <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-3 pt-6 text-xs text-slate-500 sm:flex-row">
              <p>
                © {new Date().getFullYear()} Briefly. Made for clearer coverage.
              </p>
              <Link href="/guestbook" className="hover:text-slate-900">
                Send feedback
              </Link>
            </div>
          </div>
        </footer>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
