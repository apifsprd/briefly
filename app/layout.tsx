import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { PrimaryNav } from "./components/PrimaryNav";
import { SecondaryNav } from "./components/SecondaryNav";

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
  title: {
    default: "Briefly | Latest news from verified sources",
    template: "%s | Briefly", // Contoh: "World | Briefly"
  },
  description:
    "Briefly delivers news through ethical extraction, sourcing exclusively from official RSS feeds to ensure credibility and speed.",
  openGraph: {
    type: "website",
    locale: "en_US",
    // url: "https://briefly.com",
    siteName: "Briefly",
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
          <div className="flex-1 flex items-center justify-start sm:justify-center px-4 pb-4 lg:hidden">
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
              Briefly. Latest news from verified sources.
            </p>
            <p className="text-center sm:text-left text-gray-500 tracking-normal capitalize font-medium">
              Made with ❤️ in Indonesia
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
