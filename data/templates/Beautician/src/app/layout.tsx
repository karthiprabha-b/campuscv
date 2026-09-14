import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elena Laurent | Master Aesthetician & Luxury Beautician Portfolio",
  description: "Bespoke beauty aesthetics, bridal artistry, clinical dermal therapies, and luxury transformations.",
  keywords: "beautician, aesthetician, bridal makeup, skincare, nail artistry, luxury beauty salon, lash extensions, dermal therapy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} ${cormorant.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#FAF7F5] text-[#1E1B1D] min-h-screen selection:bg-blush-200 selection:text-blush-900">
        {children}
      </body>
    </html>
  );
}
