import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Anushka Muthukumaran | UI/UX Designer & Frontend Developer Portfolio",
  description: "Explore the professional student portfolio of Anushka Muthukumaran. Specialized in user-centered UI/UX design systems and responsive Next.js/React web development.",
  keywords: ["Student Portfolio", "UI/UX Designer", "Frontend Developer", "Next.js 15 Template", "React Developer", "TypeScript Portfolios"],
  authors: [{ name: "Anushka Muthukumaran" }],
  openGraph: {
    title: "Anushka Muthukumaran | Creative Portfolio & Resume",
    description: "CS Student & UI/UX Specialist crafting beautiful, premium web solutions.",
    url: "https://anushka.dev",
    siteName: "Anushka Muthukumaran Portfolio",
    images: [
      {
        url: "/profile.png",
        width: 800,
        height: 800,
        alt: "Anushka Muthukumaran Profile Headshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-brand-cream text-brand-dark dark:bg-brand-obsidian dark:text-white transition-colors duration-250`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
