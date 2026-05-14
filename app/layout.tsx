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
  title: "Briefly - Your Daily Brief. Straight From the Sources.",
  description:
    "The official RSS-based global news aggregator. Curated sources, leading media outlets, and no distractions. World news is now more concise with Briefly.",
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
        url: "/og-image.png",
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
        {/* Load Library GA4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        {/* Inisialisasi GA4 */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-serif font-bold text-lg sm:text-2xl text-black shrink-0"
            >
              <span>Briefly</span>
            </Link>
            <div className="flex-1 hidden lg:flex items-center justify-start sm:justify-center px-4 sm:px-8">
              <PrimaryNav />
            </div>
            <SecondaryNav />
          </div>
          <div className="flex-1 flex overflow-x-auto overflow-y-hidden scrollbar-hide px-4 pb-4 lg:hidden">
            <PrimaryNav />
          </div>
        </header>

        <main className="flex-1">
          <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
            {children}
          </div>
        </main>

        <footer className="bg-gray-100 border-t border-gray-200 mt-8">
          <div className="container mx-auto flex flex-col sm:flex-row gap-4 sm:gap-0 sm:h-20 items-center justify-between px-3 sm:px-4 py-6 sm:py-0 text-xs sm:text-sm text-gray-500">
            <p className="text-center sm:text-left text-gray-500 tracking-normal capitalize font-medium">
              Briefly. Your Daily Brief. Straight From the Sources.
            </p>
            <p className="text-center sm:text-left text-gray-500 tracking-normal capitalize font-medium">
              Made with ❤️ in Indonesia
            </p>
          </div>
        </footer>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
