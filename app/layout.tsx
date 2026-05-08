import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/top-nav";

 
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});


const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora', 
});


export const metadata: Metadata = {
  title: "Briefly",
  description: "A free verified news for your daily brief",
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
      <body className="min-h-full flex flex-col ">
        <TopNav />
        {children}
      </body>
    </html>
  );
}
