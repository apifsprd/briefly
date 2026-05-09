import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { InfoIcon } from "lucide-react";

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
    default: "Briefly | Verified Daily News",
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
    >
      <body className="min-h-full flex flex-col font-sans">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center xl:hidden">
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-full">
            <InfoIcon className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            Desktop Experience Required
          </h1>
          <p className="max-w-xs text-gray-500">
            Briefly is currently optimized for larger screens. Please switch to
            a tablet or desktop for the best experience.
          </p>
        </div>

        <div className="hidden xl:flex flex-col flex-1">
          <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-16">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-serif font-bold text-2xl text-black"
                >
                  <span>Briefly</span>
                </Link>
                {/* <nav aria-label="Primary Navigation">
                  <ul className="flex items-center gap-8 font-medium text-gray-500">
                    <li>
                      <Link href="/world" className="hover:text-black">
                        World
                      </Link>
                    </li>
                    <li>
                      <Link href="/football" className="hover:text-black">
                        Football
                      </Link>
                    </li>
                  </ul>
                </nav> */}
              </div>
              <nav aria-label="Secondary Navigation">
                <ul className="flex items-center gap-8 text-sm font-medium text-gray-500">
                  <li>
                    <Link href="/about" className="hover:text-black">
                      About
                    </Link>
                  </li>
                  <li className="text-gray-300">v0.1.0</li>
                </ul>
              </nav>
            </div>
          </header>

          <main className="flex-1">
            <div className="container mx-auto px-4 py-12">{children}</div>
          </main>

          <footer className="bg-gray-100 border-t border-gray-200">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 text-sm text-gray-500">
              <p>
                &copy; {new Date().getFullYear()} Briefly. Verified Daily News.
              </p>
              <p>Made with ❤️ in Indonesia</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
